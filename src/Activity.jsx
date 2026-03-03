import { useState, useEffect } from 'react';
import { API_URL } from './config';
import DashboardHeader from './dashboard/DashboardHeader';
import Sidebar from './Sidebar';
import Loader from './components/Loader';
import { Activity as ActivityIcon, Calendar, Clock, Filter, UserPlus, FileText, Upload, Edit, Trash2 } from 'lucide-react';

const Activity = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('30days'); // Default to last 30 days

    const filterOptions = [
        { id: 'today', label: 'Today' },
        { id: '3days', label: 'Last 3 Days' },
        { id: '7days', label: 'Last 7 Days' },
        { id: '30days', label: 'Last 30 Days' }
    ];

    const fetchActivities = async (range) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/activities?range=${range}`);
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            }
        } catch (err) {
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities(filter);
    }, [filter]);

    // Helper to get dynamic icon based on icon_type string
    const getIcon = (type) => {
        switch (type) {
            case 'UserPlus': return <UserPlus size={18} className="text-blue-500" />;
            case 'FileText': return <FileText size={18} className="text-purple-500" />;
            case 'Upload': return <Upload size={18} className="text-green-500" />;
            case 'Edit': return <Edit size={18} className="text-orange-500" />;
            case 'Trash2': return <Trash2 size={18} className="text-red-500" />;
            case 'Calendar': return <Calendar size={18} className="text-indigo-500" />;
            default: return <ActivityIcon size={18} className="text-gray-500" />;
        }
    };

    // Helper to format date relative or absolute
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0 min-w-0`}>

                {/* Reusing Dashboard Header but can pass specific props if needed */}
                <DashboardHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    alertCount={0}
                />

                <main className="p-4 md:p-8 space-y-6 flex-1 overflow-x-hidden">
                    {/* Header Details */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <ActivityIcon className="text-blue-600" size={28} />
                                Activity Log
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Track comprehensive system activities and user actions</p>
                        </div>

                        {/* Filters */}
                        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto shadow-inner">
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilter(opt.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${filter === opt.id
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                                <Filter size={48} className="text-gray-300 mb-4" />
                                <p className="text-lg font-medium text-gray-700">No activities found</p>
                                <p className="text-sm">Try selecting a different time range</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-8">
                                {activities.map((activity, index) => (
                                    <div key={activity.id || index} className="relative pl-6 sm:pl-8 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[21px] top-1 h-10 w-10 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-blue-50 transition-all duration-200">
                                            {getIcon(activity.icon_type)}
                                        </div>

                                        {/* Content Card */}
                                        <div className="bg-white hover:bg-gray-50 transition-colors duration-200 p-4 rounded-xl border border-transparent hover:border-gray-100">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 text-base">
                                                    {activity.title}
                                                </h3>
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap w-fit">
                                                    <Clock size={12} />
                                                    {formatTime(activity.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Activity;
