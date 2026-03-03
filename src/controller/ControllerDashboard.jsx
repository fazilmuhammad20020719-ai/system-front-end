import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Terminal, Database, Table2, ChevronDown, ChevronRight,
    LogOut, RefreshCw, Search, Eye, Hash, Columns, LayoutGrid
} from 'lucide-react';
import { API_URL } from '../config';

const ControllerDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('dev_token');

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);        // table name with columns open
    const [previewTable, setPreviewTable] = useState(null); // { name, rows, fields }
    const [previewLoading, setPreviewLoading] = useState(false);

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

    const fetchPreview = async (tableName) => {
        if (previewTable?.name === tableName) { setPreviewTable(null); return; }
        setPreviewLoading(true);
        setPreviewTable(null);
        try {
            const res = await fetch(`${API_URL}/api/controller/table/${tableName}/data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPreviewTable({ name: tableName, rows: data.rows, fields: data.fields });
        } catch (err) {
            console.error(err);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('dev_token');
        navigate('/controller');
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
        <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

            {/* Top Bar */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center">
                        <Terminal size={16} className="text-green-400" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-white">FMAC Developer Console</span>
                        <span className="ml-3 text-xs text-gray-500 font-mono">Database Inspector</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchTables}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors font-mono">
                        <RefreshCw size={13} /> Refresh
                    </button>
                    <button onClick={handleLogout}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-mono">
                        <LogOut size={13} /> Logout
                    </button>
                </div>
            </header>

            <div className="p-6 max-w-7xl mx-auto space-y-6">

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
                                            {expanded === table.name
                                                ? <ChevronDown size={16} />
                                                : <ChevronRight size={16} />}
                                        </button>
                                        <Table2 size={16} className="text-green-500 flex-shrink-0" />
                                        <span className="font-mono text-sm font-semibold text-white">{table.name}</span>
                                        <span className="text-xs font-mono text-gray-600">
                                            {table.columns.length} col{table.columns.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Row count badge */}
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold
                                            ${table.rowCount > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-600 border border-gray-700'}`}>
                                            {table.rowCount.toLocaleString()} rows
                                        </span>

                                        {/* Preview button */}
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
                                                            <td className="py-1.5 text-gray-600 truncate max-w-xs">
                                                                {col.column_default || '—'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Data Preview Panel */}
                                {previewTable?.name === table.name && (
                                    <div className="border-t border-blue-500/20 bg-gray-950">
                                        <div className="px-5 py-2 flex items-center gap-2 border-b border-gray-800">
                                            <LayoutGrid size={13} className="text-blue-400" />
                                            <span className="text-xs font-mono text-blue-400">Data Preview</span>
                                            <span className="text-xs font-mono text-gray-600 ml-2">
                                                (first {previewTable.rows.length} rows)
                                            </span>
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
                                                            {previewTable.fields.map(f => (
                                                                <th key={f} className="text-left pb-2 pr-6 whitespace-nowrap">{f}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {previewTable.rows.map((row, ri) => (
                                                            <tr key={ri} className="border-b border-gray-900 hover:bg-gray-800/30">
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
                                                        ))}
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
    );
};

export default ControllerDashboard;
