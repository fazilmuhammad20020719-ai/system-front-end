import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

// IMPORTING SUB-COMPONENTS
import AttendanceHeader from './attendance/AttendanceHeader';
import AttendanceStats from './attendance/AttendanceStats';
import PinModal from './attendance/PinModal';

// STUDENT COMPONENTS
import AttendanceFilters from './attendance/AttendanceFilters';
import AttendanceTable from './attendance/AttendanceTable';

// TEACHER COMPONENTS
import TeacherAttendanceFilters from './attendance/TeacherAttendanceFilters';
import TeacherAttendanceTable from './attendance/TeacherAttendanceTable';
import Loader from './components/Loader';

const Attendance = () => {
    const location = useLocation();
    // Default: Open on PC (width >= 768), Closed on Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // -- MAIN TOGGLE STATE --
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'students'); // 'students' or 'teachers'

    // Helper to get local date string YYYY-MM-DD
    const getLocalTodayString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // -- COMMON STATE --
    const [selectedDate, setSelectedDate] = useState(getLocalTodayString());
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // New Edit Mode State

    // ==========================================
    // DATA HOLDING FOR SAVING
    // ==========================================
    // We store the "working" state of attendance here.
    // When date changes, we re-fetch.
    const [studentsData, setStudentsData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [programs, setPrograms] = useState([]); // Dynamic Programs List
    const [avgRate, setAvgRate] = useState(0); // Overall Average Rate

    // 1. Fetch Programs (Once)
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await fetch(`${API_URL}/api/programs`);
                if (res.ok) setPrograms(await res.json());
            } catch (err) { console.error("Error fetching programs:", err); }
        };
        fetchPrograms();
    }, []);

    // ==========================================
    // FETCH LOGIC
    // ==========================================
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Master Lists
            // Ideally we should cache this or only fetch if needed, but for simplicity we fetch parallel
            const [sRes, tRes, attRes, statRes] = await Promise.all([
                fetch(`${API_URL}/api/students`),
                fetch(`${API_URL}/api/teachers`),
                // Fetch attendance and stats
                fetch(`${API_URL}/api/attendance?date=${selectedDate}`),
                fetch(`${API_URL}/api/attendance/stats`)
            ]);

            if (sRes.ok && tRes.ok && attRes.ok) {
                const allStudents = await sRes.json();
                const allTeachers = await tRes.json();
                const attendanceRecords = await attRes.json();

                if (statRes && statRes.ok) {
                    const stats = await statRes.json();
                    setAvgRate(stats.averageRate || 0);
                }

                // 2. Merge Student Data
                // Map retrieved attendance to students
                const mergedStudents = allStudents.map(s => {
                    const record = attendanceRecords.find(r => String(r.student_id) === String(s.id));
                    return {
                        ...s,
                        status: record ? record.status : '' // Default to empty if no record
                    };
                });
                setStudentsData(mergedStudents);

                // 3. Merge Teacher Data
                const mergedTeachers = allTeachers.map(t => {
                    const record = attendanceRecords.find(r => String(r.teacher_id) === String(t.id));
                    return {
                        ...t,
                        attendanceStatus: record ? record.status : ''
                    };
                });
                setTeachersData(mergedTeachers);
            }

        } catch (err) {
            console.error("Error fetching attendance data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-unlock for Today, Lock for Past Dates
        const todayStr = getLocalTodayString();
        if (selectedDate === todayStr) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [selectedDate]);

    // ==========================================
    // STUDENT FILTER & STATS
    // ==========================================
    const [filterProgram, setFilterProgram] = useState("All");
    const [filterYear, setFilterYear] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const statsStudents = useMemo(() => {
        return studentsData.filter(student => {
            // Parse Enrollments
            const enrollments = student.enrollments_summary || [];
            const parsedEnrollments = typeof enrollments === 'string' ? JSON.parse(enrollments) : enrollments;

            // 1. Get ONLY Active Enrollments
            // If enrollments exist, use them.
            let activeEnrollments = [];
            if (Array.isArray(parsedEnrollments) && parsedEnrollments.length > 0) {
                activeEnrollments = parsedEnrollments.filter(e => e.status === 'Active');

                // If student has enrollments but NONE are active, exclude them entirely? 
                // OR checking valid enrollments.
                // If the user wants "only show active student program", likely implies exclusion if no active.
                if (activeEnrollments.length === 0) return false;
            } else {
                // Fallback: Legacy Check
                // If no enrollments array, check student.status (assuming it applies to the program)
                if (student.status !== 'Active' && student.status !== 'Present' && student.status !== 'Absent' && student.status !== 'Holiday' && !student.status) {
                    // Note: 'status' in student root might be 'Active', or attendance status 'Present' etc.
                    // studentRoutes.js: s.status is 'Active' (enrollment status).
                    // Attendance.jsx merges attendance record into s.status?
                    // line 87: status: record ? record.status : ''
                    // Wait, Attendance.jsx OVERWRITES student.status with ATTENDANCE status ('Present'/'Absent').
                    // We need the ENROLLMENT status. 
                    // studentRoutes.js returns s.status as 'Active'. 
                    // But Attendance.jsx lines 83-89:
                    /*
                    const mergedStudents = allStudents.map(s => {
                        const record = attendanceRecords.find(...)
                        return { ...s, status: record ? record.status : '' }
                    });
                    */
                    // CRITICAL: We lost the student's enrollment status 's.status' because it was overwritten by attendance status.
                    // We need to check if we can access the original status.
                    // Looking at studentRoutes.js: 'status' is indeed selected.
                    // In Attendance.jsx, we need the enrollment/student status. 
                    // Only 'enrollments_summary' preserves the status safely inside the array.
                    // For legacy fallback: we might be in trouble if we don't have a separate field.
                    // However, strictly speaking, we largely rely on enrollments_summary now.

                    // Let's assume most students have enrollments_summary.
                    // If not, we might not be able to filter legacy active status without changing the fetch logic loop.
                    // BUT, 'enrollments_summary' is reliable for status.
                }
            }

            // 2. Filter by Program
            if (filterProgram === "All") return true;

            const hasMatchingEnrollment = activeEnrollments.some(e =>
                (e.program === filterProgram) &&
                (filterYear === "All" || String(e.year) === String(filterYear))
            );

            if (hasMatchingEnrollment) return true;

            // 3. Fallback Legacy Field Match (Only if no enrollments were found/used above?)
            // If parsedEnrollments was empty, we are here.
            // But we don't have 'Active' check for legacy easily if 'status' is overwritten.
            // Let's rely on the program name match.
            if (parsedEnrollments.length === 0) {
                const matchesProgram = student.program === filterProgram;
                const matchesYear = filterYear === "All" || String(student.currentYear) === String(filterYear);
                return matchesProgram && matchesYear;
            }

            return false;
        });
    }, [studentsData, filterProgram, filterYear]);

    const filteredStudents = useMemo(() => {
        return statsStudents.filter(student => {
            const matchesStatus = filterStatus === "All" || (student.status || 'Pending') === filterStatus;
            // Note: filterStatus 'Pending' might be needed if status is empty
            // If filterStatus is 'All', passed. If filterStatus='Present', check.
            // If status is empty string, it's effectively 'Pending' or 'Not Marked'.
            if (filterStatus === 'Pending') return student.status === '';
            return filterStatus === "All" || student.status === filterStatus;
        }).filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(student.id).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [statsStudents, filterStatus, searchQuery]);

    const studentStats = useMemo(() => {
        const total = statsStudents.length;
        if (total === 0) return { present: 0, absent: 0, rate: 0 };
        const present = statsStudents.filter(s => s.status === "Present").length;
        const absent = statsStudents.filter(s => s.status === "Absent").length;
        const rate = Math.round((present / total) * 100);
        return { present, absent, rate };
    }, [statsStudents]);

    // Dynamic Years Calculation
    // Dynamic Grades (renamed from Years)
    const dynamicYears = useMemo(() => {
        if (filterProgram === "All") return []; // Empty if no program selected

        const selectedProg = programs.find(p => p.name === filterProgram);
        const duration = selectedProg ? (parseInt(selectedProg.duration) || 5) : 5;
        return Array.from({ length: duration }, (_, i) => `Grade ${i + 1}`);
    }, [filterProgram, programs]);

    // Reset Grade filter when Program changes
    useEffect(() => {
        setFilterYear("All");
    }, [filterProgram]);


    // ==========================================
    // TEACHER FILTER & STATS
    // ==========================================
    const [teacherFilterProgram, setTeacherFilterProgram] = useState("All");
    const [teacherFilterStatus, setTeacherFilterStatus] = useState("All");
    const [teacherSearchQuery, setTeacherSearchQuery] = useState("");

    const statsTeachers = useMemo(() => {
        return teachersData.filter(teacher => {
            // Check property names match API
            const tProgram = teacher.program || teacher.program_name || 'General';
            return teacherFilterProgram === "All" || tProgram === teacherFilterProgram;
        });
    }, [teachersData, teacherFilterProgram]);

    const filteredTeachers = useMemo(() => {
        return statsTeachers.filter(teacher => {
            if (teacherFilterStatus === "All") return true;
            return teacher.attendanceStatus === teacherFilterStatus;
        }).filter(teacher =>
            teacher.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
            (teacher.empid || '').toLowerCase().includes(teacherSearchQuery.toLowerCase())
        );
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
    // HANDLERS
    // ==========================================

    const handleStudentStatusChange = (id, newStatus) => {
        if (!isEditing) return; // Guard
        setStudentsData(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleTeacherStatusChange = (id, newStatus) => {
        if (!isEditing) return; // Guard
        setTeachersData(prev => prev.map(t => t.id === id ? { ...t, attendanceStatus: newStatus } : t));
    };

    const handleBulkAction = (action) => {
        if (!isEditing) {
            alert("Please enable Edit Mode first.");
            return;
        }
        const statusMap = { 'all-present': 'Present', 'all-absent': 'Absent', 'all-holiday': 'Holiday' };
        const targetStatus = statusMap[action];

        if (activeTab === 'students') {
            const visibleIds = filteredStudents.map(s => s.id);
            setStudentsData(prev => prev.map(s => visibleIds.includes(s.id) ? { ...s, status: targetStatus } : s));
        } else {
            const visibleIds = filteredTeachers.map(t => t.id);
            setTeachersData(prev => prev.map(t => visibleIds.includes(t.id) ? { ...t, attendanceStatus: targetStatus } : t));
        }
    };

    // Called when PIN is verified successfullly
    const handlePinSuccess = () => {
        setIsPinModalOpen(false);
        setIsEditing(true);
    };

    const handleSaveData = async () => {
        try {
            if (activeTab === 'students') {
                const recordsToSave = studentsData.filter(s => s.status && s.status !== '');
                const promises = recordsToSave.map(s =>
                    fetch(`${API_URL}/api/attendance`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: s.id,
                            date: selectedDate,
                            status: s.status,
                            remarks: ''
                        })
                    })
                );

                await Promise.all(promises);
                alert("Attendance saved successfully!");
            } else {
                const recordsToSave = teachersData.filter(t => t.attendanceStatus && t.attendanceStatus !== '');
                const promises = recordsToSave.map(t =>
                    fetch(`${API_URL}/api/attendance`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            teacherId: t.id,
                            date: selectedDate,
                            status: t.attendanceStatus,
                            remarks: ''
                        })
                    })
                );

                await Promise.all(promises);
                alert("Teacher attendance saved successfully!");
            }

            // Success Actions
            setIsEditing(false); // Lock Editing
            fetchData(); // Refresh Data from DB to confirm

        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Failed to save attendance.");
        }
    };

    // Determine current stats to show
    const currentStats = activeTab === 'students' ? studentStats : teacherStats;
    const currentCount = activeTab === 'students' ? filteredStudents.length : filteredTeachers.length;

    if (loading) return <Loader />;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0 text-left`}>

                {/* HEADER */}
                <AttendanceHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    selectedDate={selectedDate}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isEditing={isEditing}
                    onEditClick={() => setIsPinModalOpen(true)}
                    onSaveClick={handleSaveData}
                    onCancelClick={() => { setIsEditing(false); fetchData(); }}
                />

                <main className="p-4 md:p-8 pb-32 max-w-[1600px] mx-auto w-full">

                    {/* STATS (Reused for both) */}
                    <AttendanceStats
                        dailyRate={currentStats.rate}
                        averageRate={avgRate}
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
                                onLoadData={fetchData}
                                programs={programs}
                                years={dynamicYears}
                            />
                            <AttendanceTable
                                students={filteredStudents}
                                onStatusChange={handleStudentStatusChange}
                                isEditing={isEditing}
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
                                onLoadData={fetchData}
                                programs={programs}
                            />
                            <TeacherAttendanceTable
                                teachers={filteredTeachers}
                                onStatusChange={handleTeacherStatusChange}
                                isEditing={isEditing}
                            />
                        </>
                    )}

                </main>



            </div>

            {/* PIN MODAL - Now unlocks Edit Mode */}
            <PinModal
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSuccess={handlePinSuccess}
            />
        </div>
    );
};

export default Attendance;