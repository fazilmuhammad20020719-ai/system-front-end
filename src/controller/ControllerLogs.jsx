import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Terminal, LogOut, RefreshCw, Search, AlertTriangle,
    Database, Server, Cpu, ChevronDown, ChevronRight,
    Trash2, Copy, CheckCheck, Clock, Filter, ZapOff, Database as DbIcon
} from 'lucide-react';
import { API_URL } from '../config';
import ControllerSidebar from './ControllerSidebar';

const TYPE_CONFIG = {
    server: { label: 'Server', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25', dot: 'bg-orange-400', Icon: Server },
    database: { label: 'Database', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25', dot: 'bg-blue-400', Icon: Database },
    system: { label: 'System', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/25', dot: 'bg-red-400', Icon: Cpu },
};

function LogEntry({ log }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.server;

    const copy = () => {
        const text = [
            `[${log.type.toUpperCase()}] ${log.timestamp}`,
            log.route ? `Route: ${log.route}` : null,
            `Message: ${log.message}`,
            log.stack ? `Stack:\n${log.stack}` : null,
        ].filter(Boolean).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const ts = new Date(log.timestamp);
    const timeStr = ts.toLocaleTimeString('en-GB', { hour12: false });
    const dateStr = ts.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    return (
        <div className={`border rounded-xl overflow-hidden transition-all ${cfg.bg} hover:border-opacity-50`}>
            {/* Main row */}
            <div className="flex items-start gap-3 px-4 py-3">
                {/* Expand toggle */}
                {log.stack ? (
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="mt-0.5 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                    >
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                ) : (
                    <div className="w-3.5 flex-shrink-0" />
                )}

                {/* Type dot */}
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                        </span>
                        {log.route && (
                            <span className="text-xs font-mono text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-700/50">
                                {log.route}
                            </span>
                        )}
                        <span className="text-xs font-mono text-gray-600 flex items-center gap-1">
                            <Clock size={10} /> {dateStr} {timeStr}
                        </span>
                    </div>
                    <p className="text-sm text-gray-200 font-mono leading-relaxed break-words">
                        {log.message || <span className="text-gray-600 italic">No message</span>}
                    </p>
                </div>

                {/* Copy */}
                <button
                    onClick={copy}
                    className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors mt-0.5"
                    title="Copy log"
                >
                    {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
                </button>
            </div>

            {/* Stack trace */}
            {expanded && log.stack && (
                <div className="border-t border-gray-800/60 px-5 py-3 bg-gray-950/60">
                    <p className="text-xs font-mono text-gray-500 mb-1.5">Stack Trace</p>
                    <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap break-all leading-5 max-h-48 overflow-y-auto">
                        {log.stack}
                    </pre>
                </div>
            )}
        </div>
    );
}

const ControllerLogs = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('dev_token');

    const [logs, setLogs] = useState([]);
    const [counts, setCounts] = useState({ all: 0, server: 0, database: 0, system: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [clearing, setClearing] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!token) { navigate('/controller'); return; }
        fetchLogs();
    }, []);

    // Re-fetch when filters change
    useEffect(() => { fetchLogs(); }, [typeFilter, search]);

    // Auto-refresh
    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(fetchLogs, 10000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [autoRefresh, typeFilter, search]);

    const fetchLogs = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: 100 });
            if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
            if (search) params.set('search', search);

            const res = await fetch(`${API_URL}/api/controller/logs?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { localStorage.removeItem('dev_token'); navigate('/controller'); return; }
            const data = await res.json();
            setLogs(data.logs || []);
            setCounts(data.counts || { all: 0, server: 0, database: 0, system: 0 });
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Logs fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, typeFilter, search]);

    const clearLogs = async () => {
        if (!window.confirm('Clear all logs? This cannot be undone.')) return;
        setClearing(true);
        try {
            await fetch(`${API_URL}/api/controller/logs`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLogs([]);
            setCounts({ all: 0, server: 0, database: 0, system: 0 });
        } catch (err) {
            console.error('Clear logs error:', err);
        } finally {
            setClearing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('dev_token');
        navigate('/controller');
    };

    const statCards = [
        { key: 'all', label: 'Total Errors', Icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        { key: 'server', label: 'Server', Icon: Server, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
        { key: 'database', label: 'Database', Icon: DbIcon, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { key: 'system', label: 'System', Icon: Cpu, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    ];

    return (
        <div className="h-screen bg-gray-950 text-white flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
            <ControllerSidebar />

            <div className="flex-1 flex flex-col min-w-0 ml-56">
                {/* Top Bar */}
                <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-sm font-bold text-white">Error Logs</span>
                            <span className="ml-3 text-xs text-gray-500 font-mono">server · database · system</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {lastUpdated && (
                            <span className="text-xs font-mono text-gray-600 hidden sm:block">
                                Updated {lastUpdated.toLocaleTimeString('en-GB', { hour12: false })}
                            </span>
                        )}
                        <button
                            onClick={() => setAutoRefresh(a => !a)}
                            className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${autoRefresh ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Auto-refresh every 10s"
                        >
                            <RefreshCw size={13} className={autoRefresh ? 'animate-spin' : ''} />
                            {autoRefresh ? 'Live' : 'Auto'}
                        </button>
                        <button onClick={fetchLogs}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors font-mono">
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-5">

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {statCards.map(({ key, label, Icon, color, bg }) => (
                                <button
                                    key={key}
                                    onClick={() => setTypeFilter(key)}
                                    className={`rounded-xl border p-4 flex items-center gap-3 transition-all text-left ${bg} ${typeFilter === key ? 'ring-1 ring-white/20' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    <div className={`p-2 rounded-lg ${bg}`}>
                                        <Icon size={18} className={color} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{loading ? '—' : counts[key]}</p>
                                        <p className={`text-xs font-mono ${color}`}>{label}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Filter bar */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative flex-1 min-w-48">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search messages, routes, stack traces…"
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
                                <Filter size={13} className="text-gray-500" />
                                <select
                                    value={typeFilter}
                                    onChange={e => setTypeFilter(e.target.value)}
                                    className="bg-transparent text-sm font-mono text-gray-300 focus:outline-none cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="server">Server</option>
                                    <option value="database">Database</option>
                                    <option value="system">System</option>
                                </select>
                            </div>

                            <button
                                onClick={clearLogs}
                                disabled={clearing || counts.all === 0}
                                className="flex items-center gap-1.5 text-xs font-mono text-red-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-red-500/20 hover:border-red-400/30 px-3 py-2 rounded-xl"
                            >
                                <Trash2 size={13} /> Clear All
                            </button>
                        </div>

                        {/* Log list */}
                        {loading ? (
                            <div className="text-center py-16 text-gray-600 font-mono text-sm">Loading logs…</div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ZapOff size={28} className="text-green-400" />
                                </div>
                                <p className="text-gray-400 font-semibold text-lg">No errors found</p>
                                <p className="text-gray-600 font-mono text-sm mt-1">
                                    {search || typeFilter !== 'all' ? 'Try a different filter or search' : 'System is running clean ✓'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-mono text-gray-500">
                                        Showing <span className="text-gray-300">{logs.length}</span> of <span className="text-gray-300">{counts.all}</span> errors
                                    </p>
                                </div>
                                {logs.map(log => (
                                    <LogEntry key={log.id} log={log} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControllerLogs;
