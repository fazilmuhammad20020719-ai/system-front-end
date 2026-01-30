import { useState, useEffect } from 'react';
import {
    User, FileText, Clock, Award, CreditCard, Activity, ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { API_URL } from './config';

// Import Sub-Components
import StudentProfileHeader from './student-view/StudentProfileHeader';
import ViewStudentInfo from './student-view/ViewStudentInfo';
import ViewStudentDocuments from './student-view/ViewStudentDocuments';
import ViewStudentAttendance from './student-view/ViewStudentAttendance';
import ViewStudentResults from './student-view/ViewStudentResults';
import ViewStudentFees from './student-view/ViewStudentFees';
import ViewStudentTimeline from './student-view/ViewStudentTimeline';
import Loader from './components/Loader';

const ViewStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                // Fetch basic student info
                const sRes = await fetch(`${API_URL}/api/students/${id}?t=${Date.now()}`);

                if (!sRes.ok) {
                    console.error("Student not found");
                    setLoading(false);
                    return;
                }

                const sData = await sRes.json();


                // Fetch Attendance for stats
                const attRes = await fetch(`${API_URL}/api/attendance?studentId=${id}`);
                const attData = attRes.ok ? await attRes.json() : [];

                // Calculate Attendance Stats
                const present = attData.filter(a => a.status === 'Present').length;
                const absent = attData.filter(a => a.status === 'Absent').length;
                const total = attData.length;

                // Helper to check and add document
                const docs = [];
                const addDoc = (path, title) => {
                    if (path) {
                        docs.push({
                            name: title,
                            path: `${API_URL}${path}`, // Ensure full URL if needed, or relative
                            date: 'N/A', // We don't track upload date per file in this schema
                            size: 'N/A'
                        });
                    }
                };

                addDoc(sData.nic_front, 'NIC Front');
                addDoc(sData.nic_back, 'NIC Back');
                addDoc(sData.student_signature, 'Student Signature');
                addDoc(sData.birth_certificate, 'Birth Certificate');
                addDoc(sData.medical_report, 'Medical Report');
                addDoc(sData.guardian_nic, 'Guardian NIC');
                addDoc(sData.guardian_photo, 'Guardian Photo');
                addDoc(sData.leaving_certificate, 'Leaving Certificate');

                // Merging Data
                const fullProfile = {
                    id: sData.id,
                    // Personal - Map fields from DB columns
                    firstName: sData.name ? sData.name.split(' ')[0] : '',
                    lastName: sData.name ? sData.name.split(' ').slice(1).join(' ') : '',
                    name: sData.name || '', // Add name explicitly
                    image: sData.photo_url
                        ? `${API_URL}${sData.photo_url}`
                        : null,
                    dob: sData.dob ? sData.dob.split('T')[0] : 'N/A',
                    gender: sData.gender || 'Male',
                    nic: sData.nic || 'N/A',
                    email: sData.email || 'N/A',
                    email: sData.email || 'N/A',
                    phone: sData.contact_number || sData.phone || 'N/A',
                    whatsapp: sData.whatsapp || sData.contact_number || 'N/A', // Add whatsapp explicit mapping, fallback to phone

                    // Location
                    city: sData.city || '', // Add city explicitly
                    province: sData.province || 'N/A',
                    district: sData.district || 'N/A',
                    dsDivision: sData.ds_division || 'N/A',
                    gnDivision: sData.gn_division || 'N/A',
                    address: sData.address || 'Address not set',
                    googleMapLink: sData.google_map_link || '',
                    latitude: sData.latitude || '',
                    longitude: sData.longitude || '',

                    // Guardian
                    guardianName: sData.guardian_name || 'N/A',
                    guardianRelation: sData.guardian_relation || 'N/A',
                    guardianPhone: sData.guardian_phone || 'N/A',
                    guardianEmail: sData.guardian_email || 'N/A',
                    guardianOccupation: sData.guardian_occupation || 'N/A',
                    guardianPhoto: sData.guardian_photo ? `${API_URL}${sData.guardian_photo}` : null,

                    // Enrollments
                    enrollments: sData.enrollments && sData.enrollments.length > 0 ? sData.enrollments.map(e => ({
                        program: e.program,
                        year: e.year,
                        session: e.session,
                        status: e.status,
                        admissionDate: e.admission_date ? e.admission_date.split('T')[0] : 'N/A'
                    })) : [{
                        // Fallback logic if array empty (but with migration it shouldn't be)
                        program: sData.program_name || sData.program,
                        year: sData.current_year,
                        session: sData.session_year,
                        status: sData.status || 'Active',
                        admissionDate: sData.admission_date ? sData.admission_date.split('T')[0] : 'N/A'
                    }],

                    // Academic
                    program: sData.program_name || sData.program, // Keep for backward compat defaults
                    year: sData.current_year,
                    session: sData.session_year,
                    admissionDate: sData.admission_date ? sData.admission_date.split('T')[0] : 'N/A',
                    status: sData.status || 'Active',

                    // Extra Data
                    previousSchool: sData.previous_school || 'N/A',
                    lastStudiedGrade: sData.last_studied_grade || 'N/A',
                    previousCollegeName: sData.previous_college || 'N/A',
                    mediumOfStudy: sData.medium_of_study || 'N/A',

                    documents: docs,
                    attendanceStats: { present, absent, late: 0, total },
                    results: [],
                    fees: {
                        pending: 'Rs. 0', paid: 'Rs. 0', history: []
                    }
                };

                setStudent(fullProfile);

            } catch (err) {
                console.error("Error fetching student profile:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudentData();
    }, [id]);

    if (loading) return <Loader />;
    if (!student) return <div className="p-10 text-center">Student Not Found</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <main className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/students')}
                        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors font-medium"
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
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${active ? "border-green-600 text-green-600 bg-green-50/30" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
    >
        <Icon size={18} /> {label}
    </button>
);

export default ViewStudent;