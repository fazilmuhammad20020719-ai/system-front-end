import React, { useState, useEffect } from 'react';
import { X, BookOpen, Edit2 } from 'lucide-react';

const SubjectModal = ({ isOpen, onClose, programs, onSave, initialData = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        programId: '',
        year: 'Grade 1',
        name: ''
    });

    useEffect(() => {
        if (isOpen && isEditing && initialData) {
            setFormData({
                programId: initialData.programId || '', // Assuming initialData has programId if needed, or we might need to pass current program ID if it's fixed in ViewProgram
                year: initialData.year || 'Grade 1',
                name: initialData.name || ''
            });
        } else if (isOpen && !isEditing) {
            // Reset for Add mode
            setFormData({ programId: '', year: 'Grade 1', name: '' });
        }
    }, [isOpen, isEditing, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isEditing ? 'Edit Subject' : 'Add New Subject'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Program Selection - specific logic might be needed if called from ViewProgram where program is fixed */}
                    {programs && programs.length > 0 && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
                            <select
                                required
                                value={formData.programId}
                                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                disabled={isEditing && !programs} // If editing and no programs passed (e.g. from ViewProgram), maybe hide or disable?
                            >
                                <option value="">Choose a Program</option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Year Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Academic Grade</label>
                        <select
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                        >
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 2">Grade 2</option>
                            <option value="Grade 3">Grade 3</option>
                            <option value="Grade 4">Grade 4</option>
                            <option value="Grade 5">Grade 5</option>
                        </select>
                    </div>

                    {/* Subject Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subject Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Fiqh, Mathematics"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                        />
                    </div>

                    <button type="submit" className="w-full py-2.5 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a] flex items-center justify-center gap-2 mt-2">
                        {isEditing ? <Edit2 size={18} /> : <BookOpen size={18} />}
                        {isEditing ? 'Update Subject' : 'Save Subject'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubjectModal;