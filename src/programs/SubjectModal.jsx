import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, User } from 'lucide-react';

// teachers prop-ஐ இங்கே புதிதாகச் சேர்த்துள்ளோம் (Added 'teachers' prop)
const SubjectModal = ({ isOpen, onClose, onSave, programs = [], teachers = [], initialData, isEditing }) => {

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        programId: '',
        year: 'Grade 1',
        teacherId: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditing && initialData) {
                setFormData({
                    name: initialData.name || '',
                    code: initialData.code || '',
                    programId: initialData.program_id || (programs.length === 1 ? programs[0].id : ''),
                    year: initialData.year || 'Grade 1',
                    teacherId: initialData.teacher_id || '' // Database-ல் உள்ள Teacher ID வரும்
                });
            } else {
                setFormData({
                    name: '',
                    code: '',
                    programId: programs.length === 1 ? programs[0].id : '',
                    year: 'Grade 1',
                    teacherId: ''
                });
            }
        }
    }, [isOpen, isEditing, initialData, programs]);

    const selectedProgram = programs.find(p => p.id === parseInt(formData.programId));
    const durationNum = selectedProgram ? (parseInt(selectedProgram.duration) || 5) : 5;
    const gradeOptions = Array.from({ length: durationNum }, (_, i) => `Grade ${i + 1}`);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">

                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={24} />
                        {isEditing ? 'Edit Subject' : 'Add New Subject'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Fiqh, Thafseer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={formData.programId}
                            onChange={(e) => setFormData({ ...formData, programId: e.target.value, year: 'Grade 1' })}
                            disabled={programs.length === 1}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Select Program</option>
                            {programs.map(prog => (
                                <option key={prog.id} value={prog.id}>{prog.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grade / Year <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select
                                    required
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                                >
                                    {gradeOptions.map((grade) => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code <span className="text-xs text-gray-400">(Optional)</span></label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. SUB-01"
                            />
                        </div>
                    </div>

                    {/* DYNAMIC TEACHER SELECTION */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Teacher <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <select
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-gray-600"
                            >
                                <option value="">-- No Teacher Assigned --</option>
                                {/* Database-ல் இருந்து வரும் ஆசிரியர்கள் (Updated Logic) */}
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.role || 'Teacher'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white bg-blue-600 font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                        >
                            {isEditing ? 'Update Subject' : 'Add Subject'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SubjectModal;