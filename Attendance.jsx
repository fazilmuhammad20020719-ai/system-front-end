import { useState, useEffect, useMemo } from 'react';
import {
    Umbrella,
    Check,
    Menu,
    Lock,
    X,
    RotateCcw
} from 'lucide-react';
import Sidebar from './Sidebar';

const Attendance = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // -- STATE MANAGEMENT --
    const [selectedDate, setSelectedDate] = useState("2025-12-26");
    const [filterProgram, setFilterProgram] = useState("All");
    const [filterYear, setFilterYear] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [pin, setPin] = useState(["", "", "", ""]);
    const [pinError, setPinError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // -- MOCK DATA --
    const [students, setStudents] = useState([
        { id: 1, name: "fathimah", adminId: "2025/002", program: "Al-Alimah", year: "1st Year", status: "Present", admissionDate: "2023-01-01" },
        { id: 2, name: "qdwaSAS", adminId: "2025/009", program: "Hifz Class", year: "1st Year", status: "Present", admissionDate: "2022-05-15" },
        { id: 3, name: "agdf", adminId: "2025/009", program: "Qiraat Course", year: "1st Year", status: "Present", admissionDate: "2023-02-20" },
        { id: 4, name: "fazil", adminId: "2025/01", program: "Al-Alim", year: "1st Year", status: "Present", admissionDate: "2024-01-10" },
    ]);

    // -- FILTER LOGIC --
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            // Strict equality used for programs to separate Al-Alim from Al-Alimah
            const matchesProgram = filterProgram === "All" || student.program === filterProgram;
            const matchesYear = filterYear === "All" || student.year === filterYear;
            const matchesStatus = filterStatus === "All" || student.status === filterStatus;
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.adminId.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesProgram && matchesYear && matchesStatus && matchesSearch;
        });
    }, [students, filterProgram, filterYear, filterStatus, searchQuery]);

    // -- STATISTICS --
    const dailyRate = useMemo(() => {
        if (filteredStudents.length === 0) return 0;
        const presentCount = filteredStudents.filter(s => s.status === "Present").length;
        return Math.round((presentCount / filteredStudents.length) * 100);
    }, [filteredStudents]);

    const averageRate = 0; // Placeholder

    // -- HANDLERS --
    const handleStatusChange = (id, newStatus) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleBulkAction = (action) => {
        const statusMap = { 'all-present': 'Present', 'all-absent': 'Absent', 'all-holiday': 'Holiday' };
        const targetStatus = statusMap[action];
        const visibleIds = filteredStudents.map(s => s.id);
        setStudents(prev => prev.map(s => visibleIds.includes(s.id) ? { ...s, status: targetStatus } : s));
    };

    const handlePinChange = (index, value) => {
        if (isNaN(value)) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        if (value && index < 3) document.getElementById(`pin-${index + 1}`).focus();
    };

    const verifyPin = () => {
        const enteredPin = pin.join('');
        if (enteredPin === "1234") {
            setSuccessMsg("Attendance Saved!");
            setIsPinModalOpen(false);
            setPin(["", "", "", ""]);
            setTimeout(() => setSuccessMsg(""), 3000);
        } else {
            setPinError("Invalid PIN");
        }
    };

    // Helper for Initials
    const getInitials = (name) => name ? name.charAt(0).toLowerCase() : "-";

    // Format Date for Header
    const formattedHeaderDate = new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* --- HEADER --- */}
                <header className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Attendance Registry</h1>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-gray-700 font-medium">{formattedHeaderDate}</span>
                    </div>
                </header>

                <main className="px-8 pb-24">

                    {/* --- STATS CARDS --- */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Card 1 */}
                        <div className="bg-white rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Date Attendance</h3>
                                <p className="text-xs text-gray-300 font-medium mt-1">On Selected Date</p>
                            </div>
                            <div className="text-3xl font-bold text-[#10b981]">{dailyRate}%</div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Average</h3>
                                <p className="text-xs text-gray-300 font-medium mt-1">Till Date (Filtered)</p>
                            </div>
                            <div className="text-3xl font-bold text-[#6366f1]">{averageRate}%</div>
                        </div>
                    </div>

                    {/* --- FILTERS & ACTIONS CONTAINER --- */}
                    <div className="bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-5 mb-6">

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-end gap-3 mb-6">
                            {/* Date */}
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Program */}
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Program</label>
                                <select
                                    value={filterProgram}
                                    onChange={(e) => setFilterProgram(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                                >
                                    <option value="All">All Programs</option>
                                    <option value="Hifz Class">Hifz Class</option>
                                    <option value="Al-Alim">Al-Alim</option>
                                    <option value="Al-Alimah">Al-Alimah</option>
                                    <option value="Qiraat Course">Qiraat Course</option>
                                    <option value="Arabic Language">Arabic Language</option>
                                </select>
                            </div>

                            {/* Year */}
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Year</label>
                                <select
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                                >
                                    <option value="All">All Years</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="5th Year">5th Year</option>
                                    <option value="6th Year">6th Year</option>
                                    <option value="7th Year">7th Year</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Holiday">Holiday</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="flex-1 min-w-[180px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Student Search</label>
                                <input
                                    type="text"
                                    placeholder="Name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 placeholder-gray-400"
                                />
                            </div>

                            {/* Load Button */}
                            <div>
                                <button className="bg-[#1f2937] hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors h-[38px]">
                                    <RotateCcw size={14} /> Load Data
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 mb-4"></div>

                        {/* Bulk Actions */}
                        <div className="flex gap-3">
                            <button onClick={() => handleBulkAction('all-present')} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                <Check size={14} className="text-gray-400" /> All Present
                            </button>
                            <button onClick={() => handleBulkAction('all-absent')} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                <X size={14} className="text-gray-400" /> All Absent
                            </button>
                            <button onClick={() => handleBulkAction('all-holiday')} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                <Umbrella size={14} className="text-gray-400" /> All Holiday
                            </button>
                        </div>

                    </div>

                    {/* --- STUDENT LIST TABLE --- */}
                    <div className="bg-white rounded-t-lg shadow-sm border border-gray-200/60 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 bg-[#f8fafc] p-4 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-5 pl-2">Student</div>
                            <div className="col-span-4">Class Info</div>
                            <div className="col-span-3 text-left">Status</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                <div key={student.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50 transition-colors group">

                                    {/* Student Column */}
                                    <div className="col-span-5 flex items-center gap-3 pl-2">
                                        <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-sm lowercase pb-0.5">
                                            {getInitials(student.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 leading-tight">{student.name}</p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{student.adminId}</p>
                                        </div>
                                    </div>

                                    {/* Class Info Column */}
                                    <div className="col-span-4">
                                        <span className="inline-block bg-[#f3f4f6] text-gray-500 text-[11px] px-2.5 py-1 rounded font-medium border border-gray-200">
                                            {student.program} {student.year}
                                        </span>
                                    </div>

                                    {/* Status Column */}
                                    <div className="col-span-3 flex items-center gap-2">

                                        {/* Present Toggle */}
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Present')}
                                            className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Present'
                                                ? 'bg-green-100 border-green-500 text-green-600'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-green-300'
                                                }`}
                                        >
                                            <span className="font-bold text-xs">P</span>
                                        </button>

                                        {/* Absent Toggle */}
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Absent')}
                                            className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Absent'
                                                ? 'bg-red-100 border-red-500 text-red-600'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-red-300'
                                                }`}
                                        >
                                            <span className="font-bold text-xs">A</span>
                                        </button>

                                        {/* Holiday Toggle */}
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Holiday')}
                                            className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Holiday'
                                                ? 'bg-blue-100 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'
                                                }`}
                                        >
                                            <Umbrella size={14} strokeWidth={2.5} />
                                        </button>

                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-400 text-sm">No records found.</div>
                            )}
                        </div>
                    </div>
                </main>

                {/* --- FOOTER --- */}
                <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-10">
                    <div className="text-sm font-semibold text-gray-500">
                        Records: <span className="text-gray-800">{filteredStudents.length}</span>
                    </div>
                    <button
                        onClick={() => setIsPinModalOpen(true)}
                        className="bg-[#ea8933] hover:bg-[#d97c2a] text-white px-5 py-2.5 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Lock size={16} />
                        Save Attendance
                    </button>
                </div>

            </div>

            {/* --- PIN MODAL --- */}
            {isPinModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-orange-100 text-[#ea8933] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Verify Identity</h3>
                            <p className="text-xs text-gray-500 mb-6">Enter admin PIN to save changes</p>

                            <div className="flex justify-center gap-3 mb-6">
                                {pin.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`pin-${i}`}
                                        type="password"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handlePinChange(i, e.target.value)}
                                        className="w-10 h-10 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#ea8933] focus:ring-0 outline-none transition-all"
                                    />
                                ))}
                            </div>

                            {pinError && <p className="text-red-500 text-xs font-bold mb-4">{pinError}</p>}

                            <div className="flex gap-2">
                                <button onClick={() => setIsPinModalOpen(false)} className="flex-1 py-2 text-gray-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Cancel</button>
                                <button onClick={verifyPin} className="flex-1 py-2 bg-[#ea8933] text-white font-bold text-sm rounded-lg hover:bg-[#d97c2a]">Verify</button>
                            </div>
                        </div>
                        {successMsg && <div className="bg-green-500 text-white text-center py-2 text-xs font-bold">{successMsg}</div>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Attendance;