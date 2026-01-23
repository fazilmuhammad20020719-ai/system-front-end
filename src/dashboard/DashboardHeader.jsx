import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Calendar, Bell } from 'lucide-react';
import { API_URL } from '../config';




const DashboardHeader = ({ toggleSidebar, onAlertClick, alertCount = 0 }) => {
    const navigate = useNavigate();

    return (
        <header className="px-6 py-4 md:px-8 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all relative">

            {/* LEFT: Title & Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">Dashboard Overview</h2>
            </div>

            {/* CENTER: Spacer */}
            <div className="flex-1"></div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3 self-end md:self-auto">
                {/* DATE DISPLAY (Hidden on mobile) */}
                <div className="hidden lg:flex bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 shadow-sm whitespace-nowrap">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* ALERT BELL ICON BUTTON */}
                <button
                    onClick={onAlertClick}
                    className="relative p-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg shadow-sm transition-colors group"
                >
                    <Bell size={20} className="group-hover:text-indigo-600 transition-colors" />
                    {/* Notification Badge - Dynamic */}
                    {alertCount > 0 && (
                        <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border border-white flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">{alertCount}</span>
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;