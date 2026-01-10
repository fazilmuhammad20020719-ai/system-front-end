import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    GraduationCap,
    Users,
    Layers,
    CalendarCheck,
    FolderOpen,
    LogOut,
    Briefcase,
    X,
    ClipboardList
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    // Get current location to automatically set the "active" state
    const location = useLocation();

    // Helper to determine if a path is active
    const isActive = (path) => location.pathname === path;

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
        bg-[#F57D1F] h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out flex flex-col text-white
        ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20"}
      `}
            >
                {/* LOGO SECTION */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-orange-400/30">
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
                        {isOpen && <p className="text-xs font-semibold text-orange-100/70 mb-3 px-2 uppercase tracking-wider">Main</p>}
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
                        </div>
                    </div>

                    {/* Section: DIRECTORY */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-orange-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Directory</p>}
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
                        {isOpen && <p className="text-xs font-semibold text-orange-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Academic</p>}
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
                                to="/examinations"
                                active={isActive('/examinations')}
                                isOpen={isOpen}
                            />
                        </div>
                    </div>

                    {/* Section: OFFICE */}
                    <div>
                        {isOpen && <p className="text-xs font-semibold text-orange-100/70 mb-3 px-2 uppercase tracking-wider mt-2">Office</p>}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={FolderOpen}
                                text="Documents"
                                to="/documents"
                                active={isActive('/documents')}
                                isOpen={isOpen}
                            />
                        </div>
                    </div>
                </nav>

                {/* FOOTER USER PROFILE */}
                <div className="p-4 border-t border-orange-400/30 bg-[#E0690C]">
                    <div className={`flex items-center gap-3 ${!isOpen && "justify-center"}`}>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#F57D1F] font-bold shadow-sm">
                            A
                        </div>

                        {isOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Administrator</p>
                                <p className="text-xs text-orange-200 truncate">Super Admin</p>
                            </div>
                        )}

                        {isOpen && (
                            <Link to="/" className="text-orange-200 hover:text-white transition-colors">
                                <LogOut size={20} />
                            </Link>
                        )}
                    </div>
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
                ? "bg-white text-[#F57D1F] shadow-sm"
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