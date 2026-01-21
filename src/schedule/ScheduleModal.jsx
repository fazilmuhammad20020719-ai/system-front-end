import React, { useState, useEffect } from 'react';
import { X, Save, Clock, User, BookOpen, MapPin, Calendar, AlertCircle, Layers } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, subjects, teachers, initialData, existingSchedules, onSave, onDelete }) => {

    // Initial State (Room நீக்கப்பட்டது)
    const [formData, setFormData] = useState({
        day: 'Monday',
        subjectId: '',
        teacherId: '',
        startTime: '',
        endTime: '',
        grade: '',
        type: 'Lecture'
    });

    const [error, setError] = useState('');

    // Load Data on Open
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    day: initialData.day,
                    subjectId: initialData.subjectId,
                    teacherId: initialData.teacherId,
                    startTime: initialData.startTime,
                    endTime: initialData.endTime,
                    grade: initialData.grade || '',
                    type: initialData.type || 'Lecture'
                });
            } else {
                // Reset for new entry
                setFormData({
                    day: 'Monday',
                    subjectId: '',
                    teacherId: '',
                    startTime: '',
                    endTime: '',
                    grade: '',
                    type: 'Lecture'
                });
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    // Conflict Detection Logic (Room Conflict நீக்கப்பட்டது)
    const checkConflicts = () => {
        const otherSchedules = existingSchedules.filter(s => !initialData || s.id !== initialData.id);

        // Teacher Conflict Only
        const teacherConflict = otherSchedules.find(s =>
            s.day === formData.day &&
            parseInt(s.teacher_id || s.teacherId) === parseInt(formData.teacherId) &&
            ((formData.startTime >= s.startTime && formData.startTime < s.endTime) ||
                (formData.endTime > s.startTime && formData.endTime <= s.endTime))
        );

        if (teacherConflict) return `This teacher is already assigned to another class at this time.`;

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.subjectId || !formData.teacherId || !formData.startTime || !formData.endTime) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time');
            return;
        }

        const conflictMsg = checkConflicts();
        if (conflictMsg) {
            setError(conflictMsg);
            return;
        }

        // Send Data (Room இல்லாமல்)
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl transform transition-all scale-100">

                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? <Clock className="text-blue-600" /> : <Clock className="text-green-600" />}
                        {initialData ? 'Edit Class Schedule' : 'Add New Class'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Day Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Day of Week</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subject & Teacher Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Subject</label>
                            <select
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.year || 'Gen'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Teacher</label>
                            <select
                                name="teacherId"
                                value={formData.teacherId}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Class Type Only (Room Removed) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Class Type</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
                            >
                                <option value="Lecture">Lecture</option>
                                <option value="Tutorial">Tutorial</option>
                                <option value="Practical">Practical</option>
                                <option value="Exam">Exam</option>
                                <option value="Special">Special</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                        {initialData && (
                            <button
                                type="button"
                                onClick={() => onDelete(initialData.id)}
                                className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold text-sm transition-colors"
                            >
                                Delete
                            </button>
                        )}

                        <div className="flex-1 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                {initialData ? 'Update Schedule' : 'Add Class'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;