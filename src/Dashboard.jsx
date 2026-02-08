import { useState, useEffect } from 'react';
import { API_URL } from './config';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivities from './dashboard/RecentActivities';
import AlertsModal from './dashboard/AlertsModal';

import Sidebar from './Sidebar';
import Loader from './components/Loader';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // 1. Dynamic Data State
    const [dashboardData, setDashboardData] = useState({
        stats: {
            students: 0, teachers: 0, programs: 0, documents: 0,
            studentAttendance: '0%', teacherAttendance: '0%',
            activeStudents: 0, activeTeachers: 0
        },
        activities: [],
        alerts: []
    });
    const [loading, setLoading] = useState(true);

    // 2. Fetch Data
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

    if (loading) return <Loader />;

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
                    {/* Pass Dynamic Stats */}
                    <DashboardStats stats={dashboardData.stats} />

                    <QuickActions />


                    <RecentActivities activities={dashboardData.activities} />


                </main>
            </div>

            {/* ALERT MODAL (Reusing existing modal logic but passing alerts if needed, 
                though Modal likely fetches its own or we should pass alerts to it? 
                The user request used `UpcomingAlerts` component in the grid.
                Our existing `Dashboard.jsx` used `AlertsModal`. 
                Let's keep `AlertsModal` functionality for the top bar bell.
            */}
            {isAlertOpen && (
                <AlertsModal onClose={() => setIsAlertOpen(false)} alerts={dashboardData.alerts} />
            )}
        </div>
    );
};

export default Dashboard;
