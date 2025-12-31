import { useState } from 'react';
import { Menu, Calendar } from 'lucide-react';
import Sidebar from './Sidebar';

// IMPORTING FROM THE NEW FOLDER
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivities from './dashboard/RecentActivities';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">

            {/* SIDEBAR COMPONENT */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT WRAPPER */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* MAIN PAGE CONTENT */}
                <main className="p-4 md:p-8 space-y-8">

                    {/* TOP HEADER: TITLE & DATE */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                        </div>
                        <div className="hidden md:flex bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 shadow-sm">
                            <Calendar size={16} />
                            <span>December 25, 2025</span>
                        </div>
                    </div>

                    {/* SEPARATED COMPONENTS */}
                    <DashboardStats />
                    <QuickActions />
                    <RecentActivities />

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
