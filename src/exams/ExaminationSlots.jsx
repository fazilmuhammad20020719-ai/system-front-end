// src/exams/ExaminationSlots.jsx
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, ChevronRight, BookOpen, Trash2, Edit2 } from 'lucide-react';
import { API_URL } from '../config';
import CreateSlotModal from './CreateSlotModal';
import CreateExamModal from './CreateExamModal';

const ExaminationSlots = () => {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null); // If null, show list. If set, show details.
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    // For Exam Creation inside a slot
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [slotExams, setSlotExams] = useState([]);

    const fetchSlots = async () => {
        try {
            const res = await fetch(`${API_URL}/api/slots`);
            if (res.ok) setSlots(await res.json());
        } catch (err) {
            console.error("Error fetching slots:", err);
        }
    };

    const fetchSlotExams = async (slotId) => {
        try {
            const res = await fetch(`${API_URL}/api/exams?slotId=${slotId}`);
            if (res.ok) setSlotExams(await res.json());
        } catch (err) {
            console.error("Error fetching exams:", err);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    useEffect(() => {
        if (selectedSlot) {
            fetchSlotExams(selectedSlot.id);
        }
    }, [selectedSlot]);

    const handleDeleteSlot = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this slot and all its exams?")) return;
        try {
            await fetch(`${API_URL}/api/slots/${id}`, { method: 'DELETE' });
            fetchSlots();
            if (selectedSlot?.id === id) setSelectedSlot(null);
        } catch (err) {
            console.error(err);
        }
    }

    const handleEditSlot = (e, slot) => {
        e.stopPropagation();
        setEditingSlot(slot);
        setIsSlotModalOpen(true);
    };

    // --- RENDER LIST OF SLOTS ---
    if (!selectedSlot) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-700">Examination Sessions</h2>
                    <button
                        onClick={() => { setEditingSlot(null); setIsSlotModalOpen(true); }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
                    >
                        <Plus size={16} /> Add Examination Slot
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {slots.map(slot => (
                        <div
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${slot.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                                        slot.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {slot.status}
                                    </span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleEditSlot(e, slot)} className="text-slate-300 hover:text-green-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => handleDeleteSlot(e, slot.id)} className="text-slate-300 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{slot.name}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
                                    <BookOpen size={14} /> {slot.program_name}
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(slot.start_date).toLocaleDateString()} - {new Date(slot.end_date).toLocaleDateString()}
                                </span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                            </div>
                        </div>
                    ))}
                    {slots.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            No examination slots found. Create one to get started.
                        </div>
                    )}
                </div>

                <CreateSlotModal
                    isOpen={isSlotModalOpen}
                    onClose={() => { setIsSlotModalOpen(false); setEditingSlot(null); }}
                    onSave={fetchSlots}
                    slot={editingSlot}
                />
            </div>
        );
    }
    // --- RENDER SLOT DETAILS (Exams List inside Slot) ---
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <button onClick={() => setSelectedSlot(null)} className="hover:text-green-600 font-bold">Examinations</button>
                <ChevronRight size={14} />
                <span className="font-bold text-slate-800">{selectedSlot.name}</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedSlot.name}</h2>
                    <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1.5"><BookOpen size={16} /> {selectedSlot.program_name}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(selectedSlot.start_date).toLocaleDateString()} - {new Date(selectedSlot.end_date).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedSlot.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>{selectedSlot.status}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsExamModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} /> Create Examination
                </button>
            </div>

            {/* List of Exams in this Slot */}
            <div className="grid grid-cols-1 gap-4">
                {slotExams.map(exam => (
                    <div key={exam.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col gap-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold border border-green-100 shrink-0">
                                    <span className="text-xs uppercase">{new Date(exam.exam_date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg leading-none">{new Date(exam.exam_date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-lg">{exam.title}</h4>
                                        {exam.parts && exam.parts.length > 1 && (
                                            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                                Multi-Part
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">{exam.subject_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <div className="text-right text-sm text-slate-500 mr-4">
                                    <p className="font-bold text-slate-700">{exam.total_marks} Marks</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {exam.status}
                                </span>
                            </div>
                        </div>

                        {/* Parts List */}
                        {exam.parts && exam.parts.length > 0 && (
                            <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 border border-slate-100">
                                {exam.parts.map((part, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-100">
                                        <div className="bg-slate-100 text-slate-500 w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0">
                                            P{idx + 1}
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold text-slate-700">{part.name}</p>
                                            <p className="text-slate-500">
                                                {new Date(part.exam_date).toLocaleDateString()} • {part.start_time.slice(0, 5)} - {part.end_time.slice(0, 5)}
                                            </p>
                                            <p className="text-slate-400">{part.venue}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {slotExams.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500">
                        No exams scheduled in this slot yet.
                    </div>
                )}
            </div>

            <CreateExamModal
                isOpen={isExamModalOpen}
                onClose={() => setIsExamModalOpen(false)}
                onSave={() => fetchSlotExams(selectedSlot.id)}
                slot={selectedSlot} // Pass the slot context!
            />
        </div>
    );
};

export default ExaminationSlots;
