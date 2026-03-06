import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Database, Table2, ChevronDown, ChevronRight,
    RefreshCw, Search, Eye, Hash, Columns, LayoutGrid,
    Download, Trash2, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';
import ControllerSidebar from './ControllerSidebar';

const ControllerDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('dev_token');

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [previewTable, setPreviewTable] = useState(null); // { name, rows, fields, pkColumn }
    const [previewLoading, setPreviewLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    // Per-row delete state: { rowIndex: 'confirming' | 'deleting' | 'done' | 'error' }
    const [rowDeleteState, setRowDeleteState] = useState({});

    useEffect(() => {
        if (!token) { navigate('/controller'); return; }
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/controller/tables`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { localStorage.removeItem('dev_token'); navigate('/controller'); return; }
            const data = await res.json();
            setTables(data.tables || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Detect PK column: prefer 'id', else first column
    const detectPkColumn = (fields) => {
        if (fields.includes('id')) return 'id';
        return fields[0] || null;
    };

    const fetchPreview = async (tableName) => {
        if (previewTable?.name === tableName) {
            setPreviewTable(null);
            setRowDeleteState({});
            return;
        }
        setPreviewLoading(true);
        setPreviewTable(null);
        setRowDeleteState({});
        try {
            const res = await fetch(`${API_URL}/api/controller/table/${tableName}/data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const pkColumn = detectPkColumn(data.fields || []);
            setPreviewTable({ name: tableName, rows: data.rows, fields: data.fields, pkColumn });
        } catch (err) {
            console.error(err);
        } finally {
            setPreviewLoading(false);
        }
    };

    // --- Delete individual row ---
    const startRowDelete = (rowIndex) => {
        setRowDeleteState(prev => ({ ...prev, [rowIndex]: 'confirming' }));
    };

    const cancelRowDelete = (rowIndex) => {
        setRowDeleteState(prev => {
            const next = { ...prev };
            delete next[rowIndex];
            return next;
        });
    };

    const confirmRowDelete = async (rowIndex) => {
        if (!previewTable?.pkColumn) return;
        const row = previewTable.rows[rowIndex];
        const pkValue = row[previewTable.pkColumn];

        setRowDeleteState(prev => ({ ...prev, [rowIndex]: 'deleting' }));
        try {
            const res = await fetch(
                `${API_URL}/api/controller/table/${previewTable.name}/row`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pkColumn: previewTable.pkColumn, pkValue })
                }
            );
            if (res.ok) {
                // Remove row from local state immediately for instant feedback
                setPreviewTable(prev => ({
                    ...prev,
                    rows: prev.rows.filter((_, i) => i !== rowIndex)
                }));
                setRowDeleteState(prev => {
                    const next = { ...prev };
                    delete next[rowIndex];
                    return next;
                });
                // Update the table row count in the sidebar list
                setTables(prev => prev.map(t =>
                    t.name === previewTable.name
                        ? { ...t, rowCount: Math.max(0, t.rowCount - 1) }
                        : t
                ));
            } else {
                const err = await res.json();
                console.error('Row delete failed:', err.message);
                setRowDeleteState(prev => ({ ...prev, [rowIndex]: 'error' }));
                setTimeout(() => cancelRowDelete(rowIndex), 2000);
            }
        } catch (err) {
            console.error(err);
            setRowDeleteState(prev => ({ ...prev, [rowIndex]: 'error' }));
            setTimeout(() => cancelRowDelete(rowIndex), 2000);
        }
    };

    const exportDb = async (includeData) => {
        setExportOpen(false);
        if (exportLoading) return;
        setExportLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/api/controller/export?includeData=${includeData}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (!res.ok) { const e = await res.json(); alert('Export failed: ' + e.message); return; }
            const blob = await res.blob();
            const disposition = res.headers.get('Content-Disposition') || '';
            const match = disposition.match(/filename="?([^"]+)"?/);
            const fname = match ? match[1] : `fmac_db_export.sql`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fname; a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export error: ' + err.message);
        } finally {
            setExportLoading(false);
        }
    };

    const filtered = tables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    const totalRows = tables.reduce((sum, t) => sum + t.rowCount, 0);
    const totalCols = tables.reduce((sum, t) => sum + t.columns.length, 0);

    const typeColor = (type) => {
        if (type.includes('int') || type.includes('numeric') || type.includes('float')) return 'text-blue-400';
        if (type.includes('char') || type.includes('text')) return 'text-green-400';
        if (type.includes('bool')) return 'text-yellow-400';
        if (type.includes('timestamp') || type.includes('date')) return 'text-purple-400';
        return 'text-gray-400';
    };

    return (
        <div className="h-screen bg-gray-950 text-white flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
            <ControllerSidebar />

            <div className="flex-1 flex flex-col min-w-0 ml-56">
                {/* Top Bar */}
                <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-sm font-bold text-white">Database Inspector</span>
                            <span className="ml-3 text-xs text-gray-500 font-mono">schema &amp; data preview</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchTables}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors font-mono">
                            <RefreshCw size={13} /> Refresh
                        </button>

                        {/* Export dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setExportOpen(o => !o)}
                                disabled={exportLoading}
                                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 disabled:opacity-50 transition-all"
                            >
                                <Download size={13} />
                                {exportLoading ? 'Exporting…' : 'Export SQL'}
                                <ChevronDown size={11} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {exportOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                                        <div className="px-3 pt-2.5 pb-1">
                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Export as .sql</p>
                                        </div>
                                        <button onClick={() => exportDb(false)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-mono text-gray-300 hover:bg-gray-800 flex items-center gap-2.5 transition-colors">
                                            <span className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <Database size={11} className="text-purple-400" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Schema Only</p>
                                                <p className="text-[10px] text-gray-500">CREATE TABLE — no data</p>
                                            </div>
                                        </button>
                                        <button onClick={() => exportDb(true)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-mono text-gray-300 hover:bg-gray-800 flex items-center gap-2.5 transition-colors border-t border-gray-800">
                                            <span className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <Download size={11} className="text-green-400" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Schema + Data</p>
                                                <p className="text-[10px] text-gray-500">CREATE + INSERT INTO</p>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-5">

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Database, label: 'Tables', value: tables.length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                                { icon: Hash, label: 'Total Rows', value: totalRows.toLocaleString(), color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                                { icon: Columns, label: 'Total Columns', value: totalCols, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                            ].map(s => (
                                <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-4 ${s.bg}`}>
                                    <div className={`p-2 rounded-lg ${s.bg}`}>
                                        <s.icon size={20} className={s.color} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{loading ? '—' : s.value}</p>
                                        <p className={`text-xs font-mono ${s.color}`}>{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search tables…"
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-all"
                            />
                        </div>

                        {/* Table List */}
                        {loading ? (
                            <div className="text-center py-16 text-gray-600 font-mono text-sm">Loading database schema…</div>
                        ) : (
                            <div className="space-y-2">
                                {filtered.map(table => (
                                    <div key={table.name} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                                        {/* Table header row */}
                                        <div className="flex items-center justify-between px-5 py-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <button
                                                    onClick={() => setExpanded(expanded === table.name ? null : table.name)}
                                                    className="text-gray-500 hover:text-green-400 transition-colors flex-shrink-0">
                                                    {expanded === table.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                                <Table2 size={16} className="text-green-500 flex-shrink-0" />
                                                <span className="font-mono text-sm font-semibold text-white">{table.name}</span>
                                                <span className="text-xs font-mono text-gray-600">
                                                    {table.columns.length} col{table.columns.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold
                                                    ${table.rowCount > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-600 border border-gray-700'}`}>
                                                    {table.rowCount.toLocaleString()} rows
                                                </span>

                                                {/* Preview / Data button */}
                                                <button
                                                    onClick={() => fetchPreview(table.name)}
                                                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all
                                                        ${previewTable?.name === table.name
                                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                            : 'border-gray-700 text-gray-500 hover:border-blue-500/30 hover:text-blue-400'}`}>
                                                    <Eye size={12} /> Data
                                                </button>
                                            </div>
                                        </div>

                                        {/* Column Details */}
                                        {expanded === table.name && (
                                            <div className="border-t border-gray-800 px-5 py-3">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs font-mono">
                                                        <thead>
                                                            <tr className="text-gray-600 border-b border-gray-800">
                                                                <th className="text-left pb-2 pr-6">#</th>
                                                                <th className="text-left pb-2 pr-6">Column</th>
                                                                <th className="text-left pb-2 pr-6">Type</th>
                                                                <th className="text-left pb-2 pr-6">Nullable</th>
                                                                <th className="text-left pb-2">Default</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.columns.map((col, i) => (
                                                                <tr key={col.column_name} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                                                    <td className="py-1.5 pr-6 text-gray-700">{i + 1}</td>
                                                                    <td className="py-1.5 pr-6 text-white font-semibold">{col.column_name}</td>
                                                                    <td className={`py-1.5 pr-6 ${typeColor(col.data_type)}`}>{col.data_type}</td>
                                                                    <td className="py-1.5 pr-6">
                                                                        <span className={col.is_nullable === 'YES' ? 'text-yellow-500' : 'text-gray-600'}>
                                                                            {col.is_nullable === 'YES' ? 'null' : 'not null'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-1.5 text-gray-600 truncate max-w-xs">{col.column_default || '—'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Data Preview Panel (with per-row delete) ── */}
                                        {previewTable?.name === table.name && (
                                            <div className="border-t border-blue-500/20 bg-gray-950">
                                                <div className="px-5 py-2 flex items-center gap-2 border-b border-gray-800">
                                                    <LayoutGrid size={13} className="text-blue-400" />
                                                    <span className="text-xs font-mono text-blue-400">Data Preview</span>
                                                    <span className="text-xs font-mono text-gray-600 ml-2">
                                                        ({previewTable.rows.length} rows)
                                                    </span>
                                                    {previewTable.pkColumn && (
                                                        <span className="ml-auto text-[10px] font-mono text-gray-600">
                                                            pk: <span className="text-gray-500">{previewTable.pkColumn}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {previewLoading ? (
                                                    <div className="py-8 text-center text-gray-600 font-mono text-xs">Loading…</div>
                                                ) : previewTable.rows.length === 0 ? (
                                                    <div className="py-8 text-center text-gray-600 font-mono text-xs">No rows found</div>
                                                ) : (
                                                    <div className="overflow-x-auto p-4">
                                                        <table className="text-xs font-mono w-max min-w-full">
                                                            <thead>
                                                                <tr className="text-gray-500 border-b border-gray-800">
                                                                    {/* Delete action column header */}
                                                                    <th className="text-left pb-2 pr-4 text-gray-700">Del</th>
                                                                    {previewTable.fields.map(f => (
                                                                        <th key={f} className="text-left pb-2 pr-6 whitespace-nowrap">{f}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {previewTable.rows.map((row, ri) => {
                                                                    const state = rowDeleteState[ri]; // undefined | 'confirming' | 'deleting' | 'error'
                                                                    return (
                                                                        <tr key={ri} className={`border-b border-gray-900 transition-colors
                                                                            ${state === 'confirming' ? 'bg-red-500/5' : ''}
                                                                            ${state === 'deleting' ? 'opacity-40' : ''}
                                                                            ${state === 'error' ? 'bg-red-500/10' : ''}
                                                                            ${!state ? 'hover:bg-gray-800/30' : ''}`}>

                                                                            {/* Delete cell */}
                                                                            <td className="py-1.5 pr-4 whitespace-nowrap">
                                                                                {!state && (
                                                                                    <button
                                                                                        onClick={() => startRowDelete(ri)}
                                                                                        title="Delete this row"
                                                                                        className="text-red-500/50 hover:text-red-400 transition-colors p-0.5 rounded">
                                                                                        <Trash2 size={12} />
                                                                                    </button>
                                                                                )}
                                                                                {state === 'confirming' && (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <button
                                                                                            onClick={() => confirmRowDelete(ri)}
                                                                                            title="Confirm delete"
                                                                                            className="text-red-400 hover:text-red-300 transition-colors p-0.5 rounded">
                                                                                            <CheckCircle size={13} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => cancelRowDelete(ri)}
                                                                                            title="Cancel"
                                                                                            className="text-gray-600 hover:text-gray-400 transition-colors p-0.5 rounded">
                                                                                            <X size={13} />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                                {state === 'deleting' && (
                                                                                    <RefreshCw size={12} className="text-gray-600 animate-spin" />
                                                                                )}
                                                                                {state === 'error' && (
                                                                                    <AlertCircle size={12} className="text-red-400" />
                                                                                )}
                                                                            </td>

                                                                            {/* Data cells */}
                                                                            {previewTable.fields.map(f => (
                                                                                <td key={f} className="py-1.5 pr-6 text-gray-300 whitespace-nowrap max-w-xs truncate">
                                                                                    {row[f] === null
                                                                                        ? <span className="text-gray-700">NULL</span>
                                                                                        : String(row[f]).length > 60
                                                                                            ? String(row[f]).slice(0, 60) + '…'
                                                                                            : String(row[f])
                                                                                    }
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {filtered.length === 0 && (
                                    <div className="text-center py-12 text-gray-600 font-mono text-sm">No tables match "{search}"</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControllerDashboard;
