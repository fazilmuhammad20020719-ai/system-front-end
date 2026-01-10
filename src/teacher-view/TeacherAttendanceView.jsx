import { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon
} from 'lucide-react';

const TeacherAttendanceView = ({ stats }) => {
    // State for the Calendar
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Attendance Data (Teacher Specific)
    const attendanceData = {
        '2025-01-01': 'Present',
        '2025-01-02': 'Present',
        '2025-01-03': 'Absent', // e.g., Medical Leave
        '2025-01-06': 'Present',
        '2025-01-07': 'Present',
        '2025-01-08': 'Present',

        '2025-01-10': 'Present',
        '2025-01-12': 'Present',
        '2025-01-13': 'Present',
        '2025-01-14': 'Holiday',
        '2025-01-15': 'Present',
    };

    // Calendar Helper Functions (Identical logic)
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleMonthChange = (e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    const handleYearChange = (e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1));

    // Generate Calendar Grid
    const renderCalendarDays = () => {
        const days = [];

        // Empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 md:h-14"></div>);
        }

        // Actual Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = attendanceData[dateString];

            let statusColor = "bg-gray-50 text-gray-400 border-gray-100";
            let tooltip = "No Data";

            if (status === 'Present') {
                statusColor = "bg-white text-green-700 border-green-500 font-bold border";
                tooltip = "Present";
            } else if (status === 'Absent') {
                statusColor = "bg-red-100 text-red-700 border-red-200 font-bold";
                tooltip = "Absent";
            } else if (status === 'Holiday') {
                statusColor = "bg-blue-50 text-blue-600 border-blue-100 font-medium";
                tooltip = "Holiday";
            }

            days.push(
                <div
                    key={day}
                    className={`
                        h-10 md:h-14 rounded-lg border flex flex-col items-center justify-center text-xs sm:text-sm cursor-default relative group transition-all
                        ${statusColor}
                    `}
                >
                    <span>{day}</span>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-max">
                        <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            {tooltip}
                        </div>
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT SIDE: Stats Cards */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500 text-sm font-medium">Monthly Attendance</p>
                    <h2 className="text-4xl font-bold text-[#EB8A33] mt-2">
                        {stats ? Math.round((stats.present / stats.total) * 100) : 0}%
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Total Working Days: {stats?.total || 0}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle size={16} />
                        </div>
                        Present
                    </span>
                    <span className="font-bold text-gray-800 text-lg">{stats?.present || 0} Days</span>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                    <span className="text-red-700 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm">
                            <XCircle size={16} />
                        </div>
                        Absent
                    </span>
                    <span className="font-bold text-red-800 text-lg">{stats?.absent || 0} Days</span>
                </div>
            </div>

            {/* RIGHT SIDE: Interactive Calendar */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* Calendar Header with Date Menu */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="text-[#EB8A33]" size={20} />
                        <h3 className="font-bold text-gray-800">Attendance Log</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={month}
                            onChange={handleMonthChange}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#EB8A33] cursor-pointer hover:bg-white transition-colors"
                        >
                            {monthNames.map((name, index) => (
                                <option key={index} value={index}>{name}</option>
                            ))}
                        </select>

                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#EB8A33] cursor-pointer hover:bg-white transition-colors"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 ml-1">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:text-[#EB8A33] transition-colors border-r border-gray-200 rounded-l-lg">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:text-[#EB8A33] transition-colors rounded-r-lg">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 justify-center">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-white border border-green-500 rounded"></span> Present</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span> Absent</div>

                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-50 border border-blue-100 rounded"></span> Holiday</div>
                </div>

            </div>
        </div>
    );
};

export default TeacherAttendanceView;
