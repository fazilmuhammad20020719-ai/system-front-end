import { useState, useRef, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Filter,
    Paperclip,
    X,
    Calendar as CalendarIcon,
    ChevronDown
} from 'lucide-react';
import Sidebar from './Sidebar';

const Calendar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 25)); // Dec 25, 2025

    // --- STATE FOR MODAL & EVENTS ---
    const [events, setEvents] = useState([
        { id: 1, day: 22, title: "we need collabo..", type: "urgent", fullText: "We need collaboration on the main project." },
        { id: 2, day: 24, title: "pary", type: "warning", fullText: "pary" },
        { id: 3, day: 31, title: "last day photo ..", type: "success", hasAttachment: true, fullText: "Submit last day photos." },
        { id: 4, day: 31, title: "asdfasfasf..", type: "warning", fullText: "asdfasfasf.." },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for custom dropdown
    const [selectedDay, setSelectedDay] = useState(null);
    const [newNote, setNewNote] = useState({ priority: 'Normal', text: '', file: null });

    // --- CALENDAR LOGIC ---
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const totalSlots = firstDay + daysInMonth;
    const remainingSlots = 7 - (totalSlots % 7);
    const nextMonthBlanks = remainingSlots < 7 ? Array.from({ length: remainingSlots }, (_, i) => i) : [];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // --- HANDLERS ---
    const handleDayClick = (day) => {
        setSelectedDay(day);
        setNewNote({ priority: 'Normal', text: '', file: null });
        setIsModalOpen(true);
        setIsDropdownOpen(false); // Reset dropdown
    };

    const handleSaveEvent = () => {
        if (!newNote.text) return;

        // Map the custom labels back to internal types
        const typeMap = {
            'High (Urgent)': 'urgent',
            'Medium': 'warning',
            'Normal': 'success'
        };

        const newEvent = {
            id: Date.now(),
            day: selectedDay,
            title: newNote.text,
            fullText: newNote.text,
            type: typeMap[newNote.priority] || 'success',
            hasAttachment: !!newNote.file
        };

        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const getEventsForDay = (day) => events.filter(e => e.day === day);

    // --- DROPDOWN OPTIONS CONFIG ---
    const priorityOptions = [
        { label: 'Normal', color: 'bg-emerald-400' },
        { label: 'Medium', color: 'bg-orange-500' },
        { label: 'High (Urgent)', color: 'bg-red-500' }
    ];

    const getPriorityColor = (label) => {
        const option = priorityOptions.find(opt => opt.label === label);
        return option ? option.color : 'bg-gray-400';
    };

    return (
        <div className="flex h-screen bg-[#F4F5F7] font-sans overflow-hidden relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                {/* HEADER */}
                <header className="px-8 py-6 bg-[#F4F5F7] flex-shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Executive Calendar</h2>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 font-medium border border-gray-200">
                            {monthNames[month]} {year}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Notes</h4>
                                <span className="text-xs text-gray-400">This Month</span>
                            </div>
                            <span className="text-3xl font-bold text-gray-800">{events.length}</span>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">High Priority</h4>
                                <span className="text-xs text-gray-400">Action Required</span>
                            </div>
                            <span className="text-3xl font-bold text-red-600">
                                {events.filter(e => e.type === 'urgent').length}
                            </span>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Date</h4>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">25 Dec</span>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Month Selection</label>
                            <input type="date" defaultValue="2025-12-25" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex-[2] min-w-[200px]">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Search Notes</label>
                            <input type="text" placeholder="Keyword..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                        </div>
                        <button className="px-6 py-2.5 bg-[#1E293B] hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                            <Filter size={16} /> Apply
                        </button>
                    </div>
                </header>

                {/* CALENDAR GRID */}
                <main className="flex-1 px-8 pb-8 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
                        <div className="grid grid-cols-7 border-b border-gray-100">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 auto-rows-fr">
                            {blanks.map((_, i) => <div key={`blank-prev-${i}`} className="min-h-[140px] border-b border-r border-gray-100 bg-gray-50/20"></div>)}

                            {days.map(day => {
                                const dayEvents = getEventsForDay(day);
                                const isSelected = day === 25;
                                return (
                                    <div key={day} onClick={() => handleDayClick(day)}
                                        className={`min-h-[140px] p-3 border-b border-r border-gray-100 relative group cursor-pointer transition-all hover:bg-gray-50 ${isSelected ? "border-2 border-orange-400 z-10 rounded-lg bg-white" : "bg-white"}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-base font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{day}</span>
                                            <button className="text-gray-300 hover:text-orange-500"><Plus size={16} /></button>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {dayEvents.map((event, idx) => (
                                                <div key={idx} className={`text-[11px] px-2 py-1.5 rounded-md font-medium flex items-center justify-between border-l-2 ${event.type === 'urgent' ? 'bg-red-50 text-red-800 border-red-500' :
                                                    event.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-400' :
                                                        'bg-emerald-50 text-emerald-800 border-emerald-500'
                                                    }`}>
                                                    <span className="truncate">{event.title}</span>
                                                    {event.hasAttachment && <Paperclip size={10} className="ml-1 opacity-70" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {nextMonthBlanks.map((_, i) => <div key={`blank-next-${i}`} className="min-h-[140px] border-b border-r border-gray-100 bg-gray-50/20"></div>)}
                        </div>
                    </div>
                </main>
            </div>

            {/* === MODAL POPUP === */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-[500px] transform transition-all">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CalendarIcon size={20} className="text-blue-500" />
                                Manage Events
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">

                            {/* Existing Notes Section */}
                            {getEventsForDay(selectedDay).length > 0 && (
                                <div className="space-y-3">
                                    {getEventsForDay(selectedDay).map((event) => (
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
                                                    {/* Dot changes border color on hover for visibility if needed, or stays same */}
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
                                onClick={handleSaveEvent}
                                className="w-full py-3 bg-[#F97316] hover:bg-[#ea660c] text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Calendar;