import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, ChevronRight, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

// Import sub-components (Reusing from Add functionality)
import TeacherPersonalInfo from './add-teacher/TeacherPersonalInfo';
import TeacherProfessionalInfo from './add-teacher/TeacherProfessionalInfo';
import TeacherFinancialInfo from './add-teacher/TeacherFinancialInfo';
import TeacherUploads from './add-teacher/TeacherUploads';

import { TEACHERS_DATA } from './data/mockData';

const EditTeacher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState('personal');

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
        teachingCategory: 'Sharia',
        appointmentType: 'Full Time',
        previousExperience: '',

        // --- Standard Fields ---
        employeeId: '',
        designation: '',
        department: '',
        program: '', // Added to support new structure
        subject: '', // Added to support new structure
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

    // Simulate Fetching Data
    useEffect(() => {
        // Find teacher from mock data
        const teacher = TEACHERS_DATA.find(t => t.id === parseInt(id));

        if (teacher) {
            // Pre-fill form with available mock data
            // Note: In a real app, you would fetch full details from API. 
            // Here we mix mock data w/ placeholders for missing fields.
            setFormData(prev => ({
                ...prev,
                fullName: teacher.name,
                employeeId: teacher.empid,
                email: teacher.email,
                phone: teacher.phone,
                program: teacher.program,
                subject: teacher.subject,
                designation: teacher.role,
                status: teacher.status,

                // Filling placeholders for demo purposes since mock data is limited
                address: '123, Main Street, Colombo',
                nic: '123456789V',
                dob: '1990-01-01',
                gender: 'Male',
                basicSalary: '50000',
                joiningDate: '2023-01-15'
            }));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Teacher Data:", formData);
        alert("Teacher Record Updated Successfully!");
        navigate('/teachers');
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
                                <h2 className="text-xl font-bold text-gray-800">Edit Teacher</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>Teachers</span> <ChevronRight size={12} /> <span className="text-[#EB8A33]">Edit Teacher</span>
                                    {formData.employeeId && <span className="text-gray-400">({formData.employeeId})</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 md:flex-none px-6 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Update Changes</button>
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
                                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-[#EB8A33] border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'personal' && <TeacherPersonalInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'professional' && <TeacherProfessionalInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'financial' && <TeacherFinancialInfo formData={formData} handleChange={handleChange} />}
                        {activeTab === 'documents' && <TeacherUploads formData={formData} handleChange={handleChange} />}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default EditTeacher;
