import { useState, useEffect } from 'react';
import {
    User, FileText, Clock, Award, CreditCard, Activity, ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

// Import Sub-Components
import StudentProfileHeader from './student-view/StudentProfileHeader';
import ViewStudentInfo from './student-view/ViewStudentInfo';
import ViewStudentDocuments from './student-view/ViewStudentDocuments';
import ViewStudentAttendance from './student-view/ViewStudentAttendance';
import ViewStudentResults from './student-view/ViewStudentResults';
import ViewStudentFees from './student-view/ViewStudentFees';
import ViewStudentTimeline from './student-view/ViewStudentTimeline';

const ViewStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');
    const [student, setStudent] = useState(null);

    // Mock Data Fetching (Updated to match Add Student)
    useEffect(() => {
        const dummyData = {
            id: id,
            // Personal
            firstName: 'Muhammad',
            lastName: 'Ahmed',
            image: null, // Placeholder handled in component
            dob: '2015-05-15',
            gender: 'Male',
            nic: '201512345678',
            email: 'student@example.com',
            phone: '077 123 4567',

            // Location (Updated)
            province: 'Western',
            district: 'Colombo',
            dsDivision: 'Colombo Dist', // New
            gnDivision: 'C-123', // New
            address: '123, Main Street, Colombo, Sri Lanka',
            googleMapLink: 'https://maps.google.com',

            // Guardian
            guardianName: 'Ali Ahmed',
            guardianRelation: 'Father',
            guardianPhone: '077 987 6543',
            guardianEmail: 'ali.ahmed@example.com',
            guardianOccupation: 'Merchant',

            // Academic (Updated)
            program: 'Hifzul Quran',
            year: 'Grade 5', // Current Grade/Year
            session: '2025', // Batch Year
            admissionDate: '2025-01-10',
            status: 'Active',

            // Previous Education (New)
            previousSchool: 'City High School',
            lastStudiedGrade: 'Grade 4',
            previousCollegeName: 'City Madrasa',
            mediumOfStudy: 'Tamil',

            // Extra Data
            documents: [
                { name: 'Birth_Certificate.pdf', size: '1.2 MB', date: '25 Dec 2025' },
                { name: 'Medical_Report.pdf', size: '2.4 MB', date: '25 Dec 2025' },
            ],
            attendanceStats: { present: 140, absent: 10, late: 5, total: 155 },
            results: [
                { exam: 'First Term', date: 'Mar 2025', grade: 'A', percentage: '88%', status: 'Passed' },
                { exam: 'Mid Term', date: 'Jun 2025', grade: 'B+', percentage: '75%', status: 'Passed' },
            ],
            fees: {
                pending: 'Rs. 5,000', paid: 'Rs. 45,000', history: [
                    { id: 'INV-001', month: 'Jan 2025', amount: 'Rs. 5,000', status: 'Paid' },
                    { id: 'INV-002', month: 'Feb 2025', amount: 'Rs. 5,000', status: 'Pending' }
                ]
            }
        };
        setStudent(dummyData);
    }, [id]);

    if (!student) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <main className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/students')}
                        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#EB8A33] transition-colors font-medium"
                    >
                        <ArrowLeft size={18} /> Back to Directory
                    </button>

                    {/* 1. Header Component */}
                    <StudentProfileHeader student={student} />

                    {/* 2. Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-0 z-10 overflow-x-auto scrollbar-hide">
                        <div className="flex min-w-max">
                            <TabItem icon={User} label="Personal Info" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
                            <TabItem icon={FileText} label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                            <TabItem icon={Clock} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                            <TabItem icon={Award} label="Results" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                            <TabItem icon={CreditCard} label="Fees" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
                            <TabItem icon={Activity} label="Timeline" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
                        </div>
                    </div>

                    {/* 3. Tab Content Render */}
                    <div className="space-y-6">
                        {activeTab === 'personal' && <ViewStudentInfo student={student} />}
                        {activeTab === 'documents' && <ViewStudentDocuments documents={student.documents} />}
                        {activeTab === 'attendance' && <ViewStudentAttendance stats={student.attendanceStats} />}
                        {activeTab === 'results' && <ViewStudentResults results={student.results} />}
                        {activeTab === 'fees' && <ViewStudentFees fees={student.fees} />}
                        {activeTab === 'timeline' && <ViewStudentTimeline />}
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

export default ViewStudent;