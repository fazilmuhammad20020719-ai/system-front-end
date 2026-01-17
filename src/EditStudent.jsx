import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, ChevronRight, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

// Import sub-components
import StudentPersonalInfo from './add-student/StudentPersonalInfo';
import StudentLocationInfo from './add-student/StudentLocationInfo';
import StudentGuardianInfo from './add-student/StudentGuardianInfo';
import StudentAcademicInfo from './add-student/StudentAcademicInfo';
import StudentUploads from './add-student/StudentUploads';

const EditStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('details');

    const initialState = {
        // Basic
        studentPhoto: null, indexNumber: '', firstName: '', lastName: '', dob: '', gender: 'Male', nic: '', email: '', phone: '',
        // Location
        province: '', district: '', dsDivision: '', gnDivision: '', address: '', googleMapLink: '', latitude: '', longitude: '',
        // Guardian
        guardianName: '', guardianRelation: 'Father', guardianOccupation: '', guardianPhone: '', guardianEmail: '',
        // Academic
        program: '', session: '', admissionDate: '', lastStudiedGrade: '', previousSchoolName: '', previousCollegeName: '', mediumOfStudy: 'Tamil',
        // Uploads
        nicFront: null, nicBack: null, studentSignature: null, birthCertificate: null,
        // New Uploads
        medicalReport: null, guardianNic: null, guardianPhoto: null, leavingCertificate: null
    };

    const [formData, setFormData] = useState(initialState);
    const [programs, setPrograms] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Reset state immediately when ID changes to avoid showing stale data
        setFormData(initialState);

        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_URL}/api/programs`);
                if (response.ok) {
                    const data = await response.json();
                    setPrograms(data.map(p => p.name));
                }
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };

        const fetchStudent = async () => {
            try {
                const response = await fetch(`${API_URL}/api/students/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const splitName = data.name.split(' ');
                    const firstName = splitName[0];
                    const lastName = splitName.slice(1).join(' ');

                    // Merge fetched data into initialState (not prev, to ensure clean slate)
                    setFormData(prev => ({
                        ...initialState, // Start fresh
                        indexNumber: data.id,
                        firstName: firstName,
                        lastName: lastName,
                        program: data.program_name,
                        currentYear: data.current_year,
                        status: data.status,
                        session: data.session_year,
                        guardianName: data.guardian_name,
                        phone: data.contact_number,

                        dob: data.dob ? data.dob.split('T')[0] : '',
                        gender: data.gender || 'Male',
                        nic: data.nic || '',
                        email: data.email || '',
                        address: data.address || '',
                        city: data.city || '',
                        district: data.district || '',
                        province: data.province || '',
                        guardianRelation: data.guardian_relation || 'Father',
                        guardianOccupation: data.guardian_occupation || '',
                        guardianPhone: data.guardian_phone || '',

                        // Academic
                        admissionDate: data.admission_date ? data.admission_date.split('T')[0] : '',
                        previousSchoolName: data.previous_school || '',
                        mediumOfStudy: data.medium_of_study || 'Tamil',
                        // Note: Backend might not have these yet, so they will default to empty from initialState
                        lastStudiedGrade: data.last_studied_grade || '',
                        previousCollegeName: data.previous_college || ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };

        fetchPrograms();
        if (id) fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/students');
                }, 1500);
            } else {
                alert("Failed to update student");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student");
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex relative">
            {/* SUCCESS TOAST */}
            {showSuccess && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-top-5 flex items-center gap-3">
                    <div>
                        <h4 className="font-bold text-lg">Updated!</h4>
                        <p className="text-white/90 text-sm">Student details updated successfully.</p>
                    </div>
                </div>
            )}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-center">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg border text-gray-600 md:hidden"><Menu size={20} /></button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Edit Student</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>Students</span> <ChevronRight size={12} /> <span className="text-green-600">Edit Student</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleUpdate} className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Update</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                        {['details', 'guardian', 'academic', 'documents'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-white text-green-600 border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <StudentPersonalInfo formData={formData} handleChange={handleChange} />
                                <StudentLocationInfo formData={formData} handleChange={handleChange} setFormData={setFormData} />
                            </div>
                        )}
                        {activeTab === 'guardian' && <StudentGuardianInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'academic' && <StudentAcademicInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'documents' && <StudentUploads formData={formData} handleChange={handleChange} />}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default EditStudent;
