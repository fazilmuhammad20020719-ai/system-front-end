import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    Eye
} from 'lucide-react';
import Sidebar from './Sidebar';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Mock Data for Teachers
    const [teachers] = useState([
        {
            id: 1,
            name: "Dr. Sarah Wilson",
            empid: "EMP-001",
            dept: "Islamic Studies",
            role: "Head of Dept",
            email: "sarah@college.edu",
            phone: "+94 77 123 4567",
            status: "Active",
            joinDate: "12 Jan, 2020"
        },
        {
            id: 2,
            name: "Mr. Ahmed Kabeer",
            empid: "EMP-002",
            dept: "Arabic Language",
            role: "Senior Lecturer",
            email: "ahmed@college.edu",
            phone: "+94 77 987 6543",
            status: "Active",
            joinDate: "05 Mar, 2021"
        },
        {
            id: 3,
            name: "Ms. Fatima Rihana",
            empid: "EMP-003",
            dept: "English Unit",
            role: "Visiting Lecturer",
            email: "fatima@college.edu",
            phone: "+94 71 555 0123",
            status: "On Leave",
            joinDate: "20 Aug, 2022"
        },
        {
            id: 4,
            name: "Mr. Mohamed Naleem",
            empid: "EMP-004",
            dept: "Information Tech",
            role: "Instructor",
            email: "naleem@college.edu",
            phone: "+94 75 000 1111",
            status: "Active",
            joinDate: "10 Feb, 2023"
        },
    ]);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                {/* HEADER */}
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Teachers Management</h1>
                        <p className="text-sm text-gray-500">Manage all teaching staff</p>
                    </div>

                    <Link to="/add-teacher">
                        <button className="bg-[#EB8A33] hover:bg-[#d67b2b] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95">
                            <Plus size={20} />
                            Add Teacher
                        </button>
                    </Link>
                </header>

                {/* MAIN CONTENT */}
                <main className="p-8">

                    {/* SEARCH & FILTER TOOLBAR */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search teacher by name or ID..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] transition-all"
                            />
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>
                            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none cursor-pointer bg-white">
                                <option>All Departments</option>
                                <option>Islamic Studies</option>
                                <option>Arabic</option>
                                <option>English</option>
                                <option>IT</option>
                            </select>
                        </div>
                    </div>

                    {/* TEACHERS TABLE */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher Profile</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Department & Role</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-orange-50/30 transition-colors group">

                                        {/* Profile Column */}
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-[#EB8A33] border-2 border-white shadow-sm">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{teacher.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{teacher.empid}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Department Column */}
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <BookOpen size={14} className="text-[#EB8A33]" />
                                                    {teacher.dept}
                                                </div>
                                                <span className="text-xs text-gray-500 ml-5.5">{teacher.role}</span>
                                            </div>
                                        </td>

                                        {/* Contact Column */}
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail size={12} className="text-gray-400" />
                                                    {teacher.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {teacher.phone}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Column */}
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${teacher.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'}
                      `}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                {teacher.status}
                                            </span>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-all duration-200">
                                                <Link to={`/view-teacher/${teacher.id}`}>
                                                    <button className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors border border-transparent hover:border-gray-100" title="View Details">
                                                        <Eye size={16} />
                                                    </button>
                                                </Link>
                                                <Link to="/edit-teacher">
                                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Details">
                                                        <Pencil size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Teacher">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Teachers;