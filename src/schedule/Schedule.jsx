import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Plus, Edit2, ClipboardCheck, Filter, ChevronDown, Trash2 } from 'lucide-react';
import Sidebar from '../Sidebar';
import ScheduleModal from './ScheduleModal';
import AttendancePopup from './AttendancePopup';
import { TEACHERS_DATA } from '../data/mockData';

const Schedule = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [schedules, setSchedules] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showAttendancePopup, setShowAttendancePopup] = useState(false);
    const [selectedSlotForAttendance, setSelectedSlotForAttendance] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedProgramForAdd, setSelectedProgramForAdd] = useState(null);

    // State for Per-Program Filters
    const [programFilters, setProgramFilters] = useState({});

    // Initial Mock Data Load
    useEffect(() => {
        const initialSubjects = [
            { id: 101, year: 'Grade 1', name: 'Juz 1-5', program: 'Hifzul Quran' },
            { id: 102, year: 'Grade 1', name: 'Tajweed Basics', program: 'Hifzul Quran' },
            { id: 103, year: 'Grade 2', name: 'Juz 6-15', program: 'Hifzul Quran' },
            { id: 104, year: 'Grade 3', name: 'Juz 16-30', program: 'Hifzul Quran' },

            { id: 201, year: 'Year 1', name: 'Fiqh Basics', program: 'Al-Alim (Boys)' },
            { id: 202, year: 'Year 1', name: 'Arabic Grammar', program: 'Al-Alim (Boys)' },
            { id: 203, year: 'Year 2', name: 'Hadith Studies', program: 'Al-Alim (Boys)' },

            { id: 301, year: 'Grade 1', name: 'Islamic History', program: 'Al-Alimah (Girls)' },

            { id: 501, year: 'Grade 10', name: 'Mathematics', program: 'O/L' },
            { id: 502, year: 'Grade 11', name: 'Science', program: 'O/L' },

            { id: 601, year: 'Grade 12', name: 'Physics', program: 'A/L' },
            { id: 602, year: 'Grade 13', name: 'Chemistry', program: 'A/L' },

            { id: 701, year: 'Grade 8', name: 'General Science', program: 'Grade 8-10' },
            { id: 702, year: 'Grade 9', name: 'History', program: 'Grade 8-10' },
            { id: 703, year: 'Grade 8', name: 'Mathematics', program: 'Grade 8-10' },
        ];

        setSubjects(initialSubjects);

        // Initialize filters for each program
        const uniquePrograms = [...new Set(initialSubjects.map(s => s.program))];
        const initialFilters = {};
        uniquePrograms.forEach(p => {
            initialFilters[p] = { grade: 'All', subjectId: 'All' };
        });
        setProgramFilters(initialFilters);

        setSchedules([
            { id: 1, day: 'Monday', subjectId: 101, teacherId: 5, startTime: '08:30', endTime: '10:00', room: 'Hall A' },
            { id: 2, day: 'Monday', subjectId: 201, teacherId: 2, startTime: '10:30', endTime: '12:00', room: 'Room 102' },
            { id: 3, day: 'Tuesday', subjectId: 101, teacherId: 5, startTime: '08:30', endTime: '10:00', room: 'Hall A' },
            { id: 4, day: 'Wednesday', subjectId: 102, teacherId: 1, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
            { id: 5, day: 'Thursday', subjectId: 104, teacherId: 5, startTime: '08:00', endTime: '09:30', room: 'Room 103' },
            // Add some dummy schedules for new programs
            { id: 6, day: 'Monday', subjectId: 501, teacherId: 7, startTime: '08:00', endTime: '09:30', room: 'Class 10' },
            { id: 7, day: 'Friday', subjectId: 601, teacherId: 1, startTime: '08:30', endTime: '10:30', room: 'Lab 1' },
        ]);
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
    // Ensure programs order matches user request
    const preferredOrder = ['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)', 'O/L', 'A/L', 'Grade 8-10'];
    const availablePrograms = [...new Set(subjects.map(s => s.program))];
    const programs = preferredOrder.filter(p => availablePrograms.includes(p));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAttendanceUpdate = (slotId, status, data = null) => {
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
                ...prev[program],
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
        const subject = subjects.find(s => s.id === parseInt(slot.subjectId));
        setSelectedProgramForAdd(subject ? subject.program : null);
        setEditingSchedule(slot);
        setShowScheduleModal(true);
    };

    const handleAttendanceClick = (e, slot) => {
        e.stopPropagation(); // Prevent opening edit modal
        setSelectedSlotForAttendance(slot);
        setShowAttendancePopup(true);
    };

    const handleSaveSchedule = (data) => {
        if (editingSchedule) {
            setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...data } : s));
        } else {
            setSchedules([...schedules, { id: Date.now(), ...data }]);
        }
        setShowScheduleModal(false);
    };

    const handleDeleteSchedule = (id) => {
        if (window.confirm("Are you sure you want to delete this class slot?")) {
            setSchedules(schedules.filter(s => s.id !== id));
            setShowScheduleModal(false);
        }
    };

    // Filter subjects for modal
    const getFilteredSubjects = () => {
        if (selectedProgramForAdd) {
            return subjects.filter(s => s.program === selectedProgramForAdd);
        }
        return subjects;
    };

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
                            const programUniqueGrades = [...new Set(subjects.filter(s => s.program === program).map(s => s.year))].sort();

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
                                                    const subject = subjects.find(sub => sub.id === parseInt(s.subjectId));

                                                    // 1. Match Day
                                                    const dayMatch = s.day === day;
                                                    // 2. Match Program
                                                    const programMatch = subject?.program === program;
                                                    // 3. Match Grade Filter (Per Program)
                                                    const gradeMatch = pFilters.grade === 'All' || subject?.year === pFilters.grade;
                                                    // 4. Match Subject Filter (Per Program)
                                                    const subjectMatch = pFilters.subjectId === 'All' || s.subjectId === parseInt(pFilters.subjectId);

                                                    return dayMatch && programMatch && gradeMatch && subjectMatch;
                                                }).sort((a, b) => a.startTime.localeCompare(b.startTime));

                                                return (
                                                    <div key={day} className="flex flex-col gap-2">
                                                        <div className="text-center py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 rounded-lg">
                                                            {day.substring(0, 3)}
                                                        </div>

                                                        <div className="flex-1 space-y-2 min-h-[140px] bg-slate-50/30 rounded-xl p-2 border border-dashed border-slate-200">
                                                            {daySlots.map(slot => {
                                                                const subject = subjects.find(s => s.id === parseInt(slot.subjectId));
                                                                const colorClass = getSubjectColor(subject?.id || 0);

                                                                // Determine Status Color and Icon
                                                                const status = slot.attendanceStatus || 'pending';
                                                                let statusIconColor = "bg-yellow-100 text-yellow-600 hover:bg-yellow-200";

                                                                if (status === 'completed') {
                                                                    statusIconColor = "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 ring-2 ring-emerald-500/20";
                                                                } else if (status === 'cancelled') {
                                                                    statusIconColor = "bg-rose-100 text-rose-600 hover:bg-rose-200 ring-2 ring-rose-500/20";
                                                                }

                                                                return (
                                                                    <div
                                                                        key={slot.id}
                                                                        className={`p-3 rounded-lg border shadow-sm transition-all group relative cursor-pointer ${colorClass} ${status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}
                                                                        onClick={() => handleEditClick(slot)}
                                                                    >
                                                                        {/* Hover Actions */}
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

                                                                        {/* Time */}
                                                                        <div className="flex justify-between items-start mb-1 mt-1">
                                                                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                                                <Clock size={10} /> {slot.startTime}
                                                                            </span>
                                                                        </div>

                                                                        {/* Subject */}
                                                                        <div className={`font-bold text-gray-800 text-xs mb-0.5 line-clamp-2 ${status === 'cancelled' ? 'line-through decoration-rose-500 decoration-2' : ''}`} title={subject?.name}>
                                                                            {subject?.name}
                                                                        </div>

                                                                        {/* Grade Badge */}
                                                                        <div className="mb-1">
                                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black/5 text-gray-600 rounded">
                                                                                {subject?.year}
                                                                            </span>
                                                                        </div>

                                                                        {/* Teacher */}
                                                                        <div className="text-[10px] text-gray-600 flex items-center gap-1 truncate mb-0.5">
                                                                            <User size={10} />
                                                                            {TEACHERS_DATA.find(t => t.id === parseInt(slot.teacherId))?.name.split(' ')[0]}
                                                                        </div>

                                                                        {/* Room */}
                                                                        {slot.room && (
                                                                            <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1 truncate">
                                                                                <MapPin size={10} /> {slot.room}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Empty State / Add Button */}
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
                    teachers={TEACHERS_DATA}
                    initialData={editingSchedule}
                    existingSchedules={schedules}
                    onSave={handleSaveSchedule}
                    onDelete={handleDeleteSchedule}
                />

                {/* Attendance Popup Component */}
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