import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X, ChevronDown, Trash2, Edit2, CornerUpLeft } from 'lucide-react';

const EventModal = ({ isOpen, onClose, selectedDay, dayEvents, onSave, onDelete, onUpdate }) => {

    // Form State
    const [noteForm, setNoteForm] = useState({ priority: 'Normal', text: '', file: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Editing State (Ethai edit seigirom endru therinthu kolla)
    const [editingId, setEditingId] = useState(null);

    // Modal open aagumbothu form-ai reset seiyya
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, selectedDay]);

    if (!isOpen) return null;

    // DROPDOWN OPTIONS CONFIG
    const priorityOptions = [
        { label: 'Normal', color: 'bg-emerald-400' },
        { label: 'Medium', color: 'bg-orange-500' },
        { label: 'High (Urgent)', color: 'bg-red-500' }
    ];

    const getPriorityColor = (label) => {
        const option = priorityOptions.find(opt => opt.label === label);
        return option ? option.color : 'bg-gray-400';
    };

    const resetForm = () => {
        setNoteForm({ priority: 'Normal', text: '', file: null });
        setEditingId(null);
        setIsDropdownOpen(false);
    };

    // EDIT BUTTON CLICK
    const handleEditClick = (event) => {
        // Map internal types back to UI labels
        const reverseTypeMap = {
            'urgent': 'High (Urgent)',
            'warning': 'Medium',
            'success': 'Normal'
        };

        setEditingId(event.id);
        setNoteForm({
            priority: reverseTypeMap[event.type] || 'Normal',
            text: event.fullText,
            file: null // File edit logic complex, keeping null for now
        });
    };

    // SAVE / UPDATE BUTTON CLICK
    const handleSubmit = () => {
        if (!noteForm.text) return;

        if (editingId) {
            // Update Existing
            onUpdate(editingId, noteForm);
        } else {
            // Create New
            onSave(noteForm);
        }
        resetForm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] transform transition-all animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-500" />
                        {selectedDay ? `Events for Day ${selectedDay}` : 'Manage Events'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">

                    {/* 1. Existing Notes List */}
                    {dayEvents.length > 0 && (
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {dayEvents.map((event) => (
                                <div key={event.id}
                                    className={`group border border-gray-200 rounded-lg p-3 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all ${editingId === event.id ? 'ring-2 ring-blue-500 border-transparent bg-blue-50/50' : ''}`}>

                                    <div className="flex justify-between items-start">
                                        {/* Content */}
                                        <div className="flex-1">
                                            <p className={`text-[10px] font-bold uppercase mb-1 ${event.type === 'urgent' ? 'text-red-500' :
                                                    event.type === 'warning' ? 'text-orange-500' : 'text-emerald-500'
                                                }`}>
                                                {event.type === 'warning' ? 'MEDIUM' : event.type === 'urgent' ? 'URGENT' : 'NORMAL'}
                                            </p>
                                            <p className="text-sm text-gray-700 leading-snug">{event.fullText}</p>
                                        </div>

                                        {/* Action Buttons (Show on Hover or if Editing) */}
                                        <div className="flex items-center gap-1 ml-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditClick(event)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(event.id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 2. Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* 3. Add / Edit Form */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                {editingId ? 'EDITING NOTE...' : 'ADD NEW NOTE'}
                            </p>
                            {editingId && (
                                <button onClick={resetForm} className="text-xs font-medium text-red-500 flex items-center gap-1 hover:underline">
                                    <CornerUpLeft size={12} /> Cancel Edit
                                </button>
                            )}
                        </div>

                        {/* Priority Dropdown */}
                        <div className="relative">
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(noteForm.priority)} shadow-sm`}></span>
                                    <span>{noteForm.priority}</span>
                                </div>
                                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                                    {priorityOptions.map((opt) => (
                                        <div
                                            key={opt.label}
                                            onClick={() => {
                                                setNoteForm({ ...noteForm, priority: opt.label });
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-4 py-2.5 text-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                                        >
                                            <span className={`w-3 h-3 rounded-full ${opt.color}`}></span>
                                            <span>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Text Area */}
                        <textarea
                            placeholder="Type event details here..."
                            value={noteForm.text}
                            onChange={(e) => setNoteForm({ ...noteForm, text: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 min-h-[80px] resize-none"
                        ></textarea>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#F97316] hover:bg-[#ea660c]'
                                }`}
                        >
                            {editingId ? 'Update Changes' : 'Save Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;