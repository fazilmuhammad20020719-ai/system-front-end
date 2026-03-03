import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Database, AlertTriangle, LogOut } from 'lucide-react';

const ControllerSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

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

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default ControllerSidebar;
