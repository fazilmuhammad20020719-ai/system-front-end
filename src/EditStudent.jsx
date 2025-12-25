import { useState, useEffect } from 'react';
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
    ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

const EditStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Get Student ID from URL

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        program: '',
        year: '',
        session: '',
        previousSchool: ''
    });

    // Simulate Fetching Data based on ID
    useEffect(() => {
        // In a real app, you would fetch from API: axios.get(`/api/students/${id}`)
        // Here we simulate it with dummy data
        const dummyData = {
            firstName: 'Muhammad',
            lastName: 'Ahmed',
            dob: '2015-05-15',
            gender: 'Male',
            nic: '201512345678',
            email: 'student@example.com',
            phone: '077 123 4567',
            address: '123, Main Street, Colombo',
            guardianName: 'Ali Ahmed',
            guardianRelation: 'Father',
            guardianPhone: '077 987 6543',
            program: 'Hifz ul Quran',
            year: '1st Year',
            session: '2025-2026',
            previousSchool: 'City High School'
        };

        setFormData(dummyData);
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Data:", formData);
        alert("Student record updated successfully!");
        navigate('/students');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                <main className="p-8">
                    {/* PAGE HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Edit Student</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="cursor-pointer hover:text-[#EB8A33]" onClick={() => navigate('/dashboard')}>Dashboard</span>
                                <ChevronRight size={14} />
                                <span className="cursor-pointer hover:text-[#EB8A33]" onClick={() => navigate('/students')}>Students</span>
                                <ChevronRight size={14} />
                                <span className="text-[#EB8A33] font-medium">Edit #{id}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Save size={18} /> Update Record
                            </button>
                        </div>
                    </div>

                    {/* FORM CONTAINER */}
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
                                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />

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

                                    <InputField label="NIC / B-Form No" name="nic" value={formData.nic} onChange={handleChange} />
                                    <InputField label="Contact Number" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="mt-6">
                                    <InputField label="Residential Address" name="address" icon={MapPin} value={formData.address} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Guardian Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <UsersIcon className="text-[#EB8A33]" size={20} />
                                    Guardian Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
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
                                    <InputField label="Guardian Phone" name="guardianPhone" icon={Phone} value={formData.guardianPhone} onChange={handleChange} />
                                    <InputField label="Guardian Email" name="email" icon={Mail} value={formData.email} onChange={handleChange} />
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
                                            <option>Hifz ul Quran</option>
                                            <option>Qiraat Course</option>
                                            <option>Arabic Language</option>
                                            <option>Islamic Theology (Alim)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Year / Level</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option>1st Year</option>
                                            <option>2nd Year</option>
                                            <option>3rd Year</option>
                                            <option>4th Year</option>
                                            <option>5th Year</option>
                                            <option>6th Year</option>
                                            <option>7th Year</option>
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

                                    <InputField label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Document Upload Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="text-[#EB8A33]" size={20} />
                                    Existing Documents
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Birth_Certificate.pdf</span>
                                        </div>
                                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">ID_Card.jpg</span>
                                        </div>
                                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Upload New Documents</p>
                                        <UploadField label="Upload Additional File" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>

                </main>
            </div>
        </div>
    );
};

// Helper Components (Same as AddStudent)
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

const UsersIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default EditStudent;