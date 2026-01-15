import { useState, useEffect } from 'react';
import { API_URL } from './config';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import CalendarStats from './calendar/CalendarStats';
import CalendarFilters from './calendar/CalendarFilters';
import CalendarGrid from './calendar/CalendarGrid';
import EventModal from './calendar/EventModal';
import CalendarHeader from './calendar/CalendarHeader';

const Calendar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 25));

    // --- STATE FOR MODAL & EVENTS ---
    const [events, setEvents] = useState([]); // Dynamic state

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    // FETCH EVENTS FROM API
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/api/calendar/events`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

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

    // Remaining slots logic...
    const totalSlots = firstDay + daysInMonth;
    const remainingSlots = 7 - (totalSlots % 7);
    const nextMonthBlanks = remainingSlots < 7 ? Array.from({ length: remainingSlots }, (_, i) => i) : [];

    // --- HANDLERS ---
    const handleDayClick = (day) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    // HELPER: Map UI Priority Labels to Internal Types
    const typeMap = {
        'High (Urgent)': 'urgent',
        'Medium': 'warning',
        'Normal': 'success'
    };

    const normalizeType = (typeLabel) => typeMap[typeLabel] || 'success';

    // 1. ADD NEW EVENT
    const handleSaveEvent = async (newNoteData) => {
        try {
            const response = await fetch(`${API_URL}/api/calendar/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchEvents(); // Refresh from server
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    // 2. DELETE EVENT
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`${API_URL}/api/calendar/events/${eventId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Optimistic update or refetch
                setEvents(events.filter(e => e.id !== eventId));
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // 3. UPDATE EVENT
    const handleUpdateEvent = async (id, updatedData) => {
        try {
            const payload = {
                title: updatedData.text,
                description: updatedData.text,
                type: normalizeType(updatedData.priority)
            };

            const response = await fetch(`${API_URL}/api/calendar/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchEvents(); // Refresh
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const getEventsForDay = (day) => events.filter(e => e.day === day);

    return (
        <div className="flex h-screen bg-[#F4F5F7] font-sans overflow-hidden relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>

                {/* HEADER */}
                <CalendarHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    monthYear={`${monthNames[month]} ${year}`}
                />

                <div className="px-8 pt-6 pb-2 bg-[#F4F5F7]">
                    <CalendarStats events={events} />
                    <CalendarFilters />
                </div>

                {/* CALENDAR GRID */}
                <main className="flex-1 px-8 pb-8 overflow-y-auto">
                    <CalendarGrid
                        year={year} month={month} // Added missing props
                        blanks={blanks}
                        days={days}
                        nextMonthBlanks={nextMonthBlanks}
                        getEventsForDay={getEventsForDay}
                        handleDayClick={handleDayClick}
                        onDateChange={(y, m) => setCurrentDate(new Date(y, m, 1))} // Handle nav
                    />
                </main>
            </div>

            {/* MODAL POPUP - Updated Props */}
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                dayEvents={selectedDay ? getEventsForDay(selectedDay) : []}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent} // Pass Delete Handler
                onUpdate={handleUpdateEvent} // Pass Update Handler
            />
        </div>
    );
};

export default Calendar;