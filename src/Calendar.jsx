import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Bell,
    Menu,
    Clock,
    MapPin
} from 'lucide-react';
import Sidebar from './Sidebar';

const Calendar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Simple helper to get days in month
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Create array of empty slots for previous month days
    const blanks = Array(firstDay).fill(null);

    // Create array of days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Month names
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    // Mock Events Data
    const events = [
        { day: 5, title: "Staff Meeting", time: "10:00 AM", type: "meeting" },
        { day: 12, title: "Semester Exams", time: "09:00 AM", type: "exam" },
        { day: 15, title: "Application Deadline", time: "11:59 PM", type: "deadline" },
        { day: 24, title: "Sports Day", time: "08:00 AM", type: "event" },
    ];

    const getEventForDay = (day) => events.find(e => e.day === day);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">

            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                {/* HEADER (Same as Dashboard) */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">College Calendar</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search events..." className="pl-10 pr-4 py-2 bg-gray-100 focus:bg-white border border-transparent focus:border-[#EB8A33] rounded-lg text-sm w-64 transition-all outline-none" />
                        </div>
                        <button className="relative p-2.5 bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-[#EB8A33] rounded-full transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EB8A33] to-orange-400 p-0.5 shadow-md">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#EB8A33] font-bold">A</div>
                        </div>
                    </div>
                </header>

                {/* CALENDAR CONTENT */}
                <main className="p-8 flex-1 overflow-y-auto">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full md:h-auto min-h-[600px]">

                        {/* Calendar Toolbar */}
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {monthNames[month]} <span className="text-gray-400 font-medium">{year}</span>
                                </h2>
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 bg-[#EB8A33] hover:bg-[#d67b2b] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-200 transition-all active:scale-95">
                                <Plus size={20} />
                                Add Event
                            </button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 flex-1 auto-rows-fr">

                            {/* Empty slots for previous month */}
                            {blanks.map((_, i) => (
                                <div key={`blank-${i}`} className="min-h-[120px] bg-gray-50/30 border-b border-r border-gray-100 p-3"></div>
                            ))}

                            {/* Days */}
                            {days.map(day => {
                                const event = getEventForDay(day);
                                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                return (
                                    <div key={day} className={`
                    min-h-[120px] border-b border-r border-gray-100 p-3 transition-colors hover:bg-orange-50/10 relative group
                    ${isToday ? "bg-orange-50/30" : "bg-white"}
                  `}>
                                        <span className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                      ${isToday ? "bg-[#EB8A33] text-white shadow-md" : "text-gray-700 group-hover:text-[#EB8A33]"}
                    `}>
                                            {day}
                                        </span>

                                        {event && (
                                            <div className={`mt-2 p-2 rounded-lg border text-xs cursor-pointer hover:opacity-90 transition-opacity
                        ${event.type === 'meeting' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                    event.type === 'exam' ? 'bg-red-50 border-red-100 text-red-700' :
                                                        event.type === 'deadline' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                            'bg-green-50 border-green-100 text-green-700'}
                      `}>
                                                <p className="font-semibold truncate">{event.title}</p>
                                                <div className="flex items-center gap-1 mt-1 opacity-80">
                                                    <Clock size={10} />
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Calendar;