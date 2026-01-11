import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Plus, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../Sidebar';
import ScheduleModal from './ScheduleModal';
// Importing mock data - assuming this is where it is based on ViewProgram imports
import { TEACHERS_DATA } from '../data/mockData';

const Schedule = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [schedules, setSchedules] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [subjects, setSubjects] = useState([]); // Need subjects for the modal and display

    // Initial Mock Data Load
    useEffect(() => {
        // Simulating data fetch for all programs/subjects
        // In a real app, you might fetch all subjects or have a way to select program first
        // For now, I'll use the same mock subjects from ViewProgram but maybe expand or just keep them for demo
        setSubjects([
            { id: 101, year: 'Grade 1', name: 'Juz 1-5' },
            { id: 102, year: 'Grade 1', name: 'Tajweed Basics' },
            { id: 103, year: 'Grade 2', name: 'Juz 6-15' },
            { id: 104, year: 'Grade 3', name: 'Juz 16-30' },
        ]);

        setSchedules([
            { id: 1, day: 'Monday', subjectId: 101, teacherId: 5, startTime: '08:30', endTime: '10:00', room: 'Hall A' },
            { id: 2, day: 'Monday', subjectId: 102, teacherId: 1, startTime: '10:30', endTime: '12:00', room: 'Room 102' },
            { id: 3, day: 'Tuesday', subjectId: 101, teacherId: 5, startTime: '08:30', endTime: '10:00', room: 'Hall A' },
        ]);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage class timetables and room allocations</p>
                        </div>
                        <button
                            onClick={() => { setEditingSchedule(null); setShowScheduleModal(true); }}
                            className="px-5 py-2.5 bg-[#ea8933] text-white rounded-xl hover:bg-[#d97c2a] text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                        >
                            <Plus size={18} /> Add Slot
                        </button>
                    </div>

                    {/* Schedule Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                            const daySlots = schedules.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                            return (
                                <div key={day} className="space-y-3">
                                    <div className="bg-gray-800 text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {day}
                                    </div>
                                    <div className="space-y-3 min-h-[100px]">
                                        {daySlots.map(slot => (
                                            <div key={slot.id} className="bg-white p-4 rounded-xl border-l-4 border-l-[#ea8933] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                        <Clock size={10} /> {slot.startTime} - {slot.endTime}
                                                    </span>
                                                    <button
                                                        onClick={() => { setEditingSchedule(slot); setShowScheduleModal(true); }}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                                                    {subjects.find(s => s.id === parseInt(slot.subjectId))?.name || 'Unknown Subject'}
                                                </h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                                    <User size={12} /> {TEACHERS_DATA.find(t => t.id === parseInt(slot.teacherId))?.name || 'Unknown Teacher'}
                                                </p>
                                                {slot.room && (
                                                    <p className="text-xs text-blue-600 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded inline-flex">
                                                        <MapPin size={10} /> {slot.room}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        {daySlots.length === 0 && (
                                            <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                                <span className="text-xs text-gray-300 font-medium italic">No Classes</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                <ScheduleModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                    subjects={subjects}
                    teachers={TEACHERS_DATA}
                    initialData={editingSchedule}
                    isEditing={!!editingSchedule}
                    onSave={(data) => {
                        if (editingSchedule) {
                            setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...data } : s));
                        } else {
                            setSchedules([...schedules, { id: Date.now(), ...data }]);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Schedule;
