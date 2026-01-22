import React, { useState, useEffect } from 'react';
import { X, Save, Clock, User, BookOpen, MapPin, Calendar, AlertCircle, Layers } from 'lucide-react';

// Added 'defaultDay' to props
const ScheduleModal = ({ isOpen, onClose, subjects, teachers, initialData, existingSchedules, onSave, onDelete, programGrades = [], defaultGrade = 'All', defaultDay, isBreak = false }) => {

    // Initial State
    const [formData, setFormData] = useState({
        day: defaultDay || 'Monday',
        subjectId: '',
        teacherId: '',
        startTime: '',
        endTime: '',
        grade: '',
        type: isBreak ? 'Break' : ''
    });

    const [error, setError] = useState('');

    // Load Data on Open
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    day: initialData.day,
                    subjectId: initialData.subjectId || '',
                    teacherId: initialData.teacherId || '',
                    startTime: initialData.startTime,
                    endTime: initialData.endTime,
                    grade: initialData.grade || '',
                    type: initialData.type || (isBreak ? 'Break' : '')
                });
            } else {
                // Reset for new entry using passed defaults
                setFormData({
                    day: defaultDay || 'Monday',
                    subjectId: '',
                    teacherId: '',
                    startTime: '',
                    endTime: '',
                    grade: defaultGrade !== 'All' ? defaultGrade : '',
                    type: isBreak ? 'Break' : ''
                });
            }
            setError('');
        }
    }, [isOpen, initialData, defaultGrade, defaultDay, isBreak]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset subject if grade changes
            ...(name === 'grade' ? { subjectId: '' } : {})
        }));
        if (error) setError('');
    };

    // Filter subjects based on selected grade
    const filteredSubjects = subjects.filter(
        s => !formData.grade || s.year === formData.grade || s.year === 'General'
    );

    // Conflict Detection Logic
    const checkConflicts = () => {
        const otherSchedules = existingSchedules.filter(s => !initialData || s.id !== initialData.id);

        // 1. Time Logic
        if (formData.startTime >= formData.endTime) return 'End time must be after start time';

        // Skip conflict checks for Break
        if (formData.type === 'Break') return null;

        // 2. Teacher Conflict
        if (formData.teacherId) {
            const teacherConflict = otherSchedules.find(s =>
                s.day === formData.day &&
                parseInt(s.teacher_id || s.teacherId) === parseInt(formData.teacherId) &&
                ((formData.startTime < (s.endTime || s.end_time) && formData.endTime > (s.startTime || s.start_time)))
            );
            if (teacherConflict) return `This teacher is already assigned to another class at this time.`;
        }

        // 3. Batch/Grade Conflict
        if (formData.grade && formData.subjectId) {
            const batchConflict = otherSchedules.find(s => {
                const sSubId = parseInt(s.subject_id || s.subjectId);
                const sSubject = subjects.find(sub => sub.id === sSubId);
                if (!sSubject) return false;

                const sYear = sSubject.year || 'General';
                const myYear = formData.grade;

                const isSameBatch =
                    (sSubject.program_id === subjects.find(sub => sub.id === parseInt(formData.subjectId))?.program_id) &&
                    (sYear === 'General' || myYear === 'General' || sYear === myYear);

                if (!isSameBatch) return false;

                const isSameDay = (s.day_of_week || s.day) === formData.day;
                const isOverlapping = (formData.startTime < (s.endTime || s.end_time) && formData.endTime > (s.startTime || s.start_time));

                return isSameDay && isOverlapping;
            });

            if (batchConflict) return `This batch (Grade ${formData.grade}) already has a class at this time.`;
        }

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Fields
        if (!formData.day || !formData.startTime || !formData.endTime) {
            setError('Please fill in required fields');
            return;
        }

        // Specific fields if NOT break
        if (!isBreak && (!formData.subjectId || !formData.teacherId || !formData.grade)) {
            setError('Please fill in all class details');
            return;
        }

        // Past Time Check
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const todayIndex = new Date().getDay() - 1;
        const currentDayName = days[todayIndex === -1 ? 6 : todayIndex];

        if (formData.day === currentDayName) {
            const now = new Date();
            const currentTime = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
            if (formData.startTime < currentTime) {
                setError("Cannot schedule in the past time for today.");
                return;
            }
        }

        const conflictMsg = checkConflicts();
        if (conflictMsg) {
            setError(conflictMsg);
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl transform transition-all scale-100">

                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {isBreak ? <Clock className="text-orange-500" /> : (initialData ? <Clock className="text-blue-600" /> : <Clock className="text-green-600" />)}
                        {isBreak ? 'Add Break' : (initialData ? 'Edit Class Schedule' : 'Add New Class')}
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

                    {!isBreak && (
                        <>
                            {/* Grade & Subject Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Grade</label>
                                    <select
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">Select Grade</option>
                                        {programGrades.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Subject</label>
                                    <select
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleChange}
                                        disabled={!formData.grade}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Subject</option>
                                        {filteredSubjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.year || 'Gen'})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Teacher */}
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
                        </>
                    )}

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

                    {/* About Class / Break Info */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                            {isBreak ? 'Break Details (Optional)' : 'About Class (Optional)'}
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 text-gray-400" size={16} />
                            <textarea
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder={isBreak ? "e.g. Lunch Break" : "Enter class topic or details..."}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[80px] resize-none"
                            />
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