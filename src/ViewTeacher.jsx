import { useState, useEffect } from 'react';
import {
    LayoutDashboard, FileText, Calendar, DollarSign, ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

// Import Components
import TeacherProfileHeader from './teacher-view/TeacherProfileHeader';
import TeacherOverview from './teacher-view/TeacherOverview';
import TeacherSchedule from './teacher-view/TeacherSchedule';
import TeacherPayroll from './teacher-view/TeacherPayroll';
import TeacherDocuments from './teacher-view/TeacherDocuments';

const ViewTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [teacher, setTeacher] = useState(null);

    // Mock Data Fetching
    useEffect(() => {
        const dummyData = {
            id: id || 1,
            firstName: "Sarah",
            lastName: "Wilson",
            fullName: "Dr. Sarah Wilson",
            image: null,
            status: "Active",
            dob: "1985-05-15",
            gender: "Female",
            nic: "851350123V",
            email: "sarah@college.edu",
            phone: "+94 77 123 4567",
            address: "45, Marine Drive, Colombo 03",

            // Professional
            employeeId: "EMP-001",
            department: "Islamic Studies",
            designation: "Head of Department",
            qualification: "PhD in Islamic Theology",
            experience: "12 Years",
            joiningDate: "2015-01-12",
            role: "Senior Lecturer",

            // Financial
            salary: "125,000.00",

            // Arrays for Sub-Components
            documents: [
                { id: 1, name: "Curriculum Vitae.pdf", size: "2.4 MB", date: "2024-01-10" },
                { id: 2, name: "PhD Certificate.jpg", size: "1.1 MB", date: "2015-02-20" },
                { id: 3, name: "Appointment Letter.pdf", size: "500 KB", date: "2015-01-12" },
            ],
            schedule: [
                { day: "Monday", time: "08:00 - 09:00", subject: "Quranic Tafseer", grade: "Year 3" },
                { day: "Monday", time: "10:00 - 11:00", subject: "Hadith Studies", grade: "Year 5" },
                { day: "Wednesday", time: "09:00 - 10:30", subject: "Fiqh", grade: "Year 4" },
            ],
            payroll: [
                { month: "October 2025", basic: "125,000", bonus: "5,000", status: "Paid" },
                { month: "September 2025", basic: "125,000", bonus: "0", status: "Paid" },
            ]
        };
        setTeacher(dummyData);
    }, [id]);

    if (!teacher) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <main className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/teachers')}
                        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#EB8A33] transition-colors font-medium"
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
                            <TabItem icon={DollarSign} label="Payroll" active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} />
                            <TabItem icon={FileText} label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                        </div>
                    </div>

                    {/* 3. Tab Content Render */}
                    <div className="space-y-6">
                        {activeTab === 'overview' && <TeacherOverview teacher={teacher} />}
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
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${active ? "border-[#EB8A33] text-[#EB8A33] bg-orange-50/30" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
    >
        <Icon size={18} /> {label}
    </button>
);

export default ViewTeacher;