import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, Search, Filter, Download, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const SystemLogs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Logs');
    const [filterType, setFilterType] = useState('all');

    const handleTabChange = (tab) => {
        if (!id) return;
        if (tab === 'Logs') {
            setActiveTab('Logs');
        } else {
            navigate(`/client/${id}`, { state: { activeTab: tab } });
        }
    };

    const client = {
        id: id,
        name: id === '1' ? "Faizanul Madeeba Arabic College" : "Oxford International School",
        domain: id === '1' ? "fmac.mathersa.com" : "oxford.mathersa.com",
        status: id === '1' ? "Active" : "Overdue"
    };

    const logs = [
        { id: 1, type: 'info', message: 'System backup completed successfully', user: 'System', time: '10:00 AM', date: '2024-03-15' },
        { id: 2, type: 'warning', message: 'High memory usage detected (85%)', user: 'System Monitor', time: '09:45 AM', date: '2024-03-15' },
        { id: 3, type: 'success', message: 'User "admin" logged in', user: 'Admin', time: '09:30 AM', date: '2024-03-15' },
        { id: 4, type: 'error', message: 'Failed to sync payment gateway', user: 'System', time: '08:15 AM', date: '2024-03-15' },
        { id: 5, type: 'info', message: 'New student registration: #1055', user: 'Staff_01', time: '04:20 PM', date: '2024-03-14' },
        { id: 6, type: 'success', message: 'Database optimization routine finished', user: 'System', time: '02:00 AM', date: '2024-03-14' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'error': return <AlertCircle className="text-red-500" size={18} />;
            case 'warning': return <AlertCircle className="text-orange-500" size={18} />;
            case 'success': return <CheckCircle className="text-green-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
            <Sidebar client={client} activeTab={activeTab} setActiveTab={handleTabChange} />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Topbar activeTab={activeTab} />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-6">

                        {/* HEADER & FILTERS */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Activity className="text-indigo-400" /> System Logs
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">Audit trail and system events for {client.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 w-64"
                                    />
                                </div>
                                <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                                    <Filter size={16} /> Filter
                                </button>
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </div>

                        {/* LOGS TABLE */}
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase font-bold border-b border-slate-700/50">
                                        <tr>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Event Description</th>
                                            <th className="px-6 py-4">User / Source</th>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getIcon(log.type)}
                                                        <span className={`capitalize font-medium ${log.type === 'error' ? 'text-red-400' :
                                                            log.type === 'warning' ? 'text-orange-400' :
                                                                log.type === 'success' ? 'text-green-400' : 'text-blue-400'
                                                            }`}>{log.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-200">
                                                    {log.message}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-700/50 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-600/30">
                                                        {log.user}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-300">{log.time}</span>
                                                        <span>{log.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold hover:underline">
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-slate-700 bg-slate-900/30 text-center">
                                <button className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors">
                                    Load More Logs
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default SystemLogs;
