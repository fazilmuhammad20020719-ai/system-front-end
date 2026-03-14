import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    GraduationCap,
    Users,
    Layers,
    CalendarCheck,
    FolderOpen,
    LogOut,
    Briefcase,
    X,
    ClipboardList,
    Crown,
    Activity,
    UserCog,
    Wifi
} from 'lucide-react';

// ── Network speed hook ──────────────────────────────────────────
// Runs a timed fetch of a small cachebust URL every 10 s to estimate Mbps.
const useNetworkSpeed = () => {
    const [mbps, setMbps] = useState(null);   // null = measuring
    const [status, setStatus] = useState('measuring'); // 'good' | 'medium' | 'low' | 'offline' | 'measuring'

    const measure = async () => {
        // Use Navigator connection API as a quick hint first
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn?.downlink !== undefined && conn.downlink > 0) {
            const speed = conn.downlink; // Mbps
            setMbps(speed);
            setStatus(speed >= 20 ? 'good' : speed >= 5 ? 'medium' : 'low');
        }

        // Also do a real timing test for accuracy
        try {
            const FILE_SIZE_KB = 8; // tiny payload ~8KB = 8192 bytes
            const url = `https://httpbin.org/bytes/${FILE_SIZE_KB * 1024}?t=${Date.now()}`;
            const start = performance.now();
            const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
            await res.arrayBuffer();
            const duration = (performance.now() - start) / 1000; // seconds
            const bits = FILE_SIZE_KB * 1024 * 8;
            const speed = parseFloat(((bits / duration) / 1_000_000).toFixed(1)); // Mbps
            setMbps(speed);
            setStatus(speed >= 20 ? 'good' : speed >= 5 ? 'medium' : 'low');
        } catch {
            // If fetch fails entirely, mark offline
            if (!navigator.onLine) {
                setMbps(0);
                setStatus('offline');
            }
        }
    };

    useEffect(() => {
        measure();
        const id = setInterval(measure, 10_000);
        const onOnline = () => measure();
        const onOffline = () => { setMbps(0); setStatus('offline'); };
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            clearInterval(id);
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    return { mbps, status };
};

// ── Colour map ──────────────────────────────────────────────────
const SIGNAL_STYLES = {
    good: { color: '#4ade80', label: 'Good', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)' },
    medium: { color: '#facc15', label: 'Medium', bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)' },
    low: { color: '#f87171', label: 'Low', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
    offline: { color: '#f87171', label: 'Offline', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
    measuring: { color: '#94a3b8', label: '…', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { mbps, status } = useNetworkSpeed();
    const sig = SIGNAL_STYLES[status] ?? SIGNAL_STYLES.measuring;
    // Get current location to automatically set the "active" state
    const location = useLocation();

    // Helper to determine if a path is active
    const isActive = (path) => location.pathname === path;

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`
        bg-green-600 h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out flex flex-col text-white
        ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20"}
      `}
            >
                {/* LOGO SECTION */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-green-400/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-1">
                            {/* Ensure you have a logo.png in your public folder or change this source */}
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                            />
                        </div>
                        {isOpen && (
                            <div>
                                <h1 className="text-xl font-bold leading-tight">FMAC <span className="font-medium opacity-90">Central</span></h1>
                            </div>
                        )}
                    </div>

                    {/* Mobile Close Button */}
                    <button onClick={toggleSidebar} className="md:hidden text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* NAVIGATION ITEMS */}
                <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Section: MAIN */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-green-100/70 mb-3 px-2 uppercase tracking-wider">Main</p>}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={LayoutDashboard}
                                text="Dashboard"
                                to="/dashboard"
                                active={isActive('/dashboard')}
                                isOpen={isOpen}
                            />
                            <SidebarItem
                                icon={Calendar}
                                text="Calendar"
                                to="/calendar"
                                active={isActive('/calendar')}
                                isOpen={isOpen}
                            />
                            <SidebarItem
                                icon={Clock}
                                text="Schedule"
                                to="/schedule"
                                active={isActive('/schedule')}
                                isOpen={isOpen}
                            />
                        </div>
                    </div>

                    {/* Section: DIRECTORY */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-green-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Directory</p>}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={GraduationCap}
                                text="Students"
                                to="/students"
                                active={isActive('/students') || isActive('/add-student')}
                                isOpen={isOpen}
                            />
                            <SidebarItem
                                icon={Users}
                                text="Teachers"
                                to="/teachers"
                                active={isActive('/teachers')}
                                isOpen={isOpen}
                            />
                            <SidebarItem
                                icon={Briefcase}
                                text="Management Team"
                                to="/management-team"
                                active={isActive('/management-team')}
                                isOpen={isOpen}
                            />
                        </div>
                    </div>

                    {/* Section: ACADEMIC */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-green-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Academic</p>}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={Layers}
                                text="Programs"
                                to="/programs"
                                active={isActive('/programs')}
                                isOpen={isOpen}
                            />
                            <SidebarItem
                                icon={CalendarCheck}
                                text="Attendance"
                                to="/attendance"
                                active={isActive('/attendance')}
                                isOpen={isOpen}
                            />

                            <SidebarItem
                                icon={ClipboardList}
                                text="Exams & Results"
                                to="/exams"
                                active={isActive('/exams')}
                                isOpen={isOpen}
                            />
                        </div>
                    </div>

                    {/* Section: OFFICE */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-green-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Office</p>}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={FolderOpen}
                                text="Documents"
                                to="/documents"
                                active={isActive('/documents')}
                                isOpen={isOpen}
                            />

                            <SidebarItem
                                icon={Activity}
                                text="Activity Log"
                                to="/activity"
                                active={isActive('/activity')}
                                isOpen={isOpen}
                            />

                        </div>
                    </div>
                </nav>

                {/* FOOTER USER PROFILE */}
                <div className="border-t border-green-400/30 bg-green-700">
                    {/* Admin box */}
                    <div className="p-4">
                        <div className={`flex items-center gap-3 ${!isOpen && "justify-center"}`}>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 font-bold shadow-sm uppercase">
                                {user?.username?.charAt(0) || 'A'}
                            </div>

                            {isOpen && (
                                <Link
                                    to="/admin-profile"
                                    className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
                                >
                                    <p className="text-sm font-bold truncate capitalize">{user?.username || 'Administrator'}</p>
                                    <p className="text-xs text-green-200 truncate capitalize">{user?.role || 'Super Admin'}</p>
                                </Link>
                            )}

                            {isOpen && (
                                <Link to="/" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); }} className="text-green-200 hover:text-white transition-colors">
                                    <LogOut size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* ── Network / WiFi Coverage Widget ── */}
                    <div
                        className="mx-3 mb-3 rounded-xl px-3 py-2 flex items-center gap-2.5"
                        style={{
                            background: sig.bg,
                            border: `1px solid ${sig.border}`,
                            transition: 'background 0.5s, border 0.5s',
                        }}
                        title={`Network: ${sig.label}${mbps !== null ? ` — ${mbps} Mbps` : ''}`}
                    >
                        {/* Wifi icon — pulses while measuring */}
                        <Wifi
                            size={18}
                            style={{
                                color: sig.color,
                                flexShrink: 0,
                                animation: status === 'measuring' ? 'wifi-pulse 1.4s ease-in-out infinite' : 'none',
                                transition: 'color 0.5s',
                            }}
                        />

                        {isOpen && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                    color: sig.color,
                                    lineHeight: 1.2,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    transition: 'color 0.5s',
                                }}>
                                    {sig.label} Signal
                                </p>
                                <p style={{
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.3,
                                    marginTop: '1px',
                                }}>
                                    {status === 'measuring'
                                        ? 'Measuring…'
                                        : status === 'offline'
                                            ? 'No connection'
                                            : `${mbps} Mbps`
                                    }
                                </p>
                            </div>
                        )}

                        {/* Small signal-strength bars (always visible) */}
                        {isOpen && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                                {[0.4, 0.65, 1].map((h, i) => {
                                    const filled = (
                                        (status === 'good' && i <= 2) ||
                                        (status === 'medium' && i <= 1) ||
                                        (status === 'low' && i === 0)
                                    );
                                    return (
                                        <div key={i} style={{
                                            width: '4px',
                                            height: `${12 * h}px`,
                                            borderRadius: '2px',
                                            background: filled ? sig.color : 'rgba(255,255,255,0.18)',
                                            transition: 'background 0.5s',
                                        }} />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Keyframe for measuring pulse */}
                    <style>{`
                        @keyframes wifi-pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.35; }
                        }
                    `}</style>
                </div>
            </aside>
        </>
    );
};

// Sub-component: Sidebar Item with Link
const SidebarItem = ({ icon: Icon, text, active, isOpen, to }) => (
    <Link
        to={to || '#'}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium block
            ${active
                ? "bg-white text-green-600 shadow-sm"
                : "text-white hover:bg-white/10"
            }
            ${!isOpen && "justify-center px-2"}
        `}
    >
        <Icon size={20} strokeWidth={2.5} />
        {isOpen && <span className="whitespace-nowrap">{text}</span>}
    </Link>
);


export default Sidebar;