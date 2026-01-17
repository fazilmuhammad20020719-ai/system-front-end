import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from './config';
import { Save, X, ChevronRight, Menu, CheckCircle } from 'lucide-react'; // CheckCircle சேர்த்துள்ளேன்
import Sidebar from './Sidebar';

import StudentPersonalInfo from './add-student/StudentPersonalInfo';
import StudentLocationInfo from './add-student/StudentLocationInfo';
import StudentGuardianInfo from './add-student/StudentGuardianInfo';
import StudentAcademicInfo from './add-student/StudentAcademicInfo';
import StudentUploads from './add-student/StudentUploads';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState('details');
    const [programOptions, setProgramOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState(""); // Success State

    const [formData, setFormData] = useState({
        studentPhoto: null, indexNumber: '', firstName: '', lastName: '', dob: '', gender: 'Male', nic: '', email: '', phone: '',
        status: 'Active',
        province: '', district: '', dsDivision: '', gnDivision: '', address: '', googleMapLink: '', latitude: '', longitude: '',
        guardianName: '', guardianRelation: 'Father', guardianOccupation: '', guardianPhone: '', guardianEmail: '',
        program: '', session: '', currentYear: '', admissionDate: '', lastStudiedGrade: '', previousSchoolName: '', previousCollegeName: '', mediumOfStudy: 'Tamil',
        nicFront: null, nicBack: null, studentSignature: null, birthCertificate: null,
        medicalReport: null, guardianNic: null, guardianPhoto: null, leavingCertificate: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const progRes = await fetch(`${API_URL}/api/programs`);
                const progData = await progRes.json();
                setProgramOptions(progData);

                const studentRes = await fetch(`${API_URL}/api/students/${id}`);

                if (studentRes.ok) {
                    const data = await studentRes.json();

                    const nameParts = data.name ? data.name.split(' ') : ['', ''];
                    const fName = nameParts[0];
                    const lName = nameParts.slice(1).join(' ');

                    setFormData({
                        indexNumber: data.id,
                        firstName: fName,
                        lastName: lName,
                        dob: data.dob ? data.dob.split('T')[0] : '',
                        gender: data.gender || 'Male',
                        nic: data.nic || '',
                        email: data.email || '',
                        phone: data.contact_number || '',
                        status: data.status || 'Active',
                        address: data.address || '',
                        city: data.city || '',
                        district: data.district || '',
                        province: data.province || '',
                        guardianName: data.guardian_name || '',
                        guardianRelation: data.guardian_relation || 'Father',
                        guardianOccupation: data.guardian_occupation || '',
                        guardianPhone: data.guardian_phone || '',
                        program: data.program_name || '',
                        session: data.session_year || '',
                        currentYear: data.current_year || '',
                        admissionDate: data.admission_date ? data.admission_date.split('T')[0] : '',
                        previousSchoolName: data.previous_school || '',
                        mediumOfStudy: data.medium_of_study || 'Tamil',
                        studentPhoto: null
                    });
                } else {
                    alert("Student not found!");
                    navigate('/students');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        const newGrade = newStatus === 'Active' ? 'Grade 1' : newStatus;
        setFormData(prev => ({ ...prev, status: newStatus, currentYear: newGrade }));
    };

    // --- UPDATE SUBMIT (Modified) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/students`, {
                method: 'POST', // Using POST with upsert logic as per backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Show Custom Success Message
                setSuccessMsg("Student Edited Successfully");

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    navigate('/students');
                }, 1500);
            } else {
                const errData = await response.json();
                alert(errData.message || "Error updating student");
            }
        } catch (error) {
            console.error("Error updating:", error);
            alert("Network error.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Student Data...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* SUCCESS TOAST */}
            {successMsg && (
                <div className="fixed top-5 right-5 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-in">
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                        <h4 className="font-bold">Success!</h4>
                        <p className="text-sm">{successMsg}</p>
                    </div>
                </div>
            )}

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-center">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg border text-gray-600 md:hidden"><Menu size={20} /></button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Edit Student</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{formData.indexNumber}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Update</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                        {['details', 'guardian', 'academic', 'documents'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-white text-blue-600 border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>{tab}</button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                                    Note: You cannot change the <b>Index Number</b> here.
                                </div>
                                <StudentPersonalInfo
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleStatusChange={handleStatusChange}
                                />
                                <StudentLocationInfo formData={formData} handleChange={handleChange} />
                            </div>
                        )}
                        {activeTab === 'guardian' && <StudentGuardianInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'academic' && (
                            <StudentAcademicInfo
                                formData={formData}
                                handleChange={handleChange}
                                programs={programOptions}
                            />
                        )}
                        {activeTab === 'documents' && <StudentUploads formData={formData} handleChange={handleChange} />}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default EditStudent;