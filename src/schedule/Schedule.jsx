import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Plus, Edit2, ClipboardCheck, ChevronDown } from 'lucide-react';
import Sidebar from '../Sidebar';
import ScheduleModal from './ScheduleModal';
import AttendancePopup from './AttendancePopup';
import { API_URL } from '../config';
import Loader from '../components/Loader';

const Schedule = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [loading, setLoading] = useState(true);

    // Dynamic Data State
    const [schedules, setSchedules] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showAttendancePopup, setShowAttendancePopup] = useState(false);
    const [selectedSlotForAttendance, setSelectedSlotForAttendance] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedProgramForAdd, setSelectedProgramForAdd] = useState(null);

    // State for Per-Program Filters
    const [programFilters, setProgramFilters] = useState({});

    // Fetch All Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [schRes, subRes, teaRes] = await Promise.all([
                    fetch(`${API_URL}/api/schedule`),
                    fetch(`${API_URL}/api/subjects`),
                    fetch(`${API_URL}/api/teachers`)
                ]);

                if (schRes.ok && subRes.ok && teaRes.ok) {
                    const schData = await schRes.json();
                    const subData = await subRes.json(); // Expected: {id, name, program, year (grade)} etc.
                    const teaData = await teaRes.json();

                    setSchedules(schData);
                    setSubjects(subData);
                    setTeachers(teaData);

                    // Initialize filters based on fetched subjects
                    const uniquePrograms = [...new Set(subData.map(s => s.program))].filter(Boolean);
                    const initialFilters = {};
                    uniquePrograms.forEach(p => {
                        initialFilters[p] = { grade: 'All', subjectId: 'All' };
                    });
                    setProgramFilters(initialFilters);
                }
            } catch (err) {
                console.error("Error fetching schedule data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
        return colors[subjectId % colors.length];
    };

    // Derived State
    const preferredOrder = ['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)', 'O/L', 'A/L', 'Grade 8-10'];
    const availablePrograms = [...new Set(subjects.map(s => s.program))].filter(Boolean);
    // Sort available programs by preference or alphabetically
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
        // UI Optimistic update (Backend not fully implemented for class-slot-attendance state yet)
        setSchedules(schedules.map(s =>
            s.id === slotId
                ? { ...s, attendanceStatus: status, attendanceData: data }
                : s
        ));
        setShowAttendancePopup(false);
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
    const handleAddClick = (program) => {
        setEditingSchedule(null);
        setSelectedProgramForAdd(program);
        setShowScheduleModal(true);
    };

    const handleEditClick = (slot) => {
        // In DB schedule, subject_id is stored. Join provided 'subject_name' but we need id for modal
        // 'slot.subject_id' should be present from API
        const subject = subjects.find(s => s.id === parseInt(slot.subject_id));
        setSelectedProgramForAdd(subject ? subject.program : null);
        setEditingSchedule({
            id: slot.id,
            day: slot.day_of_week,
            subjectId: slot.subject_id,
            teacherId: slot.teacher_id,
            startTime: slot.start_time, // Time string like "09:00:00" or "09:00"
            endTime: slot.end_time,
            room: slot.room,
            grade: slot.grade_year
        });
        setShowScheduleModal(true);
    };

    const handleAttendanceClick = (e, slot) => {
        e.stopPropagation();
        setSelectedSlotForAttendance(slot);
        setShowAttendancePopup(true);
    };

    const handleSaveSchedule = async (formData) => {
        // Prepare payload
        // Need to find programId from subjects or selectedProgramForAdd
        // API expects { programId, subjectId, teacherId, day, startTime, endTime, room, grade }
        // We know 'selectedProgramForAdd' (name), need ID? API takes ID.
        // Wait, server.js insert uses programId.
        // We need to fetch programs or map name to id.
        // However, subjects table has program_id. So if we pick a subject, we know the program ID.

        const subject = subjects.find(s => s.id === parseInt(formData.subjectId));
        const programId = subject ? subject.program_id : null;

        // Clean time format if needed (HH:mm)
        const payload = {
            programId, // from subject
            subjectId: formData.subjectId,
            teacherId: formData.teacherId,
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime,
            room: formData.room,
            grade: formData.grade
        };

        try {
            const res = await fetch(`${API_URL}/api/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Refresh data
                const schRes = await fetch(`${API_URL}/api/schedule`);
                const schData = await schRes.json();
                setSchedules(schData);
                setShowScheduleModal(false);
            } else {
                alert("Failed to save schedule");
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (window.confirm("Are you sure you want to delete this class slot?")) {
            try {
                const res = await fetch(`${API_URL}/api/schedule/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setSchedules(schedules.filter(s => s.id !== id));
                    setShowScheduleModal(false);
                }
            } catch (err) {
                console.error("Delete error", err);
            }
        }
    };

    // Filter subjects for modal
    const getFilteredSubjects = () => {
        if (selectedProgramForAdd) {
            return subjects.filter(s => s.program === selectedProgramForAdd);
        }
        return subjects;
    };

    if (loading) return <Loader />;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-8">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage class timetables and attendance</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {programs.map(program => {
                            // Get filters for this program
                            const pFilters = programFilters[program] || { grade: 'All', subjectId: 'All' };

                            // Get unique grades for this program only
                            const programUniqueGrades = [...new Set(subjects.filter(s => s.program === program).map(s => s.year || 'General'))].sort();

                            return (
                                <div key={program} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    {/* Program Header & Filters */}
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <div className="w-1.5 h-8 bg-[#ea8933] rounded-full"></div>
                                            <h2 className="text-lg font-bold text-gray-800">{program}</h2>
                                        </div>

                                        {/* Per-Program Filters */}
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

                                            <button
                                                onClick={() => handleAddClick(program)}
                                                className="px-4 py-1.5 bg-[#ea8933] text-white rounded-lg hover:bg-[#d97c2a] text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md ml-auto xl:ml-0"
                                            >
                                                <Plus size={14} /> Add Slot
                                            </button>
                                        </div>
                                    </div>

                                    {/* Schedule Grid */}
                                    <div className="p-4 overflow-x-auto">
                                        <div className="grid grid-cols-7 min-w-[1200px] gap-3">
                                            {days.map(day => {
                                                const daySlots = schedules.filter(s => {
                                                    // Map DB columns to our logic
                                                    const subject = subjects.find(sub => sub.id === parseInt(s.subject_id || s.subjectId));
                                                    // API returns snake_case mostly, mock was camelCase. 'sch.*' returns DB columns: subject_id, teacher_id
                                                    const sSubId = parseInt(s.subject_id || s.subjectId);
                                                    const sDay = s.day_of_week || s.day;

                                                    // 1. Match Day
                                                    const dayMatch = sDay === day;
                                                    // 2. Match Program
                                                    const programMatch = subject?.program === program;
                                                    // 3. Match Grade Filter (Per Program)
                                                    const gradeMatch = pFilters.grade === 'All' || subject?.year === pFilters.grade;
                                                    // 4. Match Subject Filter (Per Program)
                                                    const subjectMatch = pFilters.subjectId === 'All' || sSubId === parseInt(pFilters.subjectId);

                                                    return dayMatch && programMatch && gradeMatch && subjectMatch;
                                                }).sort((a, b) => (a.start_time || a.startTime).localeCompare(b.start_time || b.startTime));

                                                return (
                                                    <div key={day} className="flex flex-col gap-2">
                                                        <div className="text-center py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 rounded-lg">
                                                            {day.substring(0, 3)}
                                                        </div>

                                                        <div className="flex-1 space-y-2 min-h-[140px] bg-slate-50/30 rounded-xl p-2 border border-dashed border-slate-200">
                                                            {daySlots.map(slot => {
                                                                const subject = subjects.find(s => s.id === parseInt(slot.subject_id || slot.subjectId));
                                                                const colorClass = getSubjectColor(subject?.id || 0);

                                                                const status = slot.attendanceStatus || 'pending';
                                                                let statusIconColor = "bg-yellow-100 text-yellow-600 hover:bg-yellow-200";

                                                                if (status === 'completed') {
                                                                    statusIconColor = "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 ring-2 ring-emerald-500/20";
                                                                } else if (status === 'cancelled') {
                                                                    statusIconColor = "bg-rose-100 text-rose-600 hover:bg-rose-200 ring-2 ring-rose-500/20";
                                                                }

                                                                const startTime = (slot.start_time || slot.startTime).substring(0, 5); // Trim seconds
                                                                const teacherName = teachers.find(t => t.id === parseInt(slot.teacher_id || slot.teacherId))?.name.split(' ')[0] || 'Teacher';

                                                                return (
                                                                    <div
                                                                        key={slot.id}
                                                                        className={`p-3 rounded-lg border shadow-sm transition-all group relative cursor-pointer ${colorClass} ${status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}
                                                                        onClick={() => handleEditClick(slot)}
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
                                                                                <Clock size={10} /> {startTime}
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
                                                                            <User size={10} />
                                                                            {teacherName}
                                                                        </div>

                                                                        {slot.room && (
                                                                            <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1 truncate">
                                                                                <MapPin size={10} /> {slot.room}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}

                                                            {daySlots.length === 0 && (
                                                                <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleAddClick(program)}
                                                                        className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#ea8933] hover:border-[#ea8933] flex items-center justify-center shadow-sm"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            )}
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
                    existingSchedules={schedules}
                    onSave={handleSaveSchedule}
                    onDelete={handleDeleteSchedule}
                />

                <AttendancePopup
                    isOpen={showAttendancePopup}
                    onClose={() => setShowAttendancePopup(false)}
                    slot={selectedSlotForAttendance}
                    subjects={subjects}
                    onSave={(data) => handleAttendanceUpdate(selectedSlotForAttendance?.id, 'completed', data)}
                    onCancel={() => handleAttendanceUpdate(selectedSlotForAttendance?.id, 'cancelled')}
                />
            </div>
        </div>
    );
};

export default Schedule;