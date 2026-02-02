import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Database, UploadCloud, Calendar, Server, Eye, X, Table as TableIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DatabaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Database');
    const [selectedTable, setSelectedTable] = useState(null);

    const handleTabChange = (tab) => {
        if (!id) return;
        if (tab === 'Database') {
            setActiveTab('Database');
        } else {
            // Navigate back to the main client details page for other tabs
            // Pass the selected tab as state or query param if we wanted to open that specific tab, 
            // but for now just going back to Overview is consistent with default behavior.
            navigate(`/client/${id}`);
        }
    };

    // MOCK DATA - reuse logical or import if possible, but duplicating for safety as requested
    const client = {
        id: id,
        name: id === '1' ? "Faizanul Madeeba Arabic College" : "Oxford International School",
        domain: id === '1' ? "fmac.mathersa.com" : "oxford.mathersa.com",
        status: id === '1' ? "Active" : "Overdue"
    };

    // Real tables from user input
    const tables = [
        "activities", "alerts", "attendance", "calendar_events", "class_sessions",
        "documents", "exam_parts", "exam_results", "examination_slots", "exams",
        "programs", "schedule_attendance", "schedules", "student_attendance",
        "student_enrollments", "students", "subjects", "teacher_attendance", "teacher_documents"
    ];

    // Mock data generator for the modal
    const getMockTableData = (tableName) => {
        const rows = [1, 2, 3, 4, 5];
        return rows.map(i => ({
            id: i,
            col1: `${tableName.slice(0, 4)}_${i}_data`,
            col2: i % 2 === 0 ? 'Active' : 'Pending',
            created_at: `2024-03-${10 + i} 10:00:00`,
            updated_by: 'admin_user'
        }));
    };

    return (
        <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">

            {/* Sidebar with activeTab='Database' */}
            <Sidebar client={client} activeTab={activeTab} setActiveTab={handleTabChange} />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Topbar activeTab={activeTab} />

                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="space-y-6">
                        {/* VPS / SERVER CARD */}
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Server className="text-emerald-400" size={20} /> VPS Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">IP Address (IPv4)</p>
                                    <div className="flex justify-between items-center">
                                        <code className="text-emerald-300 font-mono text-sm">192.168.1.{100 + parseInt(client.id)}</code>
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition-colors">Copy</button>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Root Password</p>
                                    <div className="flex justify-between items-center">
                                        <code className="text-red-300 font-mono text-sm">•••••••••••••</code>
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition-colors">Reveal</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DATABASE CREDENTIALS CARD */}
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Database className="text-indigo-400" size={20} /> Connection Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Database Name</p>
                                    <div className="flex justify-between items-center">
                                        <code className="text-indigo-300 font-mono text-sm">{client.name.split(' ')[0].toLowerCase()}_db_v1</code>
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition-colors">Copy</button>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Master Password</p>
                                    <div className="flex justify-between items-center">
                                        <code className="text-red-300 font-mono text-sm">•••••••••••••</code>
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition-colors">Reveal</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: PUBLIC TABLES LIST */}
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <TableIcon size={20} className="text-blue-400" /> Database Relations (Public Schema)
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Listing all tables in `college_office_db`</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Schema</th>
                                            <th className="px-6 py-4">Table Name</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Owner</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {tables.map((table, index) => (
                                            <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-3 font-mono text-slate-500">public</td>
                                                <td className="px-6 py-3 font-bold text-white">{table}</td>
                                                <td className="px-6 py-3">table</td>
                                                <td className="px-6 py-3 text-slate-400">app_user</td>
                                                <td className="px-6 py-3 text-right">
                                                    <button
                                                        onClick={() => setSelectedTable(table)}
                                                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                                                    >
                                                        <Eye size={12} /> View Data
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* MODAL IN FRONT OF BOX */}
                    {selectedTable && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                            <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <TableIcon size={20} className="text-indigo-400" />
                                            Table: <span className="text-indigo-300 font-mono">{selectedTable}</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">Showing first 5 rows</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTable(null)}
                                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="overflow-auto p-6">
                                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm text-slate-300">
                                            <thead className="bg-slate-900 text-slate-400 font-bold text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Data Field 1</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Created At</th>
                                                    <th className="px-4 py-3">Updated By</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                                                {getMockTableData(selectedTable).map((row) => (
                                                    <tr key={row.id} className="hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                                                        <td className="px-4 py-3">{row.col1}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] border border-green-500/20">
                                                                {row.col2}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.created_at}</td>
                                                        <td className="px-4 py-3 text-xs">{row.updated_by}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-700 bg-slate-900/30 flex justify-end">
                                    <button
                                        onClick={() => setSelectedTable(null)}
                                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default DatabaseDetails;
