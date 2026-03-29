import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Plus, Edit2, ClipboardCheck, ChevronDown, ChevronLeft, ChevronRight, Calendar, Zap, Download, X, Trash2 } from 'lucide-react';
import Sidebar from '../Sidebar';
import ScheduleModal from './ScheduleModal';
import FastScheduleModal from './FastScheduleModal';
import AttendancePopup from './AttendancePopup';
import { API_URL } from '../config';
import Loader from '../components/Loader';

const Schedule = () => {
    // வாரத்தின் ஆரம்ப மற்றும் கடைசி தேதியைக் கண்டுபிடிக்க (User Provided Helper)
    const getWeekRange = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Saturday
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [loading, setLoading] = useState(true);

    // Dynamic Data State
    const [schedules, setSchedules] = useState([]);
    const [titlePrograms, setTitlePrograms] = useState([]); // Store fetched programs
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showFastScheduleModal, setShowFastScheduleModal] = useState(false);
    const [showAttendancePopup, setShowAttendancePopup] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedProgramForExport, setSelectedProgramForExport] = useState(null);
    const [exportGradeSelection, setExportGradeSelection] = useState('All');
    const [exportSubjectSelection, setExportSubjectSelection] = useState('All');
    const [exportTeacherSelection, setExportTeacherSelection] = useState('All');
    const [selectedSlotForAttendance, setSelectedSlotForAttendance] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editingSlotDate, setEditingSlotDate] = useState(null); // Calendar date of the slot being edited
    const [selectedProgramForAdd, setSelectedProgramForAdd] = useState(null);
    const [selectedDayForAdd, setSelectedDayForAdd] = useState('Monday');
    const [isBreakMode, setIsBreakMode] = useState(false);

    // Date Navigation State
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [attendanceData, setAttendanceData] = useState([]); // Store fetched attendance range

    // State for Per-Program Filters
    const [programFilters, setProgramFilters] = useState({});

    // --- Fetch All Data (Reusable Function) ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Calculate Week Range for Attendance
            const startDate = new Date(currentWeekStart);
            const endDate = new Date(currentWeekStart);
            endDate.setDate(endDate.getDate() + 6);

            const formatDate = (d) => d.toISOString().split('T')[0];

            console.log("Fetching data from:", API_URL);

            // 1. Fetch Requests
            const fetchSchedules = fetch(`${API_URL}/api/schedules`).then(res => res.ok ? res.json() : []);
            const fetchSubjects = fetch(`${API_URL}/api/subjects`).then(res => res.ok ? res.json() : []);
            const fetchTeachers = fetch(`${API_URL}/api/teachers`).then(res => res.ok ? res.json() : []);
            const fetchPrograms = fetch(`${API_URL}/api/programs`).then(res => res.ok ? res.json() : []);

            // Fetch Attendance for Range (Session Statuses)
            // Endpoint: /api/attendance?startDate=...&endDate=...
            const fetchAttendance = fetch(`${API_URL}/api/attendance?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`)
                .then(res => res.ok ? res.json() : [])
                .catch(err => { console.error("Attendance Fetch Failed:", err); return []; });

            // 2. Wait for all
            const [schData, subData, teaData, progData, attData] = await Promise.all([
                fetchSchedules, fetchSubjects, fetchTeachers, fetchPrograms, fetchAttendance
            ]);

            // 3. Set State & Merge Attendance
            const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            const mergedSchedules = schData.map(slot => {
                // Calculate Date for this slot
                const dayIndex = daysList.indexOf(slot.day_of_week || slot.day);
                if (dayIndex === -1) return slot;

                const slotDate = new Date(startDate);
                slotDate.setDate(startDate.getDate() + dayIndex);
                const slotDateStr = formatDate(slotDate);

                // Find SESSION record for this slot (class_sessions)
                // attData is now [{ schedule_id, date, status }]
                const sessionRecord = attData.find(a =>
                    parseInt(a.schedule_id) === parseInt(slot.id) &&
                    a.date.split('T')[0] === slotDateStr
                );

                if (sessionRecord) {
                    return {
                        ...slot,
                        attendanceStatus: sessionRecord.status.toLowerCase(), // 'completed' or 'cancelled'
                        attendanceData: sessionRecord
                    };
                }
                return slot;
            });

            setSchedules(mergedSchedules);
            setAttendanceData(attData);

            // Enrich subjects with program name
            const enrichedSubjects = subData.map(s => {
                const program = progData.find(p => p.id === s.program_id);
                return { ...s, program: program ? program.name : null };
            });

            setSubjects(enrichedSubjects);
            setTeachers(teaData);
            setTitlePrograms(progData);

            // 4. Initialize Filters
            if (progData.length > 0) {
                setProgramFilters(prev => {
                    const newFilters = { ...prev };
                    let hasChanges = false;
                    progData.forEach(p => {
                        if (!newFilters[p.name]) {
                            newFilters[p.name] = { grade: 'All', subjectId: 'All', status: 'All' };
                            hasChanges = true;
                        }
                    });
                    return hasChanges ? newFilters : prev;
                });
            }

        } catch (err) {
            console.error("Global Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentWeekStart]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // --- Helpers ---
    const getSubjectColor = (subjectId) => {
        const colors = [
            'bg-blue-50 border-blue-200 text-blue-700',
            'bg-purple-50 border-purple-200 text-purple-700',
            'bg-orange-50 border-orange-200 text-orange-700',
            'bg-emerald-50 border-emerald-200 text-emerald-700',
            'bg-pink-50 border-pink-200 text-pink-700',
            'bg-indigo-50 border-indigo-200 text-indigo-700',
            'bg-cyan-50 border-cyan-200 text-cyan-700',
        ];
        return colors[subjectId % colors.length] || colors[0];
    };

    // Derived State
    const preferredOrder = ['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)', 'A/L', 'Grade 8-10'];
    const availablePrograms = titlePrograms.map(p => p.name).filter(Boolean);

    const programs = availablePrograms.sort((a, b) => {
        const idxA = preferredOrder.indexOf(a);
        const idxB = preferredOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAttendanceUpdate = (slotId, status, data = null) => {
        // Optimistic Update
        setSchedules(schedules.map(s =>
            s.id === slotId
                ? { ...s, attendanceStatus: status, attendanceData: data }
                : s
        ));
        setShowAttendancePopup(false);
        // Full Refresh to ensure sync
        fetchData();
    };

    // Filter Change Handler
    const handleFilterChange = (program, type, value) => {
        setProgramFilters(prev => ({
            ...prev,
            [program]: {
                ...prev[program] || { grade: 'All', subjectId: 'All' },
                [type]: value
            }
        }));
    };

    // --- Handlers ---
    const executeExport = (programName, selectedGrade, selectedSubject = 'All', selectedTeacher = 'All') => {
        const programSlots = schedules.filter(s => {
            const sSubId = parseInt(s.subject_id || s.subjectId);
            if (!sSubId && s.type === 'Break') {
                const currentProgramObj = titlePrograms.find(p => p.name === programName);
                if (selectedGrade !== 'All') return false;
                if (selectedSubject !== 'All' || selectedTeacher !== 'All') return false;
                return s.program_id === currentProgramObj?.id;
            }
            const subject = subjects.find(sub => sub.id === sSubId);
            if (subject?.program !== programName) return false;

            if (selectedGrade !== 'All' && subject?.year !== selectedGrade) {
                return false;
            }
            if (selectedSubject !== 'All' && sSubId.toString() !== selectedSubject.toString()) {
                return false;
            }
            const tId = parseInt(s.teacher_id || s.teacherId);
            if (selectedTeacher !== 'All' && tId.toString() !== selectedTeacher.toString()) {
                return false;
            }
            return true;
        });

        if (programSlots.length === 0) {
            alert(`No schedule slots found for ${programName}${selectedGrade !== 'All' ? ` (${selectedGrade})` : ''}.`);
            return;
        }

        const csvRows = [];
        csvRows.push(['Day', 'Start Time', 'End Time', 'Type', 'Subject', 'Grade', 'Teacher', 'Room', 'Status'].join(','));

        const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };

        programSlots.sort((a, b) => {
            const dayA = a.day_of_week || a.day;
            const dayB = b.day_of_week || b.day;
            if (dayOrder[dayA] !== dayOrder[dayB]) {
                return dayOrder[dayA] - dayOrder[dayB];
            }
            const timeA = a.start_time || a.startTime || "";
            const timeB = b.start_time || b.startTime || "";
            return timeA.localeCompare(timeB);
        });

        programSlots.forEach(slot => {
            const day = slot.day_of_week || slot.day || '';
            const startTime = (slot.start_time || slot.startTime || "00:00").substring(0, 5);
            const endTime = (slot.end_time || slot.endTime || "00:00").substring(0, 5);
            const type = slot.type || (slot.subject_id ? 'Class' : 'Break');
            const room = slot.room || '';
            const status = slot.attendanceStatus || 'pending';

            let subjectName = '';
            let grade = '';
            let teacherName = '';

            if (type !== 'Break') {
                const sSubId = parseInt(slot.subject_id || slot.subjectId);
                const subject = subjects.find(sub => sub.id === sSubId);
                subjectName = subject?.name || '';
                grade = subject?.year || 'General';

                const tId = parseInt(slot.teacher_id || slot.teacherId);
                const teacher = teachers.find(t => t.id === tId);
                teacherName = teacher?.name || '';
            }

            const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;

            csvRows.push([
                escapeCSV(day),
                escapeCSV(startTime),
                escapeCSV(endTime),
                escapeCSV(type),
                escapeCSV(subjectName),
                escapeCSV(grade),
                escapeCSV(teacherName),
                escapeCSV(room),
                escapeCSV(status)
            ].join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\n'));
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        const fileName = selectedGrade === 'All' ? `${programName}_Timetable.csv` : `${programName}_${selectedGrade.replace(/\s+/g, '_')}_Timetable.csv`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportModal(false);
    };

    const handleAddClick = (program, day, isBreak = false) => {
        setEditingSchedule(null);
        setSelectedProgramForAdd(program);
        setSelectedDayForAdd(day);
        setIsBreakMode(isBreak);
        setShowScheduleModal(true);
    };

    const handleEditClick = (slot, slotDate) => {
        const subject = subjects.find(s => s.id === parseInt(slot.subject_id || slot.subjectId));
        setSelectedProgramForAdd(subject ? subject.program : null);
        setIsBreakMode(slot.type === 'Break'); // Set break mode if editing a break
        setEditingSlotDate(slotDate || null);
        setEditingSchedule({
            id: slot.id,
            day: slot.day_of_week || slot.day,
            subjectId: slot.subject_id || slot.subjectId,
            teacherId: slot.teacher_id || slot.teacherId,
            startTime: slot.start_time || slot.startTime,
            endTime: slot.end_time || slot.endTime,
            // room removed
            type: slot.type || 'Lecture'
        });
        setShowScheduleModal(true);
    };

    const handleAttendanceClick = (e, slot) => {
        e.stopPropagation();
        setSelectedSlotForAttendance(slot);
        setShowAttendancePopup(true);
    };

    const handleSaveSchedule = async (formData) => {
        const subject = subjects.find(s => s.id === parseInt(formData.subjectId));
        const programId = subject ? subject.program_id : null;

        // FIXED: Removed 'room', Added 'type' default, Fixed API URL
        const payload = {
            programId,
            subjectId: formData.subjectId,
            teacherId: formData.teacherId,
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime,
            type: formData.type || 'Lecture'
            // room: formData.room // Removed as per backend change
        };

        const method = editingSchedule ? 'PUT' : 'POST';
        // FIXED: URL changed from /api/schedule to /api/schedules
        const url = editingSchedule
            ? `${API_URL}/api/schedules/${editingSchedule.id}`
            : `${API_URL}/api/schedules`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const responseData = await res.json();

                // For versioned edits, the backend returns { oldId, newId, schedule }
                // We need to update local state: replace the OLD slot with the NEW one
                // so attendance/edit actions use the correct new schedule_id
                if (editingSchedule && responseData.newId && responseData.oldId) {
                    // Optimistic swap: replace old slot entry with new one in local state
                    setSchedules(prev => prev.map(s =>
                        s.id === responseData.oldId
                            ? {
                                ...s,
                                id: responseData.newId,
                                subject_id: responseData.schedule.subject_id,
                                teacher_id: responseData.schedule.teacher_id,
                                day_of_week: responseData.schedule.day_of_week,
                                start_time: responseData.schedule.start_time,
                                end_time: responseData.schedule.end_time,
                                type: responseData.schedule.type,
                                effective_from: responseData.schedule.effective_from,
                                effective_to: null,
                            }
                            : s
                    ));
                }

                // Full refresh to ensure complete sync
                fetchData();
                setShowScheduleModal(false);
            } else {
                const errorData = await res.json();
                alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Connection error");
        }
    };

    const handleDeleteSchedule = async (id) => {
        // Soft-close: set effective_to = yesterday so historical attendance is preserved
        try {
            const res = await fetch(`${API_URL}/api/schedules/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setSchedules(prev => prev.filter(s => s.id !== id));
                setShowScheduleModal(false);
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const handleSkipThisWeek = async (scheduleId, date) => {
        if (!date) {
            alert('Cannot determine the date for this slot. Please try again.');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/attendance/session-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduleId, date, status: 'Skipped' })
            });
            if (res.ok) {
                setShowScheduleModal(false);
                fetchData(); // Refresh — the skipped session will now hide this column's slot
            } else {
                alert('Failed to skip this week.');
            }
        } catch (err) {
            console.error('Skip week error:', err);
            alert('Connection error');
        }
    };

    const handleClearAllSlots = async (programName) => {
        const programObj = titlePrograms.find(p => p.name === programName);
        if (!programObj) return;
        const slotCount = schedules.filter(s => {
            const sSubId = parseInt(s.subject_id || s.subjectId);
            if (!sSubId && s.type === 'Break') return s.program_id === programObj.id;
            const subject = subjects.find(sub => sub.id === sSubId);
            return subject?.program === programName;
        }).length;
        if (slotCount === 0) {
            alert(`No active slots to clear for ${programName}.`);
            return;
        }
        if (!window.confirm(`Clear all ${slotCount} slot(s) for "${programName}"?\n\nThis closes every active slot for this program. Historical attendance records are preserved.`)) return;
        try {
            const res = await fetch(`${API_URL}/api/schedules/by-program/${programObj.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
            } else {
                const err = await res.json();
                alert(`Failed to clear slots: ${err.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Clear all error:', err);
            alert('Connection error');
        }
    };

    // Filter subjects for modal
    const getFilteredSubjects = () => {
        if (selectedProgramForAdd) {
            return subjects.filter(s => s.program === selectedProgramForAdd);
        }
        return subjects;
    };

    // Week Navigation Handlers
    const handlePrevWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    const getDateForDay = (dayIndex) => {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + dayIndex);
        return date;
    };

    if (loading) return <Loader />;

    const getProgramGrades = (programName) => {
        const prog = titlePrograms.find(p => p.name === programName);
        const duration = prog ? parseInt(prog.duration) || 0 : 0;
        if (duration > 0) {
            return Array.from({ length: duration }, (_, i) => `Grade ${i + 1}`);
        }
        return ['General'];
    };

    const programUniqueGrades = selectedProgramForAdd ? getProgramGrades(selectedProgramForAdd) : [];

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-8">
                    {/* Header */}
                    <div className="bg-white -mx-4 md:-mx-8 -mt-4 md:-mt-8 px-4 md:px-8 py-4 border-b border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage class timetables and attendance</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Week Picker */}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <button onClick={handlePrevWeek} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2 px-2">
                                    <Calendar size={18} className="text-blue-600" />
                                    <span className="font-bold text-gray-700 text-sm">
                                        {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                                        {(() => {
                                            const end = new Date(currentWeekStart);
                                            end.setDate(end.getDate() + 6);
                                            return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        })()}
                                    </span>
                                </div>
                                <button onClick={handleNextWeek} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Schedule Mode Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFastScheduleModal(true)}
                                    className="px-4 py-2 bg-[#ea8933] text-white rounded-xl hover:bg-[#d97c2a] text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-amber-300/40"
                                >
                                    <Zap size={15} /> Fast Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {(!programs || programs.length === 0) && !loading && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium mb-2">No programs found.</p>
                                <p className="text-gray-400 text-sm mb-4">You need to create programs before you can manage their schedules.</p>
                                <a href="/programs" className="px-4 py-2 bg-[#ea8933] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#d97c2a] transition-colors">
                                    Go to Programs
                                </a>
                            </div>
                        )}
                        {programs.map(program => {
                            const pFilters = programFilters[program] || { grade: 'All', subjectId: 'All', status: 'All' };

                            // Calculate Stats for this program
                            let programStats = { completed: 0, cancelled: 0, pending: 0 };
                            schedules.forEach(s => {
                                const sSubId = parseInt(s.subject_id || s.subjectId);
                                let pMatch = false;
                                if (!sSubId && s.type === 'Break') {
                                    const currentProgramObj = titlePrograms.find(p => p.name === program);
                                    pMatch = s.program_id === currentProgramObj?.id;
                                } else {
                                    const subject = subjects.find(sub => sub.id === sSubId);
                                    pMatch = subject?.program === program;
                                }
                                if (!pMatch) return;

                                // Ignore breaks for stats
                                if (!sSubId && s.type === 'Break') return;

                                const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                const slotDay = s.day_of_week || s.day;
                                const dIndex = dayList.indexOf(slotDay);
                                if (dIndex === -1) return;

                                const dDate = new Date(currentWeekStart);
                                dDate.setDate(dDate.getDate() + dIndex);
                                const colDateStr = dDate.toISOString().split('T')[0];

                                const slotEffectiveFrom = s.effectiveFrom || s.effective_from;
                                if (slotEffectiveFrom && colDateStr < slotEffectiveFrom) return;

                                const sessionForThisSlot = attendanceData.find(a =>
                                    parseInt(a.schedule_id) === parseInt(s.id) &&
                                    a.date.split('T')[0] === colDateStr
                                );
                                if (sessionForThisSlot?.status?.toLowerCase() === 'skipped') return;

                                const status = s.attendanceStatus || 'pending';
                                if (status === 'completed') programStats.completed++;
                                else if (status === 'cancelled') programStats.cancelled++;
                                else programStats.pending++;
                            });

                            // DYNAMIC GRADE GENERATION BASED ON DURATION
                            const currentProgramObj = titlePrograms.find(p => p.name === program);
                            const duration = currentProgramObj ? parseInt(currentProgramObj.duration) || 0 : 0;
                            let programUniqueGrades = [];

                            if (duration > 0) {
                                programUniqueGrades = Array.from({ length: duration }, (_, i) => `Grade ${i + 1}`);
                            } else {
                                // Fallback: If no duration, check existing subjects or default to General
                                const existingGrades = [...new Set(subjects.filter(s => s.program === program).map(s => s.year || 'General'))];
                                programUniqueGrades = existingGrades.length > 0 ? existingGrades.sort() : ['General'];
                            }

                            return (
                                <div key={program} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    {/* Program Header & Filters */}
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
                                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                                            <div className="flex items-center gap-3 min-w-[200px]">
                                                <div className="w-1.5 h-8 bg-[#ea8933] rounded-full"></div>
                                                <h2 className="text-lg font-bold text-gray-800">{program}</h2>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                                                {/* Grade Filter */}
                                                <div className="relative group flex-1 xl:flex-none min-w-[140px]">
                                                    <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <span className="truncate">Grade: {pFilters.grade}</span>
                                                        <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                                    </div>
                                                    <select
                                                        value={pFilters.grade}
                                                        onChange={(e) => handleFilterChange(program, 'grade', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    >
                                                        <option value="All">All Grades</option>
                                                        {programUniqueGrades.map(grade => (
                                                            <option key={grade} value={grade}>{grade}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Subject Filter */}
                                                <div className="relative group flex-1 xl:flex-none min-w-[160px]">
                                                    <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <span className="truncate">
                                                            Subject: {pFilters.subjectId === 'All' ? 'All' : subjects.find(s => s.id === parseInt(pFilters.subjectId))?.name}
                                                        </span>
                                                        <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                                    </div>
                                                    <select
                                                        value={pFilters.subjectId}
                                                        onChange={(e) => handleFilterChange(program, 'subjectId', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    >
                                                        <option value="All">All Subjects</option>
                                                        {subjects
                                                            .filter(s => s.program === program && (pFilters.grade === 'All' || s.year === pFilters.grade))
                                                            .map(subject => (
                                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                {/* Status Filter */}
                                                <div className="relative group flex-1 xl:flex-none min-w-[140px]">
                                                    <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <span className="truncate">Status: {pFilters.status === 'All' ? 'All Statuses' : pFilters.status.charAt(0).toUpperCase() + pFilters.status.slice(1)}</span>
                                                        <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                                    </div>
                                                    <select
                                                        value={pFilters.status}
                                                        onChange={(e) => handleFilterChange(program, 'status', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    >
                                                        <option value="All">All Statuses</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>

                                                <div className="flex gap-2 ml-auto xl:ml-0">
                                                    <button
                                                        onClick={() => handleClearAllSlots(program)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-200 text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                                                        title="Clear all slots for this program"
                                                    >
                                                        <Trash2 size={14} /> Clear All
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProgramForExport(program);
                                                            setExportGradeSelection('All');
                                                            setExportSubjectSelection('All');
                                                            setExportTeacherSelection('All');
                                                            setShowExportModal(true);
                                                        }}
                                                        className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200 text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                                                        title="Export Timetable as CSV"
                                                    >
                                                        <Download size={14} /> Export
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddClick(program)}
                                                        className="px-4 py-1.5 bg-[#ea8933] text-white rounded-lg hover:bg-[#d97c2a] text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                                                    >
                                                        <Plus size={14} /> Add Slot
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Boxes */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                                                <div className="text-xs font-bold text-yellow-700 uppercase">Pending Classes</div>
                                                <div className="text-lg font-black text-yellow-600">{programStats.pending}</div>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                                                <div className="text-xs font-bold text-emerald-700 uppercase">Completed Classes</div>
                                                <div className="text-lg font-black text-emerald-600">{programStats.completed}</div>
                                            </div>
                                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                                                <div className="text-xs font-bold text-rose-700 uppercase">Cancelled Classes</div>
                                                <div className="text-lg font-black text-rose-600">{programStats.cancelled}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule Grid */}
                                    <div className="p-4 overflow-x-auto">
                                        <div className="grid grid-cols-7 min-w-[1200px] gap-3">
                                            {days.map((day, dayIndex) => {
                                                const currentDayDate = getDateForDay(dayIndex);

                                                const daySlots = schedules.filter(s => {
                                                    const sSubId = parseInt(s.subject_id || s.subjectId);

                                                    // Compute once for both guards below
                                                    const columnDateStr = currentDayDate.toISOString().split('T')[0];

                                                    // Effective-date guard: only show the slot if its first occurrence
                                                    // has already reached or passed the current column date.
                                                    // This prevents a "Friday slot created on Monday" from appearing
                                                    // in Monday/Tuesday/Wednesday/Thursday columns.
                                                    const slotEffectiveFrom = s.effectiveFrom || s.effective_from;
                                                    if (slotEffectiveFrom && columnDateStr < slotEffectiveFrom) return false;

                                                    // Skip-this-week guard: hide if this occurrence is marked Skipped
                                                    const sessionForThisSlot = attData.find(a =>
                                                        parseInt(a.schedule_id) === parseInt(s.id) &&
                                                        a.date.split('T')[0] === columnDateStr
                                                    );
                                                    if (sessionForThisSlot?.status?.toLowerCase() === 'skipped') return false;

                                                    if (!sSubId && s.type === 'Break') {
                                                        // Break Logic: Show breaks for this program/day
                                                        // Assuming breaks are program-wide or we might need grade filter?
                                                        // Ideally breaks are program wide.
                                                        const pId = s.program_id;
                                                        // Find program ID for current 'program' name
                                                        const currentProgramObj = titlePrograms.find(p => p.name === program);
                                                        return pId === currentProgramObj?.id && (s.day_of_week || s.day) === day;
                                                    }

                                                    const subject = subjects.find(sub => sub.id === sSubId);
                                                    const sDay = s.day_of_week || s.day;

                                                    const dayMatch = sDay === day;
                                                    const programMatch = subject?.program === program;
                                                    const gradeMatch = pFilters.grade === 'All' || subject?.year === pFilters.grade;
                                                    const subjectMatch = pFilters.subjectId === 'All' || sSubId === parseInt(pFilters.subjectId);
                                                    const sStatus = s.attendanceStatus || 'pending';
                                                    const statusMatch = pFilters.status === 'All' || sStatus === pFilters.status;

                                                    return dayMatch && programMatch && gradeMatch && subjectMatch && (s.type === 'Break' ? true : statusMatch);
                                                }).sort((a, b) => (a.start_time || a.startTime).localeCompare(b.start_time || b.startTime));

                                                return (
                                                    <div key={day} className="flex flex-col gap-2">
                                                        <div className="text-center py-2 bg-gray-50 rounded-lg flex flex-col justify-center h-14 relative group/header">
                                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day.substring(0, 3)}</div>
                                                            <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleAddClick(program, day, true)} // True for Break
                                                                    className="p-1 text-gray-400 hover:text-orange-500 hover:bg-white rounded-md transition-all"
                                                                    title="Add Break"
                                                                >
                                                                    <div className="text-[10px] font-bold">BRK</div>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAddClick(program, day)}
                                                                    className="p-1 text-gray-400 hover:text-[#ea8933] hover:bg-white rounded-md transition-all"
                                                                    title="Add Class"
                                                                >
                                                                    <Plus size={12} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                            <div className={`text-xs font-bold ${currentDayDate.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-600'}`}>
                                                                {currentDayDate.getDate()}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 space-y-2 min-h-[140px] bg-slate-50/30 rounded-xl p-2 border border-dashed border-slate-200">
                                                            {daySlots.map(slot => {
                                                                if (slot.type === 'Break') {
                                                                    // Render Break Slot
                                                                    const startTime = (slot.start_time || slot.startTime || "00:00").substring(0, 5);
                                                                    const endTime = (slot.end_time || slot.endTime || "00:00").substring(0, 5);
                                                                    return (
                                                                        <div
                                                                            key={slot.id}
                                                                            className="p-2 rounded-lg border border-gray-200 bg-gray-100 text-center shadow-sm cursor-pointer hover:bg-gray-200 transition-colors group relative"
                                                                            onClick={() => handleDeleteSchedule(slot.id)} // Allow delete on click for now or edit?
                                                                        >
                                                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Break</div>
                                                                            <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                                                                <Clock size={10} /> {startTime} - {endTime}
                                                                            </div>
                                                                            <div className="absolute top-1 right-1 hidden group-hover:block">
                                                                                <button className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }

                                                                const subject = subjects.find(s => s.id === parseInt(slot.subject_id || slot.subjectId));
                                                                const status = slot.attendanceStatus || 'pending';

                                                                let colorClass = "bg-yellow-50 border-yellow-200 text-yellow-800";
                                                                let statusIconColor = "bg-yellow-100 text-yellow-600 hover:bg-yellow-200";

                                                                if (status === 'completed') {
                                                                    colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
                                                                    statusIconColor = "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 ring-2 ring-emerald-500/20";
                                                                } else if (status === 'cancelled') {
                                                                    colorClass = "bg-rose-50 border-rose-200 text-rose-800";
                                                                    statusIconColor = "bg-rose-100 text-rose-600 hover:bg-rose-200 ring-2 ring-rose-500/20";
                                                                }

                                                                const startTime = (slot.start_time || slot.startTime || "00:00").substring(0, 5);
                                                                const endTime = (slot.end_time || slot.endTime || "00:00").substring(0, 5);
                                                                const teacherName = teachers.find(t => t.id === parseInt(slot.teacher_id || slot.teacherId))?.name.split(' ')[0] || 'Teacher';

                                                                return (
                                                                    <div
                                                                        key={slot.id}
                                                                        className={`p-3 rounded-lg border shadow-sm transition-all group relative cursor-pointer ${colorClass} ${status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}
                                                                        onClick={() => handleEditClick(slot, currentDayDate.toISOString().split('T')[0])}
                                                                    >
                                                                        <div className="absolute top-1 right-1 flex gap-1 z-10">
                                                                            <button
                                                                                onClick={(e) => handleAttendanceClick(e, slot)}
                                                                                title="Attendance"
                                                                                className={`p-1.5 rounded-lg transition-all ${statusIconColor} shadow-sm`}
                                                                            >
                                                                                <ClipboardCheck size={18} strokeWidth={2.5} />
                                                                            </button>
                                                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                                                <Edit2 size={16} />
                                                                            </button>
                                                                        </div>

                                                                        <div className="flex justify-between items-start mb-1 mt-1">
                                                                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                                                <Clock size={10} /> {startTime} - {endTime}
                                                                            </span>
                                                                        </div>

                                                                        <div className={`font-bold text-gray-800 text-xs mb-0.5 line-clamp-2 ${status === 'cancelled' ? 'line-through decoration-rose-500 decoration-2' : ''}`} title={subject?.name}>
                                                                            {subject?.name}
                                                                        </div>

                                                                        <div className="mb-1">
                                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black/5 text-gray-600 rounded">
                                                                                {subject?.year || 'General'}
                                                                            </span>
                                                                        </div>

                                                                        <div className="text-[10px] text-gray-600 flex items-center gap-1 truncate mb-0.5">
                                                                            <User size={10} /> {teacherName}
                                                                        </div>

                                                                        {slot.room && (
                                                                            <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1 truncate">
                                                                                <MapPin size={10} /> {slot.room}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}

                                                            <div className="mt-auto pt-2 flex justify-center">
                                                                <button
                                                                    onClick={() => handleAddClick(program, day)}
                                                                    title="Add class"
                                                                    className="w-full py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-[#ea8933] hover:border-[#ea8933] text-xs font-medium flex items-center justify-center gap-1 hover:bg-white transition-all"
                                                                >
                                                                    <Plus size={12} /> Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                <ScheduleModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                    subjects={getFilteredSubjects()}
                    teachers={teachers}
                    initialData={editingSchedule}
                    defaultDay={selectedDayForAdd}
                    existingSchedules={schedules}
                    onSave={handleSaveSchedule}
                    onDelete={handleDeleteSchedule}
                    onDeleteWeek={handleSkipThisWeek}
                    slotDate={editingSlotDate}
                    programGrades={programUniqueGrades}
                    defaultGrade={programFilters[selectedProgramForAdd]?.grade}
                    isBreak={isBreakMode}
                />
                <FastScheduleModal
                    isOpen={showFastScheduleModal}
                    onClose={() => setShowFastScheduleModal(false)}
                    programs={titlePrograms}
                    subjects={subjects}
                    teachers={teachers}
                    onDone={() => { setShowFastScheduleModal(false); fetchData(); }}
                />
                <AttendancePopup
                    isOpen={showAttendancePopup}
                    onClose={() => setShowAttendancePopup(false)}
                    slot={selectedSlotForAttendance}
                    subjects={subjects}
                    onSave={(data) => handleAttendanceUpdate(selectedSlotForAttendance?.id, 'completed', data)}
                    onCancel={() => handleAttendanceUpdate(selectedSlotForAttendance?.id, 'cancelled')}
                />

                {/* Export Modal */}
                {showExportModal && selectedProgramForExport && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Download size={18} className="text-[#ea8933]" /> Export Options
                                </h3>
                                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Export schedule for <strong className="text-[#ea8933]">{selectedProgramForExport}</strong>. Use filters to customize the exported CSV.
                                </p>

                                {/* Grade Export Filter */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 block">Select Grade</label>
                                    <select
                                        value={exportGradeSelection}
                                        onChange={(e) => {
                                            setExportGradeSelection(e.target.value);
                                            // Reset subject when grade changes to avoid mismatch
                                            if (e.target.value !== 'All' && exportSubjectSelection !== 'All') {
                                                const selSubj = subjects.find(s => s.id.toString() === exportSubjectSelection);
                                                if (selSubj && selSubj.year !== e.target.value) {
                                                    setExportSubjectSelection('All');
                                                }
                                            }
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933] focus:border-transparent transition-all shadow-sm"
                                    >
                                        <option value="All">All Grades</option>
                                        {getProgramGrades(selectedProgramForExport).map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Export Filter */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 block">Select Subject</label>
                                    <select
                                        value={exportSubjectSelection}
                                        onChange={(e) => setExportSubjectSelection(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933] focus:border-transparent transition-all shadow-sm"
                                    >
                                        <option value="All">All Subjects</option>
                                        {subjects
                                            .filter(s => s.program === selectedProgramForExport && (exportGradeSelection === 'All' || s.year === exportGradeSelection))
                                            .map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                            ))}
                                    </select>
                                </div>

                                {/* Teacher Export Filter */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 block">Assigned Teacher</label>
                                    <select
                                        value={exportTeacherSelection}
                                        onChange={(e) => setExportTeacherSelection(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933] focus:border-transparent transition-all shadow-sm"
                                    >
                                        <option value="All">All Teachers</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        executeExport(selectedProgramForExport, exportGradeSelection, exportSubjectSelection, exportTeacherSelection);
                                        setShowExportModal(false);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-[#ea8933] text-white rounded-xl text-sm font-bold hover:bg-[#d97c2a] transition-all shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
                                >
                                    <Download size={16} /> Download CSV
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;