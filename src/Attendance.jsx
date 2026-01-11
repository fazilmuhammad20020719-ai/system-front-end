import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';

// IMPORTING SUB-COMPONENTS
import AttendanceHeader from './attendance/AttendanceHeader';
import AttendanceStats from './attendance/AttendanceStats';
import AttendanceFooter from './attendance/AttendanceFooter';
import PinModal from './attendance/PinModal';

// STUDENT COMPONENTS
import AttendanceFilters from './attendance/AttendanceFilters';
import AttendanceTable from './attendance/AttendanceTable';

// TEACHER COMPONENTS (New)
import TeacherAttendanceFilters from './attendance/TeacherAttendanceFilters';
import TeacherAttendanceTable from './attendance/TeacherAttendanceTable';

import { TEACHERS_DATA } from './data/mockData';

const Attendance = () => {
    // Default: Open on PC (width >= 768), Closed on Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // -- MAIN TOGGLE STATE --
    const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'

    // -- COMMON STATE --
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    // ==========================================
    // STUDENT LOGIC
    // ==========================================
    const [filterProgram, setFilterProgram] = useState("All");
    const [filterYear, setFilterYear] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [students, setStudents] = useState([
        { id: 1, name: "fathimah", adminId: "2025/002", program: "Al-Alimah", year: "Grade 1", status: "", admissionDate: "2023-01-01" },
        { id: 2, name: "qdwaSAS", adminId: "2025/009", program: "Hifz Class", year: "Grade 1", status: "", admissionDate: "2022-05-15" },
        { id: 3, name: "agdf", adminId: "2025/009", program: "Qiraat Course", year: "Grade 1", status: "", admissionDate: "2023-02-20" },
        { id: 4, name: "fazil", adminId: "2025/01", program: "Al-Alim", year: "Grade 1", status: "", admissionDate: "2024-01-10" },
    ]);

    const statsStudents = useMemo(() => {
        return students.filter(student => {
            const matchesProgram = filterProgram === "All" || student.program === filterProgram;
            const matchesYear = filterYear === "All" || student.year === filterYear;
            return matchesProgram && matchesYear;
        });
    }, [students, filterProgram, filterYear]);

    const filteredStudents = useMemo(() => {
        return statsStudents.filter(student => {
            const matchesStatus = filterStatus === "All" || student.status === filterStatus;
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.adminId.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statsStudents, filterStatus, searchQuery]);

    const studentStats = useMemo(() => {
        const total = statsStudents.length;
        if (total === 0) return { present: 0, absent: 0, rate: 0 };
        const present = statsStudents.filter(s => s.status === "Present").length;
        const absent = statsStudents.filter(s => s.status === "Absent").length;
        const rate = Math.round((present / total) * 100);
        return { present, absent, rate };
    }, [statsStudents]);

    // ==========================================
    // TEACHER LOGIC
    // ==========================================
    const [teacherFilterProgram, setTeacherFilterProgram] = useState("All");
    const [teacherFilterStatus, setTeacherFilterStatus] = useState("All");
    const [teacherSearchQuery, setTeacherSearchQuery] = useState("");

    // Initialize with mock data + attendanceStatus field
    const [teachers, setTeachers] = useState(
        TEACHERS_DATA.map(t => ({ ...t, attendanceStatus: '' }))
    );

    const statsTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesProgram = teacherFilterProgram === "All" || teacher.program === teacherFilterProgram;
            return matchesProgram;
        });
    }, [teachers, teacherFilterProgram]);

    const filteredTeachers = useMemo(() => {
        return statsTeachers.filter(teacher => {
            const matchesStatus = teacherFilterStatus === "All" || teacher.attendanceStatus === teacherFilterStatus;
            const matchesSearch = teacher.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
                teacher.empid.toLowerCase().includes(teacherSearchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statsTeachers, teacherFilterStatus, teacherSearchQuery]);

    const teacherStats = useMemo(() => {
        const total = statsTeachers.length;
        if (total === 0) return { present: 0, absent: 0, rate: 0 };
        const present = statsTeachers.filter(t => t.attendanceStatus === "Present").length;
        const absent = statsTeachers.filter(t => t.attendanceStatus === "Absent").length;
        const rate = Math.round((present / total) * 100);
        return { present, absent, rate };
    }, [statsTeachers]);


    // ==========================================
    // SHARED HANDLERS
    // ==========================================

    const handleStudentStatusChange = (id, newStatus) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleTeacherStatusChange = (id, newStatus) => {
        setTeachers(prev => prev.map(t => t.id === id ? { ...t, attendanceStatus: newStatus } : t));
    };

    const handleBulkAction = (action) => {
        const statusMap = { 'all-present': 'Present', 'all-absent': 'Absent', 'all-holiday': 'Holiday' };
        const targetStatus = statusMap[action];

        if (activeTab === 'students') {
            const visibleIds = filteredStudents.map(s => s.id);
            setStudents(prev => prev.map(s => visibleIds.includes(s.id) ? { ...s, status: targetStatus } : s));
        } else {
            const visibleIds = filteredTeachers.map(t => t.id);
            setTeachers(prev => prev.map(t => visibleIds.includes(t.id) ? { ...t, attendanceStatus: targetStatus } : t));
        }
    };

    const handleSaveSuccess = () => {
        setIsPinModalOpen(false);
        if (activeTab === 'students') {
            console.log("Saving Student Attendance...");
        } else {
            console.log("Saving Teacher Attendance...");
        }
    };

    // Determine current stats to show
    const currentStats = activeTab === 'students' ? studentStats : teacherStats;
    const currentCount = activeTab === 'students' ? filteredStudents.length : filteredTeachers.length;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <AttendanceHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    selectedDate={selectedDate}
                />

                <main className="p-4 md:p-8 pb-32">

                    {/* --- TOGGLE TABS --- */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'students'
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                Students
                            </button>
                            <button
                                onClick={() => setActiveTab('teachers')}
                                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'teachers'
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                Teachers
                            </button>
                        </div>
                    </div>

                    {/* STATS (Reused for both) */}
                    <AttendanceStats
                        dailyRate={currentStats.rate}
                        averageRate={85} // You can make this dynamic too
                        presentCount={currentStats.present}
                        absentCount={currentStats.absent}
                    />

                    {/* CONDITIONAL RENDERING */}
                    {activeTab === 'students' ? (
                        <>
                            <AttendanceFilters
                                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                                filterProgram={filterProgram} setFilterProgram={setFilterProgram}
                                filterYear={filterYear} setFilterYear={setFilterYear}
                                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                onBulkAction={handleBulkAction}
                            />
                            <AttendanceTable
                                students={filteredStudents}
                                onStatusChange={handleStudentStatusChange}
                            />
                        </>
                    ) : (
                        <>
                            <TeacherAttendanceFilters
                                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                                filterProgram={teacherFilterProgram} setFilterProgram={setTeacherFilterProgram}
                                filterStatus={teacherFilterStatus} setFilterStatus={setTeacherFilterStatus}
                                searchQuery={teacherSearchQuery} setSearchQuery={setTeacherSearchQuery}
                                onBulkAction={handleBulkAction}
                            />
                            <TeacherAttendanceTable
                                teachers={filteredTeachers}
                                onStatusChange={handleTeacherStatusChange}
                            />
                        </>
                    )}

                </main>

                {/* FOOTER */}
                <AttendanceFooter
                    count={currentCount}
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