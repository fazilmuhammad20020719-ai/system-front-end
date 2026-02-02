import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = ({ activeTab }) => {
    return (
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-white">{activeTab}</h1>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search client data..."
                        className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 placeholder:text-slate-600"
                    />
                </div>
                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-800"></span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
