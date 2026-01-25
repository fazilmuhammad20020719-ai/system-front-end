import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ChevronRight, Menu } from 'lucide-react';
import { API_URL } from './config';
import Sidebar from './Sidebar';
import { useNotification } from './context/NotificationContext';

// Import sub-components
import TeacherPersonalInfo from './add-teacher/TeacherPersonalInfo';
import TeacherProfessionalInfo from './add-teacher/TeacherProfessionalInfo';
import TeacherFinancialInfo from './add-teacher/TeacherFinancialInfo';
import TeacherUploads from './add-teacher/TeacherUploads';

const AddTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        // --- From Image (Personal) ---
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

        // --- From Image (Professional/Education) ---
        // --- From Image (Professional/Education) ---
        eduQualification: '',
        degreeInstitute: '',
        gradYear: '',
        teacherCategory: 'Sharia',
        appointmentType: 'Full Time',
        previousExperience: '',

        // --- Extra Standard Fields ---
        employeeId: '',
        designation: 'Lecturer',
        department: '', // Can be kept or derived
        joiningDate: '',

        // --- Financial (New Idea) ---
        basicSalary: '',
        bankName: '',
        accountNumber: '',

        // --- Uploads ---
        profilePhoto: null,
        cvFile: null,
        qualification: null,
        nicFront: null,
        nicBack: null,
        birthCertificate: null,

        // --- New Field ---
        program: '',
        assignedPrograms: [],
        status: 'Active' // Default status
    });

    const [programs, setPrograms] = useState([]); // State for programs

    useEffect(() => {
        // Fetch programs for dropdown
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_URL}/api/programs`);
                if (response.ok) {
                    const data = await response.json();
                    setPrograms(data);
                }
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };
        fetchPrograms();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data - map frontend fields to backend expected fields if needed
            // Currently backend expects: empId, name, program, subject, role, email, phone, address, nic, dob, joiningDate, designation, qualification
            // Frontend: fullName -> name, program (needs logic)

            const data = new FormData();
            data.append('empId', formData.employeeId);
            data.append('name', formData.fullName);
            data.append('program', formData.program); // Optional legacy field
            data.append('assignedPrograms', formData.assignedPrograms); // New Array Field
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
            // Append Files
            if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto);
            if (formData.cvFile) data.append('cvFile', formData.cvFile);
            if (formData.qualification) data.append('certificates', formData.qualification);
            if (formData.nicFront) data.append('nicFront', formData.nicFront);
            if (formData.nicBack) data.append('nicBack', formData.nicBack);
            if (formData.birthCertificate) data.append('birthCertificate', formData.birthCertificate);

            const response = await fetch(`${API_URL}/api/teachers`, {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                notify('success', 'Teacher added successfully!', 'Success');
                navigate('/teachers');
            } else {
                notify('error', 'Failed to save teacher.', 'Error');
            }
        } catch (error) {
            console.error("Error submitting teacher:", error);
            notify('error', 'Error saving teacher.', 'Error');
        }
    };

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
                                <h2 className="text-xl font-bold text-gray-800">Add New Teacher</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>Teachers</span> <ChevronRight size={12} /> <span className="text-green-600">Add Teacher</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Save</button>
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

export default AddTeacher;