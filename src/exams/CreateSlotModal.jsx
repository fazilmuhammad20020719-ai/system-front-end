// src/exams/CreateSlotModal.jsx
import { useState, useEffect } from 'react';
import { X, Save, Layers, Calendar, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

const CreateSlotModal = ({ isOpen, onClose, onSave, slot = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        programId: '',
        startDate: '',
        endDate: ''
    });
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchPrograms = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/programs`);
                    if (res.ok) setPrograms(await res.json());
                } catch (err) {
                    console.error("Error fetching programs:", err);
                }
            };
            fetchPrograms();

            if (slot) {
                // Populate form for editing
                setFormData({
                    name: slot.name,
                    programId: slot.program_id,
                    startDate: slot.start_date ? new Date(slot.start_date).toISOString().split('T')[0] : '',
                    endDate: slot.end_date ? new Date(slot.end_date).toISOString().split('T')[0] : ''
                });
            } else {
                // Reset for new slot
                setFormData({ name: '', programId: '', startDate: '', endDate: '' });
            }
        }
    }, [isOpen, slot]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!formData.name || !formData.programId || !formData.startDate || !formData.endDate) {
            alert("Please fill all fields.");
            return;
        }
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert("End Date must be after Start Date");
            return;
        }

        setLoading(true);
        try {
            const url = slot ? `${API_URL}/api/slots/${slot.id}` : `${API_URL}/api/slots`;
            const method = slot ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSave();
                onClose();
            } else {
                alert(`Failed to ${slot ? 'update' : 'create'} slot.`);
            }
        } catch (err) {
            console.error(err);
            alert(`Error ${slot ? 'updating' : 'creating'} slot.`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">{slot ? 'Edit Examination Slot' : 'Add Examination Slot'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Slot Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Final Exams 2024"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Program</label>
                        <div className="relative">
                            <Layers size={16} className="absolute left-3 top-2.5 text-gray-400" />
                            <select
                                name="programId"
                                value={formData.programId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                            >
                                <option value="">Select Program</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm">
                        {loading ? 'Saving...' : (slot ? 'Update Slot' : 'Save Slot')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSlotModal;
