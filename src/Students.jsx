import { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Download,
    X,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Students = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');

    // Fixed Academic Years Options
    const academicYears = [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "5th Year",
        "6th Year",
        "7th Year"
    ];

    // Dummy Data (Includes 'year' for filtering)
    const [students] = useState([
        { id: '2025001', name: 'Muhammad Ahmed', program: 'Hifz ul Quran', year: '1st Year', guardian: 'Ali Ahmed', contact: '077 123 4567', status: 'Active' },
        { id: '2025002', name: 'Yusuf Khan', program: 'Qiraat Course', year: '2nd Year', guardian: 'Usman Khan', contact: '076 987 6543', status: 'Active' },
        { id: '2025003', name: 'Ibrahim Zaid', program: 'Arabic Language', year: '3rd Year', guardian: 'Zaid Moor', contact: '075 555 1234', status: 'Inactive' },
        { id: '2025004', name: 'Abdullah Omar', program: 'Hifz ul Quran', year: '1st Year', guardian: 'Omar Farooq', contact: '071 222 3333', status: 'Active' },
        { id: '2025005', name: 'Kareem Abdul', program: 'Islamic Theology (Alim)', year: '7th Year', guardian: 'Abdul Jabbar', contact: '077 999 8888', status: 'Active' },
        { id: '2025006', name: 'Fahad Mustafa', program: 'Qiraat Course', year: '4th Year', guardian: 'Mustafa Ali', contact: '077 111 2222', status: 'Active' },
    ]);

    // Unique Programs for Dropdown
    const programs = [...new Set(students.map(s => s.program))];

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm);
        // Exact match for the year string (e.g. "1st Year")
        const matchesYear = selectedYear ? student.year === selectedYear : true;
        const matchesProgram = selectedProgram ? student.program === selectedProgram : true;

        return matchesSearch && matchesYear && matchesProgram;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedProgram('');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <main className="p-8">
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
                                <h2 className="text-2xl font-bold text-gray-800">Students Directory</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage and view all registered students.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                                <Download size={16} /> Export
                            </button>
                            <button
                                onClick={() => navigate('/add-student')}
                                className="px-4 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Student
                            </button>
                        </div>
                    </div>

                    {/* FILTERS & SEARCH BAR */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">

                            {/* Search Input */}
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] transition-all"
                                />
                            </div>

                            {/* Dropdowns Container */}
                            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">

                                {/* Year Filter (1st to 7th Year) */}
                                <div className="relative min-w-[150px]">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                                    >
                                        <option value="">All Years</option>
                                        {academicYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>

                                {/* Program Filter */}
                                <div className="relative min-w-[180px]">
                                    <select
                                        value={selectedProgram}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                                    >
                                        <option value="">All Programs</option>
                                        {programs.map(prog => (
                                            <option key={prog} value={prog}>{prog}</option>
                                        ))}
                                    </select>
                                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>

                                {/* Clear Button */}
                                {(searchTerm || selectedYear || selectedProgram) && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Clear Filters"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* STUDENTS TABLE */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                        <th className="px-6 py-4">Student ID</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Program & Year</th>
                                        <th className="px-6 py-4">Guardian</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                    #{student.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EB8A33] flex items-center justify-center text-xs font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-800">{student.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">{student.program}</div>
                                                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 mt-1">
                                                        {student.year}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">{student.guardian}</div>
                                                    <div className="text-xs text-gray-400">{student.contact}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">

                                                        <button
                                                            onClick={() => navigate(`/view-student/${student.id}`)} // Update this line
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/edit-student/${student.id}`)}
                                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                            title="Edit Student"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No students found matching these filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Showing {filteredStudents.length} entries
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Students;