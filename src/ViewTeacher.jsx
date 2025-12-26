import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    BadgeCheck,
    DollarSign,
    FileText,
    ArrowLeft,
    Pencil,
    Printer,
    Download,
    CheckCircle,
    XCircle,
    Menu
} from 'lucide-react';
import Sidebar from './Sidebar';

const ViewTeacher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, professional, documents

    // Mock Data (In a real app, fetch this using the 'id')
    const teacher = {
        id: 1,
        firstName: "Sarah",
        lastName: "Wilson",
        fullName: "Dr. Sarah Wilson",
        email: "sarah@college.edu",
        phone: "+94 77 123 4567",
        address: "45, Marine Drive, Colombo 03",
        gender: "Female",
        dob: "1985-05-15",
        nic: "851350123V",
        image: null, // Placeholder for logic

        // Professional
        employeeId: "EMP-001",
        department: "Islamic Studies",
        designation: "Head of Department",
        qualification: "PhD in Islamic Theology",
        experience: "12 Years",
        joiningDate: "2015-01-12",
        status: "Active",

        // Financial (Confidential)
        salary: "125,000.00",

        // Documents
        documents: [
            { id: 1, name: "Curriculum Vitae.pdf", size: "2.4 MB", date: "2024-01-10" },
            { id: 2, name: "PhD Certificate.jpg", size: "1.1 MB", date: "2015-02-20" },
            { id: 3, name: "Appointment Letter.pdf", size: "500 KB", date: "2015-01-12" },
        ]
    };

    // Helper for Initials
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER & BREADCRUMB */}
                <header className="px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Teacher Profile</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                    Teachers <span className="mx-1">/</span> View <span className="mx-1">/</span> <span className="text-[#EB8A33]">{teacher.employeeId}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
                                <Printer size={16} /> Print
                            </button>
                            <Link to={`/edit-teacher/${id}`}>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#EB8A33] text-white rounded-lg text-sm font-bold hover:bg-[#d97c2a] shadow-sm transition-colors">
                                    <Pencil size={16} /> Edit
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8">

                    {/* TOP PROFILE CARD */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-[#EB8A33]">
                                {getInitials(teacher.fullName)}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-gray-800">{teacher.fullName}</h2>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${teacher.status === 'Active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {teacher.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        {teacher.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium mb-4">{teacher.designation} &bull; {teacher.department}</p>

                                <div className="flex flex-wrap gap-4 md:gap-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Briefcase size={16} className="text-[#EB8A33]" />
                                        <span>{teacher.employeeId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={16} className="text-[#EB8A33]" />
                                        <span>{teacher.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={16} className="text-[#EB8A33]" />
                                        <span>{teacher.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Personal & Contact */}
                        <div className="space-y-6">

                            {/* Personal Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <User size={18} className="text-gray-400" /> Personal Details
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <InfoRow label="Date of Birth" value={teacher.dob} icon={Calendar} />
                                    <InfoRow label="Gender" value={teacher.gender} icon={User} />
                                    <InfoRow label="NIC Number" value={teacher.nic} icon={BadgeCheck} />
                                    <InfoRow label="Address" value={teacher.address} icon={MapPin} />
                                </div>
                            </div>

                            {/* Salary (Confidential) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <DollarSign size={18} className="text-gray-400" /> Financial Info
                                    </h3>
                                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">CONFIDENTIAL</span>
                                </div>
                                <div className="p-6">
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Basic Salary</p>
                                    <p className="text-xl font-bold text-gray-800 font-mono">LKR {teacher.salary}</p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Professional & Docs */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Professional Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <GraduationCap size={18} className="text-gray-400" /> Professional Background
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <InfoRow label="Department" value={teacher.department} />
                                    <InfoRow label="Designation" value={teacher.designation} />
                                    <InfoRow label="Qualification" value={teacher.qualification} />
                                    <InfoRow label="Total Experience" value={teacher.experience} />
                                    <InfoRow label="Joining Date" value={teacher.joiningDate} />
                                    <InfoRow label="Status" value={teacher.status} />
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <FileText size={18} className="text-gray-400" /> Documents
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {teacher.documents.map((doc) => (
                                        <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-[#EB8A33] hover:bg-orange-50 rounded-lg transition-colors">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

// Helper Component for consistent rows
const InfoRow = ({ label, value, icon: Icon }) => (
    <div>
        <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon size={12} className="text-gray-400" />}
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">{label}</p>
        </div>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
);

export default ViewTeacher;