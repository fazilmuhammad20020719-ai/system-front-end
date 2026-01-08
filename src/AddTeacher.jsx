import { useState } from 'react';
import {
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Briefcase,
    GraduationCap,
    FileText,
    UploadCloud,
    Save,
    X,
    ChevronRight,
    DollarSign,
    BadgeCheck,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AddTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        dob: '',
        gender: 'Male',
        address: '',
        employeeId: '',
        department: '',
        designation: 'Lecturer',
        qualification: '',
        experience: '',
        joiningDate: '',
        salary: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Teacher Data Submitted:", formData);
        alert("Teacher record created successfully!");
        navigate('/teachers');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <main className="p-4 md:p-8">
                    {/* PAGE HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Add New Teacher</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span className="hidden sm:inline">Dashboard</span>
                                    <ChevronRight size={14} className="hidden sm:block" />
                                    <span>Teachers</span>
                                    <ChevronRight size={14} />
                                    <span className="text-[#EB8A33] font-medium">Add Teacher</span>
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

                    {/* FORM CONTAINER */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN - Personal Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Personal Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <User className="text-[#EB8A33]" size={20} />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="First Name" name="firstName" placeholder="e.g. Sarah" value={formData.firstName} onChange={handleChange} />
                                    <InputField label="Last Name" name="lastName" placeholder="e.g. Wilson" value={formData.lastName} onChange={handleChange} />

                                    <InputField label="Email Address" name="email" type="email" placeholder="sarah@college.edu" icon={Mail} value={formData.email} onChange={handleChange} />
                                    <InputField label="Phone Number" name="phone" placeholder="+94 77 123 4567" icon={Phone} value={formData.phone} onChange={handleChange} />

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

                                    <InputField label="NIC Number" name="nic" placeholder="Identity Number" value={formData.nic} onChange={handleChange} />
                                </div>
                                <div className="mt-6">
                                    <InputField label="Residential Address" name="address" placeholder="Full Home Address" icon={MapPin} value={formData.address} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Professional Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Briefcase className="text-[#EB8A33]" size={20} />
                                    Professional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Employee ID" name="employeeId" placeholder="EMP-001" icon={BadgeCheck} value={formData.employeeId} onChange={handleChange} />

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option value="">Select Department</option>
                                            <option>Islamic Studies</option>
                                            <option>Arabic Language</option>
                                            <option>English Unit</option>
                                            <option>Information Tech</option>
                                            <option>Science</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Designation / Role</label>
                                        <select
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                        >
                                            <option>Lecturer</option>
                                            <option>Senior Lecturer</option>
                                            <option>Head of Dept</option>
                                            <option>Instructor</option>
                                            <option>Visiting Lecturer</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Joining Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                name="joiningDate"
                                                value={formData.joiningDate}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <InputField label="Qualification" name="qualification" placeholder="e.g. PhD, MA" icon={GraduationCap} value={formData.qualification} onChange={handleChange} />
                                    <InputField label="Experience (Years)" name="experience" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleChange} />

                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - Salary & Uploads */}
                        <div className="space-y-6">

                            {/* Salary Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <DollarSign className="text-[#EB8A33]" size={20} />
                                    Financial Info
                                </h3>
                                <div className="space-y-4">
                                    <InputField label="Basic Salary" name="salary" placeholder="0.00" value={formData.salary} onChange={handleChange} />
                                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-700">
                                        <strong>Note:</strong> Salary information is confidential and only visible to authorized admins.
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="text-[#EB8A33]" size={20} />
                                    Documents
                                </h3>
                                <div className="space-y-3">
                                    <UploadField label="Curriculum Vitae (CV)" />
                                    <UploadField label="Educational Certificates" />
                                    <UploadField label="National ID Copy" />
                                    <UploadField label="Appointment Letter" />
                                </div>
                            </div>

                        </div>
                    </form>

                </main>
            </div>
        </div>
    );
};

// Reuse Helper Components
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
                    <p className="text-[10px] text-gray-400">PDF or JPG (Max 5MB)</p>
                </div>
            </div>
            <span className="text-xs text-[#EB8A33] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
        </div>
    </div>
);

export default AddTeacher;