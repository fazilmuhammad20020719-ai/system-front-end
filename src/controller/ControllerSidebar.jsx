import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Database, AlertTriangle, LogOut, Power, PowerOff } from 'lucide-react';
import { API_URL } from '../config';

const ControllerSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('dev_token');

    const [paused, setPaused] = useState(false);
    const [toggling, setToggling] = useState(false);

    const isActive = (path) => location.pathname === path;

    // Sync pause state on mount
    useEffect(() => {
        if (!token) return;
        fetch(`${API_URL}/api/controller/system/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { if (typeof d.paused === 'boolean') setPaused(d.paused); })
            .catch(() => { });
    }, []);

    const togglePause = async () => {
        if (toggling) return;
        const action = paused ? 'unpause' : 'pause';
        if (!paused && !window.confirm(
            '⚠️  Pause the system?\n\nAll users will receive a "System paused" error until you resume. Continue?'
        )) return;
        setToggling(true);
        try {
            const res = await fetch(`${API_URL}/api/controller/system/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (typeof data.paused === 'boolean') setPaused(data.paused);
        } catch { }
        finally { setToggling(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('dev_token');
        navigate('/controller');
    };

    const navItems = [
        {
            icon: Database,
            label: 'Database',
            to: '/controller/dashboard',
            color: 'text-green-400',
            activeBg: 'bg-green-500/15 border-l-2 border-green-400',
        },
        {
            icon: AlertTriangle,
            label: 'Error Logs',
            to: '/controller/logs',
            color: 'text-orange-400',
            activeBg: 'bg-orange-500/15 border-l-2 border-orange-400',
        },
    ];

    return (
        <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 h-screen z-30">
            {/* Brand */}
            <div className="px-5 py-5 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Terminal size={15} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white leading-tight">FMAC</p>
                        <p className="text-[10px] font-mono text-gray-500 leading-tight">Dev Console</p>
                    </div>
                </div>
            </div>

            {/* System Status Banner */}
            <div className={`mx-3 mt-3 rounded-lg px-3 py-2 flex items-center gap-2 border transition-all ${paused
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-green-500/10 border-green-500/20'
                }`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${paused ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-mono font-semibold ${paused ? 'text-red-400' : 'text-green-400'}`}>
                        {paused ? 'PAUSED' : 'ONLINE'}
                    </p>
                    <p className="text-[10px] font-mono text-gray-500 truncate">
                        {paused ? 'APIs blocked' : 'All routes active'}
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
                {navItems.map(({ icon: Icon, label, to, color, activeBg }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all
                            ${isActive(to)
                                ? `${activeBg} text-white`
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            }`}
                    >
                        <Icon size={16} className={isActive(to) ? color : ''} />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Footer — Pause + Logout */}
            <div className="px-3 py-4 border-t border-gray-800 space-y-2">
                {/* Pause / Unpause button */}
                <button
                    onClick={togglePause}
                    disabled={toggling}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all disabled:opacity-50
                        ${paused
                            ? 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                        }`}
                >
                    {paused
                        ? <><Power size={15} className="flex-shrink-0" /> <span>{toggling ? 'Starting…' : 'Start System'}</span></>
                        : <><PowerOff size={15} className="flex-shrink-0" /> <span>{toggling ? 'Pausing…' : 'Pause System'}</span></>
                    }
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-all"
                >
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default ControllerSidebar;
