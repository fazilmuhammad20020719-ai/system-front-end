import React from 'react';
import {
    LayoutDashboard, Users, CreditCard, Settings, Database, Server,
    ArrowLeft, Activity, BookOpen, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
            ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium">{label}</span>
    </div>
);

const Sidebar = ({ client, activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full hidden md:flex">
            <div className="p-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Admin
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm tracking-wide leading-tight">{client.name}</h2>
                        <p className="text-xs text-slate-500 truncate w-32">{client.domain}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 space-y-2 mt-2">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Management</p>
                <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
                <SidebarItem
                    icon={<Server />}
                    label="VPS & Database"
                    active={activeTab === 'Database' || window.location.pathname.includes('/database')}
                    onClick={() => navigate(`/client/${client.id}/database`)}
                />
                <SidebarItem icon={<BookOpen />} label="Academics" active={activeTab === 'Academics'} onClick={() => setActiveTab('Academics')} />
                {/* RENAMED MENU ITEM */}
                <SidebarItem
                    icon={<CreditCard />}
                    label="Subs & Actions"
                    active={activeTab === 'Subscription' || window.location.pathname.includes('/subscription')}
                    onClick={() => navigate(`/client/${client.id}/subscription`)}
                />
                <SidebarItem
                    icon={<Activity />}
                    label="System Logs"
                    active={activeTab === 'Logs' || window.location.pathname.includes('/logs')}
                    onClick={() => navigate(`/client/${client.id}/logs`)}
                />
                <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
            </div>

            <div className="p-4 border-t border-slate-700">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${client.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className={`text-sm font-bold ${client.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{client.status}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
