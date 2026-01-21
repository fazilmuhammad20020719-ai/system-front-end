import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, ChevronRight, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { API_URL } from './config';
import Loader from './components/Loader';
import { useNotification } from './context/NotificationContext';

// Import sub-components (Reusing from Add functionality)
import TeacherPersonalInfo from './add-teacher/TeacherPersonalInfo';
import TeacherProfessionalInfo from './add-teacher/TeacherProfessionalInfo';
import TeacherFinancialInfo from './add-teacher/TeacherFinancialInfo';
import TeacherUploads from './add-teacher/TeacherUploads';


const EditTeacher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState('personal');
    const { notify } = useNotification();

    // Initial Form State
    const [formData, setFormData] = useState({
        // --- Personal ---
        fullName: '',
        address: '',
        mapLink: '',
        dob: '',
        nic: '',
        phone: '',
        whatsapp: '',
        maritalStatus: 'Single',
        email: '',
        gender: 'Male',

        // --- Professional/Education ---
        eduQualification: '',
        degreeInstitute: '',
        gradYear: '',
        teacherCategory: 'Sharia',
        appointmentType: 'Full Time',
        previousExperience: '',

        // --- Standard Fields ---
        employeeId: '',
        designation: '',
        department: '',
        program: '',
        assignedPrograms: [], // Added for multi-select support
        subject: '',
        joiningDate: '',
        status: 'Active',

        // --- Financial ---
        basicSalary: '',
        bankName: '',
        accountNumber: '',

        // --- Uploads ---
        profilePhoto: null,
        cvFile: null,
        certificates: null,
        nicCopy: null
    });

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Programs
                const progRes = await fetch(`${API_URL}/api/programs`);
                if (progRes.ok) {
                    setPrograms(await progRes.json());
                }

                // Fetch Teacher Details
                if (!id) return;
                const response = await fetch(`${API_URL}/api/teachers/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        // Map backend fields to frontend
                        fullName: data.name || '',
                        address: data.address || '',
                        mapLink: data.google_map_link || '', // Assuming standard field naming
                        dob: data.dob ? data.dob.split('T')[0] : '',
                        nic: data.nic || '',
                        phone: data.phone || '',
                        whatsapp: data.whatsapp || '',
                        maritalStatus: data.marital_status || 'Single',
                        email: data.email || '',
                        gender: data.gender || 'Male',

                        eduQualification: data.qualification || '',
                        degreeInstitute: data.degree_institute || '',
                        gradYear: data.grad_year || '',
                        teacherCategory: data.teacher_category || data.subject || 'Sharia',
                        appointmentType: data.appointment_type || 'Full Time',
                        previousExperience: data.previous_experience || '',

                        employeeId: data.emp_id || '',
                        designation: data.designation || '',
                        department: data.department || '',
                        program: data.program_name || '',
                        assignedPrograms: data.assigned_programs ? data.assigned_programs.split(', ') : [], // Parse string to array
                        subject: data.subject || '',
                        joiningDate: data.joining_date ? data.joining_date.split('T')[0] : '',
                        status: data.status || 'Active',

                        basicSalary: data.basic_salary || '',
                        bankName: data.bank_name || '',
                        accountNumber: data.account_number || '',

                        // Allow file updates (null means no change)
                        profilePhoto: null,
                        cvFile: null,
                        certificates: null,
                        nicCopy: null
                    });
                } else {
                    notify('error', 'Teacher not found', 'Error');
                    navigate('/teachers');
                }
            } catch (err) {
                console.error("Error fetching data:", err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('empId', formData.employeeId);
            data.append('name', formData.fullName);
            data.append('program', formData.program);
            data.append('assignedPrograms', formData.assignedPrograms);
            data.append('teacherCategory', formData.teacherCategory);
            data.append('designation', formData.designation);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('whatsapp', formData.whatsapp);
            data.append('address', formData.address);
            data.append('googleMapLink', formData.mapLink);
            data.append('nic', formData.nic);
            data.append('dob', formData.dob);
            data.append('gender', formData.gender);
            data.append('maritalStatus', formData.maritalStatus);
            data.append('joiningDate', formData.joiningDate);
            data.append('qualification', formData.eduQualification);
            data.append('degreeInstitute', formData.degreeInstitute);
            data.append('gradYear', formData.gradYear);
            data.append('appointmentType', formData.appointmentType);
            data.append('previousExperience', formData.previousExperience);
            data.append('department', formData.department);
            data.append('basicSalary', formData.basicSalary);
            data.append('bankName', formData.bankName);
            data.append('accountNumber', formData.accountNumber);
            data.append('status', formData.status);

            if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto);
            if (formData.cvFile) data.append('cvFile', formData.cvFile);
            if (formData.certificates) data.append('certificates', formData.certificates);
            if (formData.nicCopy) data.append('nicCopy', formData.nicCopy);

            const response = await fetch(`${API_URL}/api/teachers/${id}`, {
                method: 'PUT',
                body: data
            });

            if (response.ok) {
                notify('success', 'Teacher updated successfully!', 'Success');
                navigate('/teachers');
            } else {
                notify('error', 'Failed to update teacher.', 'Error');
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
            notify('error', 'Error updating teacher.', 'Error');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-center">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg border text-gray-600 md:hidden"><Menu size={20} /></button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Edit Teacher</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>Teachers</span> <ChevronRight size={12} /> <span className="text-green-600">Edit Teacher</span>
                                    {formData.employeeId && <span className="text-gray-400">({formData.employeeId})</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Update Changes</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                        {[
                            { id: 'personal', label: 'Personal Info' },
                            { id: 'professional', label: 'Education & Job' },
                            { id: 'financial', label: 'Financial' },
                            { id: 'documents', label: 'Documents' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-green-600 border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'personal' && <TeacherPersonalInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'professional' && <TeacherProfessionalInfo formData={formData} handleChange={handleChange} programs={programs} />}
                        {activeTab === 'financial' && <TeacherFinancialInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'documents' && <TeacherUploads formData={formData} handleChange={handleChange} />}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default EditTeacher;
