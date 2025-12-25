import { useState } from 'react';
import {
    Calendar,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    Folder,
    UserPlus,
    FileText,
    Upload,
    Clock,
    ArrowRight
} from 'lucide-react';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">

            {/* SIDEBAR COMPONENT */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT WRAPPER */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                {/* MAIN PAGE CONTENT */}
                <main className="p-8 space-y-8">

                    {/* TOP HEADER: TITLE & DATE */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                        <div className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                            <Calendar size={16} />
                            <span>December 25, 2025</span>
                        </div>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Students"
                            value="4"
                            subText="View Directory"
                            icon={GraduationCap}
                            iconColor="text-indigo-600"
                            iconBg="bg-indigo-100"
                        />
                        <StatCard
                            title="Programs"
                            value="4"
                            subText="Manage Courses"
                            icon={BookOpen}
                            iconColor="text-orange-600"
                            iconBg="bg-orange-100"
                        />
                        <StatCard
                            title="Attendance Today"
                            value="50%"
                            subText="2 / 4 Present"
                            icon={CalendarCheck}
                            iconColor="text-green-600"
                            iconBg="bg-green-100"
                        />
                        <StatCard
                            title="Documents"
                            value="15"
                            subText="File Repository"
                            icon={Folder}
                            iconColor="text-purple-600"
                            iconBg="bg-purple-100"
                        />
                    </div>

                    {/* QUICK ACTIONS BAR */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                            <p className="text-gray-500 text-sm mt-1">Manage students and admissions efficiently.</p>
                        </div>
                        <button className="bg-[#E88931] hover:bg-[#d67b28] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                            <UserPlus size={18} />
                            Add Student Box
                        </button>
                    </div>

                    {/* RECENT ACTIVITIES SECTION */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                        <div className="flex items-center gap-2 mb-8">
                            <Clock className="text-gray-700" size={20} strokeWidth={2.5} />
                            <h3 className="text-lg font-bold text-gray-800">Recent Office Activities</h3>
                        </div>

                        <div className="space-y-0">
                            <ActivityItem
                                icon={UserPlus}
                                iconBg="bg-indigo-100"
                                iconColor="text-indigo-600"
                                title="New Admission"
                                desc="agdf - Qiraat Course 1st Year"
                                time="25 Dec, 01:41 PM"
                            />
                            <ActivityItem
                                icon={FileText}
                                iconBg="bg-purple-100"
                                iconColor="text-purple-600"
                                title="Document Uploaded"
                                desc="File Birth Certificate (Student File)"
                                time="25 Dec, 01:41 PM"
                            />
                            <ActivityItem
                                icon={Upload}
                                iconBg="bg-purple-100"
                                iconColor="text-purple-600"
                                title="Document Uploaded"
                                desc="File ID Card/NIC (Student File)"
                                time="25 Dec, 01:41 PM"
                            />
                            <ActivityItem
                                icon={Upload}
                                iconBg="bg-purple-100"
                                iconColor="text-purple-600"
                                title="Document Uploaded"
                                desc="File School Leaving Cert (Student File)"
                                time="25 Dec, 01:41 PM"
                            />
                            <ActivityItem
                                icon={Upload}
                                iconBg="bg-purple-100"
                                iconColor="text-purple-600"
                                title="Document Uploaded"
                                desc="File Medical Report (Student File)"
                                time="25 Dec, 01:41 PM"
                            />
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

// Component: Individual Stat Card
const StatCard = ({ title, value, subText, icon: Icon, iconColor, iconBg }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition-all">
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={iconColor} size={28} />
        </div>
        <div className="flex-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium cursor-pointer hover:text-gray-600 transition-colors group">
                {subText}
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
        </div>
    </div>
);

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

export default Dashboard;