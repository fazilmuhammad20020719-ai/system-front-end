import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    BookOpen,
    User,
    Clock,
    LayoutList,
} from 'lucide-react';
import { API_URL } from '../config';

const ViewStudentAttendance = () => {
    const { id } = useParams();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState({});
    const [classRecords, setClassRecords] = useState([]); // flat list for class view
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('main'); // 'main' or 'class'

    // Calendar Helpers
    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    // Fetch
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!id) return;
            setLoading(true);
            // Clear stale data on mode switch
            setAttendanceData({});
            setClassRecords([]);
            try {
                const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

                if (viewMode === 'main') {
                    const res = await fetch(`${API_URL}/api/students/${id}/attendance?startDate=${startDate}&endDate=${endDate}`);
                    if (res.ok) {
                        const data = await res.json();
                        const dataMap = {};
                        data.forEach(r => { dataMap[r.date] = r.status; });
                        setAttendanceData(dataMap);
                    }
                } else {
                    const res = await fetch(`${API_URL}/api/students/${id}/class-attendance?startDate=${startDate}&endDate=${endDate}`);
                    if (res.ok) {
                        const data = await res.json();
                        setClassRecords(data); // keep flat array for the list view
                        // also build map for calendar dots
                        const dataMap = {};
                        data.forEach(r => {
                            if (!dataMap[r.date]) dataMap[r.date] = [];
                            dataMap[r.date].push(r);
                        });
                        setAttendanceData(dataMap);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch attendance:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [id, month, year, daysInMonth, viewMode]);

    // Stats
    const stats = useMemo(() => {
        let present = 0, absent = 0, holidays = 0;
        if (viewMode === 'main') {
            Object.values(attendanceData).forEach(s => {
                if (s === 'Present') present++;
                else if (s === 'Absent') absent++;
                else if (s === 'Holiday') holidays++;
            });
        } else {
            classRecords.forEach(r => {
                if (r.status === 'Present') present++;
                else if (r.status === 'Absent') absent++;
                else if (r.status === 'Holiday') holidays++;
            });
        }
        const total = present + absent;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        return { present, absent, holidays, total, rate };
    }, [attendanceData, classRecords, viewMode]);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleMonthChange = e => setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    const handleYearChange = e => setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    const handleModeSwitch = (mode) => {
        if (mode !== viewMode) {
            setViewMode(mode);
            setAttendanceData({}); // Atomically clear data to prevent type-mismatch crashes on render
        }
    };

    // Format helpers
    const fmt12 = t => {
        if (!t) return '';
        const [h, m] = t.split(':');
        const hr = parseInt(h);
        return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    };
    const fmtDate = d => {
        if (!d) return '';
        const dt = new Date(d + 'T00:00:00');
        return dt.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Calendar grid
    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`e-${i}`} className="h-10 md:h-14" />);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const records = attendanceData[ds];
            let cls = 'bg-gray-50 text-gray-400 border-gray-100';
            let tip = 'No Data';

            if (viewMode === 'main') {
                if (records === 'Present') { cls = 'bg-green-100 text-green-700 border-green-200 font-bold border'; tip = 'Present'; }
                else if (records === 'Absent') { cls = 'bg-red-100 text-red-700 border-red-200 font-bold'; tip = 'Absent'; }
                else if (records === 'Holiday') { cls = 'bg-blue-50 text-blue-600 border-blue-100 font-medium'; tip = 'Holiday'; }
            } else {
                if (Array.isArray(records) && records.length > 0) {
                    const hasAbsent = records.some(r => r.status === 'Absent');
                    const hasPresent = records.some(r => r.status === 'Present');
                    if (hasAbsent && hasPresent) cls = 'bg-orange-100 text-orange-700 border-orange-200 font-bold border';
                    else if (hasAbsent) cls = 'bg-red-100 text-red-700 border-red-200 font-bold border';
                    else if (hasPresent) cls = 'bg-green-100 text-green-700 border-green-200 font-bold border';
                    else cls = 'bg-blue-50 text-blue-600 border-blue-100 font-medium';
                    tip = records.map(r => `${r.subject_name || 'Class'} (${fmt12(r.start_time)}): ${r.status}`).join(' · ');
                }
            }

            days.push(
                <div key={day}
                    className={`h-10 md:h-14 rounded-lg border flex flex-col items-center justify-center text-xs sm:text-sm cursor-default relative group transition-all ${cls}`}>
                    <span>{day}</span>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-max max-w-[220px] pointer-events-none">
                        <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-normal text-center">{tip}</div>
                    </div>
                </div>
            );
        }
        return days;
    };

    // Grouped class records by date for the list view
    const groupedByDate = useMemo(() => {
        const groups = {};
        classRecords.forEach(r => {
            if (!groups[r.date]) groups[r.date] = [];
            groups[r.date].push(r);
        });
        // Sort dates descending
        return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
    }, [classRecords]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Stats ── */}
            <div className="lg:col-span-1 space-y-4">
                {/* Rate donut */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500 text-sm font-medium">{monthNames[month]} Attendance</p>
                    <div className="flex items-center justify-center my-3">
                        <div className="relative w-28 h-28">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                                <circle cx="18" cy="18" r="15.9" fill="none"
                                    stroke={stats.rate >= 75 ? '#16a34a' : '#f97316'}
                                    strokeWidth="3.5"
                                    strokeDasharray={`${stats.rate} ${100 - stats.rate}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 0.7s ease' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-bold ${stats.rate >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                                    {loading ? '…' : `${stats.rate}%`}
                                </span>
                                <span className="text-[10px] text-gray-400">Rate</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        {viewMode === 'main' ? `Recorded Days: ${stats.total}` : `Total Sessions: ${stats.total}`}
                    </p>
                </div>

                {/* Present */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                    <span className="text-green-700 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                            <CheckCircle size={16} />
                        </div>
                        Present
                    </span>
                    <span className="font-bold text-green-800 text-lg">
                        {stats.present} {viewMode === 'main' ? 'Days' : 'Sessions'}
                    </span>
                </div>

                {/* Absent */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                    <span className="text-red-700 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm">
                            <XCircle size={16} />
                        </div>
                        Absent
                    </span>
                    <span className="font-bold text-red-800 text-lg">
                        {stats.absent} {viewMode === 'main' ? 'Days' : 'Sessions'}
                    </span>
                </div>

                {/* Bar chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daily Breakdown</p>
                    <div className="flex items-end gap-[2px] h-20">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const records = attendanceData[ds];
                            let barColor = 'bg-gray-100';
                            let tip = 'No data';
                            let hasData = false;

                            if (viewMode === 'main') {
                                if (records === 'Present') { barColor = 'bg-green-500'; hasData = true; }
                                else if (records === 'Absent') { barColor = 'bg-red-400'; hasData = true; }
                                else if (records === 'Holiday') { barColor = 'bg-blue-300'; hasData = true; }
                                tip = (typeof records === 'string' ? records : null) || 'No data';
                            } else {
                                if (Array.isArray(records) && records.length > 0) {
                                    hasData = true;
                                    const hasAbsent = records.some(r => r.status === 'Absent');
                                    const hasPresent = records.some(r => r.status === 'Present');
                                    if (hasAbsent && hasPresent) barColor = 'bg-orange-400';
                                    else if (hasAbsent) barColor = 'bg-red-400';
                                    else if (hasPresent) barColor = 'bg-green-500';
                                    else barColor = 'bg-blue-300';
                                    tip = records.map(r => `${r.subject_name || 'Class'}: ${r.status}`).join(', ');
                                }
                            }
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center justify-end group relative">
                                    <div className={`w-full rounded-sm ${barColor} ${hasData ? 'h-full' : 'h-1'}`} style={{ minHeight: 4 }} />
                                    <div className="absolute bottom-full mb-1 hidden group-hover:flex z-10 flex-col items-center pointer-events-none w-max max-w-[160px]">
                                        <div className="bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-normal text-center">{day} – {tip}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-3 mt-2.5 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-sm inline-block" /> Present</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-sm inline-block" /> Absent</span>
                        {viewMode === 'class'
                            ? <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-sm inline-block" /> Mixed</span>
                            : <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-300 rounded-sm inline-block" /> Holiday</span>
                        }
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Calendar / List ── */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="text-green-600" size={20} />
                            <h3 className="font-bold text-gray-800">Attendance Log</h3>
                            {loading && <span className="text-xs text-gray-400 ml-1 animate-pulse">Loading…</span>}
                        </div>
                        {/* Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => handleModeSwitch('main')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'main' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                Main Attendance
                            </button>
                            <button onClick={() => handleModeSwitch('class')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'class' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                Class Attendance
                            </button>
                        </div>
                    </div>

                    {/* Month / Year selectors */}
                    <div className="flex items-center gap-2">
                        <select value={month} onChange={handleMonthChange}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#EB8A33] cursor-pointer hover:bg-white transition-colors">
                            {monthNames.map((n, i) => <option key={i} value={i}>{n}</option>)}
                        </select>
                        <select value={year} onChange={handleYearChange}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#EB8A33] cursor-pointer hover:bg-white transition-colors">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 ml-1">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:text-green-600 transition-colors border-r border-gray-200 rounded-l-lg">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:text-green-600 transition-colors rounded-r-lg">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── MAIN: Calendar grid ── */}
                {viewMode === 'main' && (
                    <>
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
                        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 justify-center">
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded" /> Present</div>
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded" /> Absent</div>
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-50 border border-blue-100 rounded" /> Holiday</div>
                        </div>
                    </>
                )}

                {/* ── CLASS: Detail list ── */}
                {viewMode === 'class' && (
                    <div className="flex-1 overflow-y-auto space-y-4" style={{ maxHeight: '520px' }}>
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-sm">Loading class records…</p>
                            </div>
                        )}

                        {!loading && groupedByDate.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <LayoutList size={40} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium">No class attendance records</p>
                                <p className="text-xs mt-1">for {monthNames[month]} {year}</p>
                            </div>
                        )}

                        {!loading && groupedByDate.map(([date, recs]) => (
                            <div key={date} className="rounded-xl border border-gray-100 overflow-hidden">
                                {/* Date header */}
                                <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                                    <CalendarIcon size={14} className="text-gray-400" />
                                    <span className="text-xs font-semibold text-gray-600">{fmtDate(date)}</span>
                                    <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                        {recs.length} session{recs.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Session rows */}
                                <div className="divide-y divide-gray-50">
                                    {recs.map((r, idx) => (
                                        <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">

                                            {/* Status indicator */}
                                            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${r.status === 'Present' ? 'bg-green-400' : r.status === 'Absent' ? 'bg-red-400' : 'bg-blue-300'}`} />

                                            {/* Subject */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <BookOpen size={12} className="text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm font-semibold text-gray-800 truncate">
                                                        {r.subject_name || 'Class Session'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    {r.teacher_name && (
                                                        <span className="flex items-center gap-1">
                                                            <User size={10} className="flex-shrink-0" />
                                                            {r.teacher_name}
                                                        </span>
                                                    )}
                                                    {r.start_time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} className="flex-shrink-0" />
                                                            {fmt12(r.start_time)}{r.end_time ? ` – ${fmt12(r.end_time)}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status badge */}
                                            {r.status === 'Present' ? (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex-shrink-0">
                                                    <CheckCircle size={11} /> Present
                                                </span>
                                            ) : r.status === 'Absent' ? (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full flex-shrink-0">
                                                    <XCircle size={11} /> Absent
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full flex-shrink-0">
                                                    {r.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ViewStudentAttendance;