import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from './config';
import { Save, X, ChevronRight, Menu, CheckCircle } from 'lucide-react';
import Sidebar from './Sidebar';

import { useNotification } from './context/NotificationContext';

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
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        studentPhoto: null, indexNumber: '', firstName: '', lastName: '', dob: '', gender: 'Male', nic: '', email: '', phone: '', whatsapp: '',
        status: 'Active',
        province: '', district: '', dsDivision: '', gnDivision: '', address: '', googleMapLink: '', latitude: '', longitude: '',
        guardianName: '', guardianRelation: 'Father', guardianOccupation: '', guardianPhone: '', guardianEmail: '',
        // Legacy fields + Enrollments
        programId: '', session: '', currentYear: '', admissionDate: '', status: 'Active',
        enrollments: [], // Multi-Program Support
        lastStudiedGrade: '', previousSchoolName: '', previousCollegeName: '', mediumOfStudy: 'Tamil',
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

                    let loadedEnrollments = [];
                    if (data.enrollments && Array.isArray(data.enrollments) && data.enrollments.length > 0) {
                        loadedEnrollments = data.enrollments.map(e => ({
                            programId: e.program_id,
                            session: e.session || e.session_year,
                            currentYear: e.year || e.current_year,
                            status: e.status,
                            admissionDate: e.admission_date ? e.admission_date.split('T')[0] : ''
                        }));
                    } else {
                        // Fallback logic
                        loadedEnrollments = [{
                            programId: data.program_id,
                            session: data.session_year,
                            currentYear: data.current_year,
                            status: data.status,
                            admissionDate: data.admission_date ? data.admission_date.split('T')[0] : ''
                        }];
                    }

                    setFormData({
                        indexNumber: data.id,
                        firstName: fName,
                        lastName: lName,
                        dob: data.dob ? data.dob.split('T')[0] : '',
                        gender: data.gender || 'Male',
                        nic: data.nic || '',
                        email: data.email || '',
                        phone: data.contact_number || '',
                        whatsapp: data.whatsapp || '',
                        status: data.status || 'Active',
                        address: data.address || '',
                        city: data.city || '',
                        district: data.district || '',
                        province: data.province || '',
                        dsDivision: data.ds_division || '',
                        gnDivision: data.gn_division || '',
                        googleMapLink: data.google_map_link || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',
                        guardianName: data.guardian_name || '',
                        guardianRelation: data.guardian_relation || 'Father',
                        guardianOccupation: data.guardian_occupation || '',
                        guardianPhone: data.guardian_phone || '',
                        guardianEmail: data.guardian_email || '',
                        programId: data.program_id || '',
                        session: data.session_year || '',
                        currentYear: data.current_year || '',
                        admissionDate: data.admission_date ? data.admission_date.split('T')[0] : '',
                        enrollments: loadedEnrollments, // Use the prepared variable
                        previousSchoolName: data.previous_school || '',
                        lastStudiedGrade: data.last_studied_grade || '',
                        previousCollegeName: data.previous_college || '',
                        mediumOfStudy: data.medium_of_study || 'Tamil',
                        studentPhoto: null,
                        photoUrl: data.photo_url ? `${API_URL}${data.photo_url}` : null,
                        guardianPhoto: null,
                        guardianPhotoUrl: data.guardian_photo ? `${API_URL}${data.guardian_photo}` : null
                    });
                } else {
                    notify('error', "Student not found!", 'Error');
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

    // --- திருத்தப்பட்ட SUBMIT FUNCTION (FormData) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. FormData உருவாக்குதல்
        const data = new FormData();

        // 2. State-ல் உள்ள தரவுகளை இதில் ஏற்றுதல்
        for (const key in formData) {
            if (key === 'enrollments') {
                data.append('enrollments', JSON.stringify(formData.enrollments));
            } else if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch(`${API_URL}/api/students`, {
                method: 'POST',
                body: data, // JSON-க்கு பதிலாக FormData அனுப்புகிறோம்
            });

            if (response.ok) {
                notify('success', "Student Updated Successfully", 'Success');
                setTimeout(() => {
                    navigate(`/students/${formData.indexNumber}`);
                }, 1500);
            } else {
                const errData = await response.json();
                notify('error', errData.message || "Error updating student", 'Update Failed');
            }
        } catch (error) {
            console.error("Error updating:", error);
            notify('error', "Network error.", 'Network Error');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Student Data...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">
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

                    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                        {['details', 'guardian', 'academic', 'documents'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-white text-blue-600 border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>{tab}</button>
                        ))}
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                                    Note: You cannot change the <b>Index Number</b> here.
                                </div>
                                <StudentPersonalInfo formData={formData} handleChange={handleChange} handleStatusChange={handleStatusChange} />
                                <StudentLocationInfo formData={formData} handleChange={handleChange} />
                            </div>
                        )}
                        {activeTab === 'guardian' && <StudentGuardianInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'academic' && (
                            <StudentAcademicInfo formData={formData} handleChange={handleChange} programs={programOptions} setFormData={setFormData} />
                        )}
                        {activeTab === 'documents' && <StudentUploads formData={formData} handleChange={handleChange} />}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default EditStudent;