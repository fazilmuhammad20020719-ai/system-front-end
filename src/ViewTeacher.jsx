import { useState, useEffect } from 'react';
import {
    LayoutDashboard, FileText, Calendar, DollarSign, ArrowLeft, CheckCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Loader from './components/Loader';

// Import Components
import TeacherProfileHeader from './teacher-view/TeacherProfileHeader';
import TeacherOverview from './teacher-view/TeacherOverview';
import TeacherSchedule from './teacher-view/TeacherSchedule';
import TeacherPayroll from './teacher-view/TeacherPayroll';
import TeacherDocuments from './teacher-view/TeacherDocuments';
import TeacherAttendanceView from './teacher-view/TeacherAttendanceView';


const ViewTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [teacher, setTeacher] = useState(null);

    // Mock Data Fetching (Replaced with Static Placeholder until API is ready)
    useEffect(() => {
        // Placeholder Data
        const dummyData = {
            id: id || 1,
            firstName: "Loading",
            lastName: "Teacher",
            fullName: "Loading Teacher Profile...",
            image: null,
            status: "Active",
            dob: "1900-01-01",
            gender: "Male",
            nic: "000000000V",
            email: "loading@example.com",
            phone: "+00 00 000 0000",
            address: "Loading Address",
            googleMapLink: "https://maps.google.com",

            // Professional
            employeeId: "EMP-000",
            department: "Loading",
            designation: "Loading",
            qualification: "Loading",
            experience: "0 Years",
            joiningDate: "2020-01-01",
            role: "Teacher",

            // Financial
            salary: "0.00",

            // Arrays for Sub-Components
            documents: [],
            schedule: [],
            attendanceStats: { total: 0, present: 0, absent: 0 },
            payroll: []
        };
        setTeacher(dummyData);
    }, [id]);

    if (!teacher) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <main className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/teachers')}
                        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors font-medium"
                    >
                        <ArrowLeft size={18} /> Back to Directory
                    </button>

                    {/* 1. Header Component */}
                    <TeacherProfileHeader teacher={teacher} />

                    {/* 2. Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-0 z-10 overflow-x-auto scrollbar-hide">
                        <div className="flex min-w-max">
                            <TabItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                            <TabItem icon={Calendar} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                            <TabItem icon={CheckCircle} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                            <TabItem icon={DollarSign} label="Payroll" active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} />
                            <TabItem icon={FileText} label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                        </div>
                    </div>

                    {/* 3. Tab Content Render */}
                    <div className="space-y-6">
                        {activeTab === 'overview' && <TeacherOverview teacher={teacher} />}
                        {activeTab === 'schedule' && <TeacherSchedule schedule={teacher.schedule} />}
                        {activeTab === 'attendance' && <TeacherAttendanceView stats={teacher.attendanceStats} />}
                        {activeTab === 'schedule' && <TeacherSchedule schedule={teacher.schedule} />}
                        {activeTab === 'payroll' && <TeacherPayroll teacher={teacher} />}
                        {activeTab === 'documents' && <TeacherDocuments documents={teacher.documents} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper: Tab Button Component
const TabItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${active ? "border-green-600 text-green-600 bg-green-50/30" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
    >
        <Icon size={18} /> {label}
    </button>
);

export default ViewTeacher;