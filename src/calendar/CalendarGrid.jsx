import { Plus, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarGrid = ({ year, month, days, blanks, nextMonthBlanks, getEventsForDay, handleDayClick, onDateChange }) => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Generate year range (e.g., 2020 - 2030)
    const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

    const handleMonthChange = (e) => {
        onDateChange(year, parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        onDateChange(parseInt(e.target.value), month);
    };

    const handlePrevMonth = () => {
        if (month === 0) onDateChange(year - 1, 11);
        else onDateChange(year, month - 1);
    };

    const handleNextMonth = () => {
        if (month === 11) onDateChange(year + 1, 0);
        else onDateChange(year, month + 1);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[600px]">

            {/* GRID HEADER WITH FILTERS */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                    {monthNames[month]} {year}
                </h3>

                <div className="flex items-center gap-3">
                    {/* Month Dropdown */}
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {monthNames.map((name, index) => (
                            <option key={index} value={index}>{name}</option>
                        ))}
                    </select>

                    {/* Year Dropdown */}
                    <select
                        value={year}
                        onChange={handleYearChange}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    {/* Navigation Arrows */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 ml-2">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 hover:text-blue-600 transition-colors border-r border-gray-200">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/30">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {/* Previous Month Blanks */}
                {blanks.map((_, i) => (
                    <div key={`blank-prev-${i}`} className="min-h-[140px] border-b border-r border-gray-100 bg-gray-50/20"></div>
                ))}

                {/* Active Days */}
                {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    // Check if this day is today (assuming simplified "today" check for demo)
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                    return (
                        <div key={day} onClick={() => handleDayClick(day)}
                            className={`min-h-[140px] p-3 border-b border-r border-gray-100 relative group cursor-pointer transition-all hover:bg-gray-50 ${isToday ? "bg-blue-50/30" : "bg-white"}`}>

                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-base font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700'}`}>
                                    {day}
                                </span>
                                <button className="text-gray-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16} /></button>
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

                {/* Next Month Blanks */}
                {nextMonthBlanks.map((_, i) => (
                    <div key={`blank-next-${i}`} className="min-h-[140px] border-b border-r border-gray-100 bg-gray-50/20"></div>
                ))}
            </div>
        </div>
    );
};

export default CalendarGrid;