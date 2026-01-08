import { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronDown } from 'lucide-react';

const EventModal = ({ isOpen, onClose, selectedDay, dayEvents, onSave }) => {
    const [newNote, setNewNote] = useState({ priority: 'Normal', text: '', file: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const handleSaveClick = () => {
        if (!newNote.text) return;
        onSave(newNote);
        setNewNote({ priority: 'Normal', text: '', file: null }); // Reset form
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] transform transition-all">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-500" />
                        Manage Events
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">

                    {/* Existing Notes Section */}
                    {dayEvents.length > 0 && (
                        <div className="space-y-3">
                            {dayEvents.map((event) => (
                                <div key={event.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                                    <p className={`text-[10px] font-bold uppercase mb-1 ${event.type === 'urgent' ? 'text-orange-500' :
                                        event.type === 'warning' ? 'text-orange-500' : 'text-emerald-500'
                                        }`}>
                                        {event.type === 'warning' ? 'MEDIUM PRIORITY' : event.type === 'urgent' ? 'HIGH PRIORITY' : 'NORMAL PRIORITY'}
                                    </p>
                                    <p className="text-sm text-gray-700">{event.fullText}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Note Section */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">ADD NEW NOTE</p>

                        {/* CUSTOM DROPDOWN IMPLEMENTATION */}
                        <div className="relative">
                            {/* Dropdown Trigger */}
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(newNote.priority)} shadow-sm`}></span>
                                    <span>{newNote.priority}</span>
                                </div>
                                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-100">
                                    {priorityOptions.map((opt) => (
                                        <div
                                            key={opt.label}
                                            onClick={() => {
                                                setNewNote({ ...newNote, priority: opt.label });
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-4 py-2.5 text-sm flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-600 hover:text-white group"
                                        >
                                            <span className={`w-3 h-3 rounded-full ${opt.color} ring-1 ring-white/20 group-hover:ring-white`}></span>
                                            <span>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Text Area */}
                        <textarea
                            placeholder="Type event details..."
                            value={newNote.text}
                            onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 min-h-[100px] resize-none"
                        ></textarea>

                        {/* File Attachment Input */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-bold text-gray-500 text-xs">Attach File (Drive)</span>
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1 rounded text-xs transition-colors text-gray-700 font-medium">
                                Choose File
                                <input type="file" className="hidden" onChange={(e) => setNewNote({ ...newNote, file: e.target.files[0] })} />
                            </label>
                            <span className="text-xs text-gray-400">
                                {newNote.file ? newNote.file.name : 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveClick}
                        className="w-full py-3 bg-[#F97316] hover:bg-[#ea660c] text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                        Save Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
