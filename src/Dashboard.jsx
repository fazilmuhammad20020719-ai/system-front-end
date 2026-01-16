import { useState, useEffect } from 'react';
import { API_URL } from './config';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivities from './dashboard/RecentActivities';
import AlertsModal from './dashboard/AlertsModal';
import UpcomingAlerts from './dashboard/UpcomingAlerts';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // Dynamic Data State
    const [dashboardData, setDashboardData] = useState({
        stats: {
            students: null,
            teachers: null,
            programs: null,
            documents: null,
            studentAttendance: null,
            teacherAttendance: null,
            activeStudents: null,
            activeTeachers: null
        },
        activities: [],
        alerts: []
    });
    const [loading, setLoading] = useState(true);

    // Fetch Real Data from Backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/dashboard`);
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <DashboardHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onAlertClick={() => setIsAlertOpen(true)}
                    alertCount={dashboardData.alerts ? dashboardData.alerts.length : 0}
                />

                <main className="p-4 md:p-8 space-y-8 relative">
                    {/* Pass Dynamic Stats to Component */}
                    <DashboardStats stats={dashboardData.stats} />

                    <QuickActions />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Activities takes 2 columns */}
                        <div className="lg:col-span-2">
                            <RecentActivities activities={dashboardData.activities} />
                        </div>

                        {/* Upcoming Alerts takes 1 column */}
                        <div className="lg:col-span-1">
                            <UpcomingAlerts alerts={dashboardData.alerts} />
                        </div>
                    </div>
                </main>
            </div>

            {/* ALERT MODAL */}
            {isAlertOpen && (
                <AlertsModal onClose={() => setIsAlertOpen(false)} alerts={dashboardData.alerts} />
            )}
        </div>
    );
};

export default Dashboard;
