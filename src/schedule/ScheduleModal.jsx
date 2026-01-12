import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, AlertCircle, Trash2, Check } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, subjects, teachers, initialData, existingSchedules, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        day: 'Monday',
        grade: '', // Added grade to state
        subjectId: '',
        teacherId: '',
        startTime: '08:00',
        endTime: '09:00',
        room: ''
    });

    const [error, setError] = useState('');

    // Extract unique grades from subjects
    const uniqueGrades = [...new Set(subjects.map(s => s.year))].sort();

    useEffect(() => {
        if (isOpen) {
            setError('');
            if (initialData) {
                // Determine grade from existing subject
                const subject = subjects.find(s => s.id === parseInt(initialData.subjectId));
                setFormData({ ...initialData, grade: subject?.year || '' });
            } else {
                setFormData({
                    day: 'Monday',
                    grade: uniqueGrades.length > 0 ? uniqueGrades[0] : '', // Default to first grade
                    subjectId: '', // Reset subject
                    teacherId: teachers.length > 0 ? teachers[0].id : '',
                    startTime: '08:00',
                    endTime: '09:00',
                    room: ''
                });
            }
        }
    }, [isOpen, initialData, subjects, teachers]);

    // Filter subjects based on selected grade
    const filteredSubjects = subjects.filter(s => !formData.grade || s.year === formData.grade);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateAndSave = (e) => {
        e.preventDefault();

        // Time Validation
        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time.');
            return;
        }

        // Conflict Detection
        const hasConflict = checkConflicts();
        if (hasConflict) return;

        onSave(formData);
    };

    const checkConflicts = () => {
        const getMinutes = (time) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };

        const newStart = getMinutes(formData.startTime);
        const newEnd = getMinutes(formData.endTime);

        const conflictingSlot = existingSchedules.find(s => {
            if (initialData && s.id === initialData.id) return false;
            if (s.day !== formData.day) return false;

            const existingStart = getMinutes(s.startTime);
            const existingEnd = getMinutes(s.endTime);

            // Time Overlap Check
            const isTimeOverlapping = (newStart < existingEnd && newEnd > existingStart);
            if (!isTimeOverlapping) return false;

            // Teacher Conflict
            if (parseInt(s.teacherId) === parseInt(formData.teacherId)) {
                setError(`Conflict: Teacher is busy in ${s.room || 'another class'} at this time.`);
                return true;
            }

            // Room Conflict
            if (formData.room && s.room && s.room.toLowerCase() === formData.room.toLowerCase()) {
                setError(`Conflict: Room ${s.room} is already booked.`);
                return true;
            }

            return false;
        });

        return !!conflictingSlot;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Class Slot' : 'Add New Class'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={validateAndSave} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg flex items-start gap-2 border border-red-100">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Day</label>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Grade</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value, subjectId: '' })} // Reset Subject on grade change
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            >
                                <option value="">Select Grade</option>
                                {uniqueGrades.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Subject</label>
                        <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                        >
                            <option value="">Select Subject</option>
                            {filteredSubjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - {s.year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Teacher</label>
                        <select
                            name="teacherId"
                            value={formData.teacherId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Room / Hall</label>
                        <input
                            type="text"
                            name="room"
                            placeholder="e.g. Hall A, Room 101"
                            value={formData.room}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                        {initialData && (
                            <button
                                type="button"
                                onClick={() => onDelete(initialData.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                        <div className="flex-1"></div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 text-sm font-bold hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#ea8933] text-white rounded-lg text-sm font-bold hover:bg-[#d97c2a] shadow-sm shadow-orange-200 transition-all flex items-center gap-2"
                        >
                            <Check size={16} /> Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;