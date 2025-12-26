import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Filter,
    Mail,
    Phone,
    Pencil,
    Trash2,
    BookOpen,
    User,
    Eye,
    Menu,
    Download,
    X,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Users
} from 'lucide-react';
import Sidebar from './Sidebar';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // -- FILTERS STATE --
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // -- MOCK DATA --
    const [teachers] = useState([
        { id: 1, name: "Dr. Sarah Wilson", empid: "EMP-001", dept: "Islamic Studies", role: "Head of Dept", email: "sarah@college.edu", phone: "+94 77 123 4567", status: "Active" },
        { id: 2, name: "Mr. Ahmed Kabeer", empid: "EMP-002", dept: "Arabic Language", role: "Senior Lecturer", email: "ahmed@college.edu", phone: "+94 77 987 6543", status: "Active" },
        { id: 3, name: "Ms. Fatima Rihana", empid: "EMP-003", dept: "English Unit", role: "Visiting Lecturer", email: "fatima@college.edu", phone: "+94 71 555 0123", status: "On Leave" },
        { id: 4, name: "Mr. Mohamed Naleem", empid: "EMP-004", dept: "Information Tech", role: "Instructor", email: "naleem@college.edu", phone: "+94 75 000 1111", status: "Active" },
        { id: 5, name: "Sheikh Abdullah", empid: "EMP-005", dept: "Hifz", role: "Head of Hifz", email: "abdullah@college.edu", phone: "+94 77 222 3333", status: "Active" },
    ]);

    // -- DROPDOWN OPTIONS --
    const departments = ["Islamic Studies", "Arabic Language", "English Unit", "Information Tech", "Hifz"];

    // -- FILTER LOGIC --
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.empid.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || teacher.dept === selectedDept;
            const matchesStatus = selectedStatus === "All" || teacher.status === selectedStatus;

            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [teachers, searchTerm, selectedDept, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedDept("All");
        setSelectedStatus("All");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"><Menu size={20} /></button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Teachers Directory</h1>
                            <p className="text-sm text-gray-500">Manage academic staff and faculty</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
                            <Download size={16} /> Export CSV
                        </button>
                        <Link to="/add-teacher">
                            <button className="bg-[#EB8A33] hover:bg-[#d67b2b] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all">
                                <Plus size={18} /> Add Teacher
                            </button>
                        </Link>
                    </div>
                </header>

                <main className="p-8">

                    {/* STATS ROW (New Feature) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={Users} label="Total Teachers" value={teachers.length} color="bg-blue-50 text-blue-600" />
                        <StatCard icon={Briefcase} label="Active Staff" value={teachers.filter(t => t.status === 'Active').length} color="bg-green-50 text-green-600" />
                        <StatCard icon={User} label="On Leave" value={teachers.filter(t => t.status === 'On Leave').length} color="bg-orange-50 text-orange-600" />
                    </div>

                    {/* FILTERS TOOLBAR */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">

                            {/* Search */}
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by Name or Employee ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EB8A33] transition-all"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <div className="relative min-w-[160px]">
                                    <select
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                                    >
                                        <option value="All">All Departments</option>
                                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>

                                <div className="relative min-w-[140px]">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Resigned">Resigned</option>
                                    </select>
                                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>

                                {(searchTerm || selectedDept !== "All" || selectedStatus !== "All") && (
                                    <button onClick={clearFilters} className="px-3 py-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Clear Filters">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher Profile</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Department & Role</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact Info</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTeachers.length > 0 ? filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EB8A33] font-bold text-sm">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{teacher.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{teacher.empid}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-700">{teacher.dept}</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">{teacher.role}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 hidden md:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail size={12} className="text-gray-400" /> {teacher.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Phone size={12} className="text-gray-400" /> {teacher.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all">
                                                <button onClick={() => navigate(`/view-teacher/${teacher.id}`)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="View Profile">
                                                    <Eye size={18} />
                                                </button>
                                                <Link to={`/edit-teacher/${teacher.id}`}>
                                                    <button className="p-1.5 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-lg transition-colors" title="Edit">
                                                        <Pencil size={18} />
                                                    </button>
                                                </Link>
                                                <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">No teachers found matching filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 px-2">
                        <span className="text-xs text-gray-500">Showing {filteredTeachers.length} of {teachers.length} records</span>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
                            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

// Helper Component for Stats
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Teachers;