import { useState, useEffect } from 'react';
import {
    LayoutDashboard, FileText, Calendar, DollarSign, ArrowLeft, CheckCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Loader from './components/Loader';
import { API_URL } from './config';

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

    // Fetch Real Data
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                // 1. Fetch Basic Info
                const response = await fetch(`${API_URL}/api/teachers/${id}`);
                const data = await response.json();

                // 2. Fetch Stats
                const statsRes = await fetch(`${API_URL}/api/teachers/${id}/stats`);
                const statsData = await statsRes.json();

                // 3. Fetch Documents (Uploaded via Documents Tab)
                const docsRes = await fetch(`${API_URL}/api/teachers/${id}/documents`);
                const filesData = await docsRes.json();

                // Combine Profile Docs (Static fields) with Uploaded Docs (Dynamic table)
                const profileDocs = [
                    data.cv_url ? { id: 'cv', name: 'CV / Resume', url: `${API_URL}${data.cv_url}`, date: 'Profile', size: '-', isProfileDoc: true } : null,
                    data.certificates_url ? { id: 'cert', name: 'Certificates', url: `${API_URL}${data.certificates_url}`, date: 'Profile', size: '-', isProfileDoc: true } : null,
                    data.nic_copy_url ? { id: 'nic', name: 'NIC Copy', url: `${API_URL}${data.nic_copy_url}`, date: 'Profile', size: '-', isProfileDoc: true } : null
                ].filter(Boolean);

                const uploadedDocs = filesData.map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    url: `${API_URL}${doc.file_url}`,
                    date: new Date(doc.created_at).toLocaleDateString(),
                    size: doc.file_size,
                    isProfileDoc: false
                }));

                const allDocuments = [...profileDocs, ...uploadedDocs];

                if (response.ok) {
                    const mappedTeacher = {
                        id: data.id,
                        firstName: data.name,
                        lastName: "",
                        fullName: data.name,
                        image: data.photo_url ? `${API_URL}${data.photo_url}` : null,
                        status: data.status,
                        dob: data.dob,
                        gender: data.gender,
                        nic: data.nic,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        googleMapLink: data.google_map_link,

                        // Professional
                        employeeId: data.emp_id,
                        department: data.department,
                        designation: data.designation,
                        qualification: data.qualification,
                        experience: data.previous_experience,
                        joiningDate: data.joining_date,
                        role: data.designation,

                        // Financial
                        salary: data.basic_salary,

                        // Arrays & Objects
                        documents: allDocuments,
                        stats: statsData, // Passing stats here
                        schedule: [],
                        attendanceStats: { total: 0, present: 0, absent: 0 },
                        payroll: []
                    };
                    setTeacher(mappedTeacher);
                } else {
                    console.error("Failed to fetch teacher");
                }
            } catch (err) {
                console.error("Error fetching teacher:", err);
            }
        };
        fetchTeacher();
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
                        {activeTab === 'overview' && <TeacherOverview teacher={teacher} stats={teacher.stats} />}
                        {activeTab === 'schedule' && <TeacherSchedule schedule={teacher.schedule} />}
                        {activeTab === 'attendance' && <TeacherAttendanceView stats={teacher.attendanceStats} />}
                        {activeTab === 'schedule' && <TeacherSchedule schedule={teacher.schedule} />}
                        {activeTab === 'payroll' && <TeacherPayroll teacher={teacher} />}
                        {activeTab === 'documents' && <TeacherDocuments documents={teacher.documents} teacherId={teacher.id} refreshTeacher={() => navigate(0)} />}
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