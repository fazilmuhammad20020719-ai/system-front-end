import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';

// IMPORTING SUB-COMPONENTS
import AttendanceHeader from './attendance/AttendanceHeader';
import AttendanceStats from './attendance/AttendanceStats';
import AttendanceFilters from './attendance/AttendanceFilters';
import AttendanceTable from './attendance/AttendanceTable';
import AttendanceFooter from './attendance/AttendanceFooter';
import PinModal from './attendance/PinModal';

const Attendance = () => {
    // Default: Open on PC (width >= 768), Closed on Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // -- STATE MANAGEMENT --
    const [selectedDate, setSelectedDate] = useState("2025-12-26");
    const [filterProgram, setFilterProgram] = useState("All");
    const [filterYear, setFilterYear] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    // -- MOCK DATA --
    const [students, setStudents] = useState([
        { id: 1, name: "fathimah", adminId: "2025/002", program: "Al-Alimah", year: "1st Year", status: "", admissionDate: "2023-01-01" },
        { id: 2, name: "qdwaSAS", adminId: "2025/009", program: "Hifz Class", year: "1st Year", status: "", admissionDate: "2022-05-15" },
        { id: 3, name: "agdf", adminId: "2025/009", program: "Qiraat Course", year: "1st Year", status: "", admissionDate: "2023-02-20" },
        { id: 4, name: "fazil", adminId: "2025/01", program: "Al-Alim", year: "1st Year", status: "", admissionDate: "2024-01-10" },
    ]);

    // -- 1. STATS DATA (Ignores Search & Status Filter) --
    // This ensures stats don't change just because you searched for a name
    const statsStudents = useMemo(() => {
        return students.filter(student => {
            const matchesProgram = filterProgram === "All" || student.program === filterProgram;
            const matchesYear = filterYear === "All" || student.year === filterYear;
            return matchesProgram && matchesYear;
        });
    }, [students, filterProgram, filterYear]);

    // -- 2. TABLE DATA (Applies All Filters) --
    const filteredStudents = useMemo(() => {
        return statsStudents.filter(student => {
            const matchesStatus = filterStatus === "All" || student.status === filterStatus;
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.adminId.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statsStudents, filterStatus, searchQuery]);

    // -- STATISTICS CALCULATION (Uses statsStudents) --
    const stats = useMemo(() => {
        const total = statsStudents.length;
        if (total === 0) return { present: 0, absent: 0, rate: 0 };

        const present = statsStudents.filter(s => s.status === "Present").length;
        const absent = statsStudents.filter(s => s.status === "Absent").length;
        const rate = Math.round((present / total) * 100);

        return { present, absent, rate };
    }, [statsStudents]); // Depends on the wider list, not the filtered list

    const averageRate = 85; // Placeholder

    // -- HANDLERS --
    const handleStatusChange = (id, newStatus) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleBulkAction = (action) => {
        const statusMap = { 'all-present': 'Present', 'all-absent': 'Absent', 'all-holiday': 'Holiday' };
        const targetStatus = statusMap[action];

        // We apply bulk action only to currently VISIBLE students (filteredStudents)
        // This is correct behavior (e.g. if I search "Ali" and click "All Present", only Ali becomes present)
        const visibleIds = filteredStudents.map(s => s.id);

        setStudents(prev => prev.map(s => visibleIds.includes(s.id) ? { ...s, status: targetStatus } : s));
    };

    const handleSaveSuccess = () => {
        setIsPinModalOpen(false);
        // Save logic here
    };

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <AttendanceHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    selectedDate={selectedDate}
                />

                <main className="p-4 md:p-8 pb-24">

                    {/* STATS */}
                    <AttendanceStats
                        dailyRate={stats.rate}
                        averageRate={averageRate}
                        presentCount={stats.present}
                        absentCount={stats.absent}
                    />

                    {/* FILTERS & BULK ACTIONS */}
                    <AttendanceFilters
                        selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                        filterProgram={filterProgram} setFilterProgram={setFilterProgram}
                        filterYear={filterYear} setFilterYear={setFilterYear}
                        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        onBulkAction={handleBulkAction}
                    />

                    {/* TABLE */}
                    <AttendanceTable
                        students={filteredStudents}
                        onStatusChange={handleStatusChange}
                    />

                </main>

                {/* FOOTER */}
                <AttendanceFooter
                    count={filteredStudents.length} // Footer count shows VISIBLE rows (correct)
                    onSaveClick={() => setIsPinModalOpen(true)}
                    isSidebarOpen={isSidebarOpen}
                />

            </div>

            {/* PIN MODAL */}
            <PinModal
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default Attendance;