import { Clock, UserPlus, FileText, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

// Component: Activity List Item
const ActivityItem = ({ icon: Icon, iconBg, iconColor, title, desc, time }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg cursor-default">
        <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-1`}>
                <Icon className={iconColor} size={18} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
        </div>
        <span className="text-xs font-medium text-gray-400 whitespace-nowrap mt-2">{time}</span>
    </div>
);

const RecentActivities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/dashboard/activities`);
                if (response.ok) {
                    const data = await response.json();
                    setActivities(data);
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchActivities();
    }, []);

    // Helper to map DB icon type to Lucide Icon
    const getIcon = (type) => {
        switch (type) {
            case 'UserPlus': return UserPlus;
            case 'FileText': return FileText;
            case 'Upload': return Upload;
            default: return Clock;
        }
    };

    // Helper for colors
    const getColors = (type) => {
        switch (type) {
            case 'UserPlus': return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
            default: return { bg: 'bg-purple-100', text: 'text-purple-600' };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <div className="flex items-center gap-2 mb-8">
                <Clock className="text-gray-700" size={20} strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-800">Recent Office Activities</h3>
            </div>

            <div className="space-y-0">
                {activities.length > 0 ? (
                    activities.map((act) => {
                        const Icon = getIcon(act.icon_type);
                        const colors = getColors(act.icon_type);
                        const timeStr = new Date(act.created_at).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                        return (
                            <ActivityItem
                                key={act.id}
                                icon={Icon}
                                iconBg={colors.bg}
                                iconColor={colors.text}
                                title={act.title}
                                desc={act.description}
                                time={timeStr}
                            />
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent activities</p>
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
