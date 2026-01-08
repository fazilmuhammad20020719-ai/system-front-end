import { useState } from 'react';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import CalendarStats from './calendar/CalendarStats';
import CalendarFilters from './calendar/CalendarFilters';
import CalendarGrid from './calendar/CalendarGrid';
import EventModal from './calendar/EventModal';

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
    const [selectedDay, setSelectedDay] = useState(null);

    // --- CALENDAR LOGIC ---
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const totalSlots = firstDay + daysInMonth;
    const remainingSlots = 7 - (totalSlots % 7);
    const nextMonthBlanks = remainingSlots < 7 ? Array.from({ length: remainingSlots }, (_, i) => i) : [];

    // --- HANDLERS ---
    const handleDayClick = (day) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (newNoteData) => {
        // Map the custom labels back to internal types
        const typeMap = {
            'High (Urgent)': 'urgent',
            'Medium': 'warning',
            'Normal': 'success'
        };

        const newEvent = {
            id: Date.now(),
            day: selectedDay,
            title: newNoteData.text,
            fullText: newNoteData.text,
            type: typeMap[newNoteData.priority] || 'success',
            hasAttachment: !!newNoteData.file
        };

        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const getEventsForDay = (day) => events.filter(e => e.day === day);

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

                    {/* Stats Component */}
                    <CalendarStats events={events} />

                    {/* Filters Component */}
                    <CalendarFilters />
                </header>

                {/* CALENDAR GRID */}
                <main className="flex-1 px-8 pb-8 overflow-y-auto">
                    <CalendarGrid
                        blanks={blanks}
                        days={days}
                        nextMonthBlanks={nextMonthBlanks}
                        getEventsForDay={getEventsForDay}
                        handleDayClick={handleDayClick}
                    />
                </main>
            </div>

            {/* MODAL POPUP */}
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                dayEvents={selectedDay ? getEventsForDay(selectedDay) : []}
                onSave={handleSaveEvent}
            />
        </div>
    );
};

export default Calendar;