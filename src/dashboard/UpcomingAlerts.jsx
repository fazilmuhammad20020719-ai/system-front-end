import { AlertTriangle, Calendar, CreditCard, Bell, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const UpcomingAlerts = ({ alerts = [] }) => {


    // OPACITY CALCULATION LOGIC
    const getOpacityClass = (days) => {
        switch (days) {
            case 0: return "opacity-100 scale-100 shadow-md"; // Today: Full visible, Highlighted
            case 1: return "opacity-80";  // Tomorrow
            case 2: return "opacity-60";  // 2 Days left
            case 3: return "opacity-40 grayscale-[50%]";  // 3 Days left (Faded)
            default: return "hidden";     // Hide others
        }
    };

    // Helper for icons
    const getIcon = (type) => {
        switch (type) {
            case 'CreditCard': return CreditCard;
            case 'AlertTriangle': return AlertTriangle;
            case 'Bell': return Bell;
            default: return Calendar;
        }
    };

    // Helper for colors
    const getColors = (theme) => {
        switch (theme) {
            case 'red': return { text: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' };
            case 'orange': return { text: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50' };
            case 'blue': return { text: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' };
            default: return { text: 'text-gray-600', border: 'border-gray-200', bg: 'bg-gray-50' };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="text-indigo-600" size={20} strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-800">Upcoming Alerts & Reminders</h3>
            </div>

            <div className="space-y-4">
                {alerts.length > 0 ? (
                    alerts.map((alert) => {
                        const Icon = getIcon(alert.icon_type);
                        const colors = getColors(alert.color_theme);

                        return (
                            <div
                                key={alert.id}
                                className={`
                                    ${getOpacityClass(alert.daysFromNow)} 
                                    ${colors.bg} ${colors.border}
                                    border rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:opacity-100 hover:scale-[1.01] hover:shadow-sm cursor-default
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-full bg-white ${colors.text} shadow-sm shrink-0`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${alert.daysFromNow === 0 ? 'text-gray-900 text-base' : 'text-gray-700'}`}>
                                            {alert.title}
                                            {alert.daysFromNow === 0 && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white bg-red-500 rounded-full">Today</span>
                                            )}
                                        </h4>
                                        <p className="text-xs text-gray-600 font-medium mt-0.5">{alert.message}</p>
                                    </div>
                                </div>

                                {/* DATE DISPLAY */}
                                <div className="text-right shrink-0 ml-4">
                                    <div className="flex items-center gap-1 justify-end text-gray-500">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                                            {alert.daysFromNow === 0 ? 'Due Today' : `${alert.daysFromNow} Days Left`}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 mt-0.5">{alert.date}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400 text-center">No upcoming alerts</p>
                )}
            </div>
        </div>
    );
};

export default UpcomingAlerts;