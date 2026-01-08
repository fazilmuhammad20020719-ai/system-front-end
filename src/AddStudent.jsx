import { useState } from 'react';
import {
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    BookOpen,
    FileText,
    UploadCloud,
    Save,
    X,
    ChevronRight,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AddStudent = () => {
    // FIX: Default sidebar closed on mobile (width < 768px), open on PC
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        nic: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianRelation: 'Father',
        guardianPhone: '',
        program: '',
        session: '2025-2026',
        previousSchool: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Student Data Submitted:", formData);
        alert("Student record created successfully!");
        navigate('/students');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* FIX: p-4 for mobile, p-8 for desktop */}
                <main className="p-4 md:p-8">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">New Admission</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span className="hidden sm:inline">Dashboard</span>
                                    <ChevronRight size={14} className="hidden sm:block" />
                                    <span>Students</span>
                                    <ChevronRight size={14} />
                                    <span className="text-[#EB8A33] font-medium">Add Student</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 self-end md:self-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Save size={18} /> Save Record
                            </button>
                        </div>
                    </div>

                    {/* FORM CONTAINER - Stacks on mobile (grid-cols-1) and 3 cols on Large screens */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN - Personal & Guardian Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Personal Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <User className="text-[#EB8A33]" size={20} />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="First Name" name="firstName" placeholder="e.g. Muhammad" value={formData.firstName} onChange={handleChange} />
                                    <InputField label="Last Name" name="lastName" placeholder="e.g. Ahmed" value={formData.lastName} onChange={handleChange} />

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>

                                    <InputField label="NIC / B-Form No" name="nic" placeholder="00000-0000000-0" value={formData.nic} onChange={handleChange} />
                                    <InputField label="Contact Number" name="phone" placeholder="+94 77 123 4567" icon={Phone} value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="mt-6">
                                    <InputField label="Residential Address" name="address" placeholder="Full Home Address" icon={MapPin} value={formData.address} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Guardian Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <UsersIcon className="text-[#EB8A33]" size={20} />
                                    Guardian Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Guardian Name" name="guardianName" placeholder="Parent/Guardian Name" value={formData.guardianName} onChange={handleChange} />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Relationship</label>
                                        <select
                                            name="guardianRelation"
                                            value={formData.guardianRelation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option>Father</option>
                                            <option>Mother</option>
                                            <option>Brother</option>
                                            <option>Uncle</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <InputField label="Guardian Phone" name="guardianPhone" placeholder="Emergency Contact" icon={Phone} value={formData.guardianPhone} onChange={handleChange} />
                                    <InputField label="Guardian Email (Optional)" name="email" placeholder="example@email.com" icon={Mail} value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - Academic & Uploads */}
                        <div className="space-y-6">

                            {/* Academic Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="text-[#EB8A33]" size={20} />
                                    Academic Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Admission Program</label>
                                        <select
                                            name="program"
                                            value={formData.program}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option value="">Select Course</option>
                                            <option>Hifzul Quran</option>
                                            <option>Al-Alim Course</option>
                                            <option>Al-Alimah (Girls)</option>
                                            <option>Secondary (Gr 8-10)</option>
                                            <option>G.C.E. O/L Prep</option>
                                            <option>G.C.E. A/L</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Session / Batch</label>
                                        <select
                                            name="session"
                                            value={formData.session}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option>2025 - 2026</option>
                                            <option>2024 - 2025</option>
                                        </select>
                                    </div>

                                    <InputField label="Previous School (Optional)" name="previousSchool" placeholder="School Name" value={formData.previousSchool} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Document Upload Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="text-[#EB8A33]" size={20} />
                                    Documents
                                </h3>
                                <div className="space-y-3">
                                    <UploadField label="Birth Certificate" />
                                    <UploadField label="ID Card / NIC / B-Form" />
                                    <UploadField label="School Leaving Cert" />
                                    <UploadField label="Medical Report" />
                                </div>
                            </div>

                        </div>
                    </form>

                </main>
            </div>
        </div>
    );
};

// Helper Components
const InputField = ({ label, name, placeholder, value, onChange, icon: Icon, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all placeholder:text-gray-400`}
            />
        </div>
    </div>
);

const UploadField = ({ label }) => (
    <div className="border border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#EB8A33]">
                    <UploadCloud size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-700">{label}</p>
                    <p className="text-[10px] text-gray-400">PDF or JPG (Max 2MB)</p>
                </div>
            </div>
            <span className="text-xs text-[#EB8A33] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
        </div>
    </div>
);

// Simple User Icon component for the helper above
const UsersIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default AddStudent;