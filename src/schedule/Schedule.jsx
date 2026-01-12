import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Plus, Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../Sidebar';
import ScheduleModal from './ScheduleModal';
import AttendanceActionModal from './AttendanceActionModal'; // Imported
import { TEACHERS_DATA, PROGRAMS_DATA, SCHEDULES_DATA, SUBJECTS_DATA, STUDENTS_DATA } from '../data/mockData';

const Schedule = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Schedule State with LocalStorage
    const [schedules, setSchedules] = useState(() => {
        const saved = localStorage.getItem('schedules');
        return saved ? JSON.parse(saved) : SCHEDULES_DATA;
    });

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjects, setSubjects] = useState(SUBJECTS_DATA);

    // Attendance Modal Types
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedAttendanceSlot, setSelectedAttendanceSlot] = useState(null);

    // Grade Filter State
    const [programFilters, setProgramFilters] = useState({}); // { [programId]: 'All' | 'Grade 1' ... }

    const availableGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

    // Save to LocalStorage whenever schedules change
    useEffect(() => {
        localStorage.setItem('schedules', JSON.stringify(schedules));
    }, [schedules]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const filteredPrograms = PROGRAMS_DATA.filter(prog =>
        prog.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAddClick = (progId) => {
        setEditingSchedule(null);
        setSelectedProgramId(progId);
        setShowScheduleModal(true);
    };

    const handleEditClick = (slot) => {
        setEditingSchedule(slot);
        setSelectedProgramId(slot.programId);
        setShowScheduleModal(true);
    };

    const handleAttendanceClick = (e, slot) => {
        e.stopPropagation(); // Prevent opening edit modal
        setSelectedAttendanceSlot(slot);
        setShowAttendanceModal(true);
    };

    const updateSlotStatus = (status, studentRecords = null) => {
        if (!selectedAttendanceSlot) return;

        setSchedules(schedules.map(s =>
            s.id === selectedAttendanceSlot.id
                ? { ...s, attendanceStatus: status, studentAttendance: studentRecords }
                : s
        ));
        setShowAttendanceModal(false);
        setSelectedAttendanceSlot(null);
    };

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-8">
                    {/* Header & Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Master Timetable</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage weekly schedules for all academic programs</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Filter programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933] transition-all"
                            />
                        </div>
                    </div>

                    {/* Programs List */}
                    <div className="space-y-8">
                        {filteredPrograms.map(program => {
                            // Determine selected grade for this program (default 'All')
                            const selectedGrade = programFilters[program.id] || 'All';

                            return (
                                <div key={program.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    {/* Program Header */}
                                    <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center ${program.color.split(' ')[0]} bg-opacity-30`}>
                                        <div className="flex items-center gap-4">
                                            <h2 className={`text-lg font-bold ${program.color.split(' ')[1]}`}>{program.name}</h2>

                                            {/* GRADE FILTER DROPDOWN */}
                                            <select
                                                value={selectedGrade}
                                                onChange={(e) => setProgramFilters(prev => ({ ...prev, [program.id]: e.target.value }))}
                                                className="text-xs font-semibold px-2 py-1 bg-white/70 border border-transparent hover:border-gray-200 rounded-md text-gray-700 outline-none focus:ring-2 focus:ring-[#ea8933]/20 transition-all cursor-pointer"
                                            >
                                                <option value="All">All Grades</option>
                                                {availableGrades.map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => handleAddClick(program.id)}
                                            className="px-3 py-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                                        >
                                            <Plus size={14} /> Add Schedule
                                        </button>
                                    </div>

                                    {/* Weekly Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                                        {days.map(day => {
                                            // FILTER LOGIC: Match program, match day, match grade (if not All)
                                            const daySlots = schedules.filter(s =>
                                                s.programId === program.id &&
                                                s.day === day &&
                                                (selectedGrade === 'All' || s.grade === selectedGrade)
                                            ).sort((a, b) => a.startTime.localeCompare(b.startTime));

                                            return (
                                                <div key={day} className="min-h-[150px] p-3">
                                                    <div className="text-xs font-bold text-gray-400 uppercase mb-3 text-center tracking-wider">{day.slice(0, 3)}</div>
                                                    <div className="space-y-2">
                                                        {daySlots.map(slot => {
                                                            const status = slot.attendanceStatus || 'pending'; // pending, completed, cancelled
                                                            let borderColor = 'border-gray-200';
                                                            let bgStatus = 'bg-gray-50';

                                                            if (status === 'completed') {
                                                                borderColor = 'border-green-500 ring-1 ring-green-100';
                                                                bgStatus = 'bg-green-50/50';
                                                            } else if (status === 'cancelled') {
                                                                borderColor = 'border-red-500 ring-1 ring-red-100';
                                                                bgStatus = 'bg-red-50/50';
                                                            }

                                                            return (
                                                                <div
                                                                    key={slot.id}
                                                                    onClick={() => handleEditClick(slot)}
                                                                    className={`p-2 rounded-lg border ${borderColor} ${bgStatus} hover:shadow-md cursor-pointer transition-all group relative flex flex-col gap-1`}
                                                                >
                                                                    {/* Attendance Icon Overlay */}
                                                                    <button
                                                                        onClick={(e) => handleAttendanceClick(e, slot)}
                                                                        className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/80 transition-colors z-10"
                                                                        title="Manage Attendance"
                                                                    >
                                                                        {status === 'completed' && <CheckCircle size={14} className="text-green-500 fill-green-100" />}
                                                                        {status === 'cancelled' && <XCircle size={14} className="text-red-500 fill-red-100" />}
                                                                        {status === 'pending' && <AlertTriangle size={14} className="text-yellow-500 fill-yellow-100 opacity-50 hover:opacity-100" />}
                                                                    </button>

                                                                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                                        <div className="flex items-center gap-1 font-mono">
                                                                            <Clock size={10} />
                                                                            {slot.startTime} - {slot.endTime}
                                                                        </div>
                                                                        {slot.grade && (
                                                                            <span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-[9px] mr-4">
                                                                                {slot.grade}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className={`font-bold text-xs leading-tight ${status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                                        {subjects.find(s => s.id === parseInt(slot.subjectId))?.name || 'Subject'}
                                                                    </div>

                                                                    <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                                                                        <User size={10} />
                                                                        {TEACHERS_DATA.find(t => t.id === parseInt(slot.teacherId))?.name || 'Teacher'}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        {daySlots.length === 0 && (
                                                            <div className="h-full flex items-center justify-center py-4 opacity-0 hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingSchedule({ day, programId: program.id });
                                                                        setSelectedProgramId(program.id);
                                                                        setShowScheduleModal(true);
                                                                    }}
                                                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400"
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
                            );
                        })}

                        {filteredPrograms.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Filter size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No programs found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </main>

                <ScheduleModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                    subjects={subjects.filter(s => !selectedProgramId || s.programId === selectedProgramId)}
                    teachers={TEACHERS_DATA}
                    initialData={editingSchedule}
                    isEditing={!!editingSchedule && !!editingSchedule.id}
                    programId={selectedProgramId}
                    onSave={(data) => {
                        const newSlot = {
                            ...data,
                            programId: selectedProgramId,
                        };

                        if (editingSchedule && editingSchedule.id) {
                            setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...data } : s));
                        } else {
                            setSchedules([...schedules, { id: Date.now(), ...newSlot }]);
                        }
                        setShowScheduleModal(false);
                    }}
                />
                <AttendanceActionModal
                    isOpen={showAttendanceModal}
                    onClose={() => setShowAttendanceModal(false)}
                    onSaveAttendance={(records) => updateSlotStatus('completed', records)}
                    onCancelClass={() => updateSlotStatus('cancelled')}
                    students={selectedAttendanceSlot ? STUDENTS_DATA.filter(student => {
                        const programName = PROGRAMS_DATA.find(p => p.id === selectedAttendanceSlot.programId)?.name;
                        // Loose equality for year/grade to handle 'Grade 1' vs 'Grade 01' if any discrepancies
                        return student.program === programName && student.year === selectedAttendanceSlot.grade;
                    }) : []}
                    existingAttendance={selectedAttendanceSlot?.studentAttendance || {}}
                    slotDetails={selectedAttendanceSlot ? {
                        subject: subjects.find(s => s.id === parseInt(selectedAttendanceSlot.subjectId))?.name,
                        time: `${selectedAttendanceSlot.startTime} - ${selectedAttendanceSlot.endTime}`,
                        grade: selectedAttendanceSlot.grade
                    } : null}
                />
            </div>
        </div>
    );
};

export default Schedule;
