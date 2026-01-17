import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProgramModal = ({ isOpen, onClose, onSubmit, isEditing, formData, setFormData }) => {

    const [teachers, setTeachers] = useState([]); // State for teachers

    useEffect(() => {
        // Fetch teachers for Head of Dept dropdown
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/teachers');
                if (response.ok) {
                    const data = await response.json();
                    setTeachers(data);
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };
        if (isOpen) {
            fetchTeachers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Program' : 'Add New Program'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Program Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                            placeholder="e.g. Hifz Class"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Head of Dept</label>
                            <select
                                value={formData.head || ""}
                                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                            >
                                <option value="">Select Head (Optional)</option>
                                {teachers.map((t) => (
                                    <option key={t.id} value={t.name}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Duration (Years)</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(formData.duration) || 1;
                                        if (current > 1) setFormData({ ...formData, duration: `${current - 1} Years` });
                                    }}
                                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 text-gray-600 transition-colors font-bold flex-shrink-0"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    readOnly
                                    value={formData.duration || "1 Years"}
                                    className="flex-1 min-w-0 text-center py-2 focus:outline-none text-gray-700 font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(formData.duration) || 0;
                                        setFormData({ ...formData, duration: `${current + 1} Years` });
                                    }}
                                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 text-gray-600 transition-colors font-bold flex-shrink-0"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fee Structure</label>
                            <select
                                value={formData.fee}
                                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                            >
                                <option value="">Select Fees</option>
                                <option value="Free">Free</option>
                                <option value="Monthly">Monthly</option>
                                <option value="One-time">One-time</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a]">Save Program</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgramModal;
