import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ChevronRight, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

// Import sub-components
import StudentPersonalInfo from './add-student/StudentPersonalInfo';
import StudentLocationInfo from './add-student/StudentLocationInfo';
import StudentGuardianInfo from './add-student/StudentGuardianInfo';
import StudentAcademicInfo from './add-student/StudentAcademicInfo';
import StudentUploads from './add-student/StudentUploads';

const AddStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');

    const [formData, setFormData] = useState({
        // Basic
        studentPhoto: null, indexNumber: '', firstName: '', lastName: '', dob: '', gender: 'Male', nic: '', email: '', phone: '',
        // Location
        province: '', district: '', dsDivision: '', gnDivision: '', address: '', googleMapLink: '', latitude: '', longitude: '',
        // Guardian
        guardianName: '', guardianRelation: 'Father', guardianOccupation: '', guardianPhone: '',
        // Academic
        program: '', session: '2025', admissionDate: '', lastStudiedGrade: '', previousSchoolName: '', previousCollegeName: '', mediumOfStudy: 'Tamil',
        // Uploads
        nicFront: null, nicBack: null, studentSignature: null, birthCertificate: null,
        // New Uploads
        medicalReport: null, guardianNic: null, guardianPhoto: null, leavingCertificate: null
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        alert("Student Saved!");
        navigate('/students');
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
                                <h2 className="text-xl font-bold text-gray-800">New Admission</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>Students</span> <ChevronRight size={12} /> <span className="text-[#EB8A33]">Add Student</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><X size={16} /> Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 md:flex-none px-6 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2"><Save size={16} /> Save</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                        {['details', 'guardian', 'academic', 'documents'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-white text-[#EB8A33] border-t border-x border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
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

export default AddStudent;