import { useState } from 'react';
import Sidebar from './Sidebar';

// IMPORTING DASHBOARD COMPONENTS
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivities from './dashboard/RecentActivities';
import AlertsModal from './dashboard/AlertsModal'; // Puthu Import

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert Modal State

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">

            {/* SIDEBAR COMPONENT */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT WRAPPER */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* STICKY HEADER - Pass notification click handler */}
                <DashboardHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onAlertClick={() => setIsAlertOpen(true)}
                />

                {/* MAIN PAGE CONTENT */}
                <main className="p-4 md:p-8 space-y-8 relative">
                    <DashboardStats />

                    {/* Note: Ingu iruntha UpcomingAlerts-ai eduthu vittom.
                        Athu ippo Modal-kku ulle varum. */}

                    <QuickActions />
                    <RecentActivities />
                </main>
            </div>

            {/* ALERT MODAL OVERLAY */}
            {isAlertOpen && (
                <AlertsModal onClose={() => setIsAlertOpen(false)} />
            )}
        </div>
    );
};

export default Dashboard;
