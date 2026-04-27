import { useState, useEffect } from 'react';
import { Clock, User, ChevronLeft, ChevronRight, Calendar, BookOpen } from 'lucide-react';
import { API_URL } from '../config';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getStartOfWeek = (date) => {
    const d = new Date(date);
    const diff = d.getDate() - d.getDay();
    return new Date(d.setDate(diff));
};

const STATUS_COLORS = {
    completed: 'bg-green-50 border-green-300 text-green-800',
    cancelled: 'bg-red-50 border-red-300 text-red-800 opacity-60 grayscale',
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const STATUS_BADGE = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
};

const TeacherSchedule = ({ teacher }) => {
    const teacherId = teacher?.id;

    const [schedules, setSchedules] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

    const formatDate = (d) => new Date(d).toISOString().split('T')[0];

    const getDateForDay = (dayIndex) => {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + dayIndex);
        return date;
    };

    useEffect(() => {
        if (!teacherId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const endDate = new Date(currentWeekStart);
                endDate.setDate(endDate.getDate() + 6);

                const [schData, subData, attData] = await Promise.all([
                    fetch(`${API_URL}/api/schedules`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/api/subjects`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/api/attendance?startDate=${formatDate(currentWeekStart)}&endDate=${formatDate(endDate)}`)
                        .then(r => r.ok ? r.json() : []).catch(() => []),
                ]);

                // Filter schedules to only this teacher's slots
                const teacherSchedules = schData.filter(s =>
                    parseInt(s.teacher_id || s.teacherId) === parseInt(teacherId)
                );

                // Merge attendance status into schedule slots
                const merged = teacherSchedules.map(slot => {
                    const dayIndex = DAYS.indexOf(slot.day_of_week || slot.day);
                    if (dayIndex === -1) return slot;
                    const slotDate = new Date(currentWeekStart);
                    slotDate.setDate(currentWeekStart.getDate() + dayIndex);
                    const slotDateStr = formatDate(slotDate);
                    const sessionRecord = attData.find(a =>
                        parseInt(a.schedule_id) === parseInt(slot.id) &&
                        a.date.split('T')[0] === slotDateStr
                    );
                    return sessionRecord
                        ? { ...slot, attendanceStatus: sessionRecord.status.toLowerCase() }
                        : slot;
                });

                setSchedules(merged);
                setSubjects(subData);
                setAttendanceData(attData);
            } catch (err) {
                console.error('Error fetching schedule:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [teacherId, currentWeekStart]);

    const handlePrevWeek = () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        setCurrentWeekStart(d);
    };

    const handleNextWeek = () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        setCurrentWeekStart(d);
    };

    // Stats for this week
    const weekStats = { pending: 0, completed: 0, cancelled: 0 };
    schedules.forEach(s => {
        const status = s.attendanceStatus || 'pending';
        if (status === 'completed') weekStats.completed++;
        else if (status === 'cancelled') weekStats.cancelled++;
        else weekStats.pending++;
    });

    const totalClasses = schedules.length;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Weekly Schedule</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Showing only classes assigned to this teacher</p>
                </div>

                {/* Week Navigator */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
                    <button
                        onClick={handlePrevWeek}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 px-2">
                        <Calendar size={16} className="text-[#EB8A33]" />
                        <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
                            {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                            {(() => {
                                const end = new Date(currentWeekStart);
                                end.setDate(end.getDate() + 6);
                                return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            })()}
                        </span>
                    </div>
                    <button
                        onClick={handleNextWeek}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Total Classes</p>
                        <p className="text-2xl font-black text-gray-800">{totalClasses}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-full"><BookOpen size={18} className="text-blue-500" /></div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-yellow-600 font-bold uppercase">Pending</p>
                        <p className="text-2xl font-black text-yellow-700">{weekStats.pending}</p>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-green-600 font-bold uppercase">Completed</p>
                        <p className="text-2xl font-black text-green-700">{weekStats.completed}</p>
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-red-500 font-bold uppercase">Cancelled</p>
                        <p className="text-2xl font-black text-red-600">{weekStats.cancelled}</p>
                    </div>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EB8A33]" />
                    </div>
                ) : totalClasses === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar size={24} className="text-gray-400" />
                        </div>
                        <p className="font-semibold text-gray-600">No classes this week</p>
                        <p className="text-sm text-gray-400 mt-1">This teacher has no scheduled classes for the selected week.</p>
                    </div>
                ) : (
                    <div className="p-4 overflow-x-auto">
                        <div className="grid grid-cols-7 min-w-[900px] gap-3">
                            {DAYS.map((day, dayIndex) => {
                                const currentDayDate = getDateForDay(dayIndex);
                                const colDateStr = formatDate(currentDayDate);
                                const isToday = currentDayDate.toDateString() === new Date().toDateString();

                                const daySlots = schedules
                                    .filter(s => {
                                        const slotDay = s.day_of_week || s.day;
                                        if (slotDay !== day) return false;
                                        // Effective date guard
                                        const effectiveFrom = s.effectiveFrom || s.effective_from;
                                        if (effectiveFrom && colDateStr < effectiveFrom) return false;
                                        // Skip guard
                                        const session = attendanceData.find(a =>
                                            parseInt(a.schedule_id) === parseInt(s.id) &&
                                            a.date.split('T')[0] === colDateStr
                                        );
                                        if (session?.status?.toLowerCase() === 'skipped') return false;
                                        return true;
                                    })
                                    .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

                                return (
                                    <div key={day} className="flex flex-col gap-2">
                                        {/* Day Header */}
                                        <div className={`text-center py-2 rounded-lg flex flex-col items-center justify-center h-14 ${isToday ? 'bg-[#EB8A33]/10 border border-[#EB8A33]/30' : 'bg-gray-50'}`}>
                                            <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-[#EB8A33]' : 'text-gray-400'}`}>
                                                {day.substring(0, 3)}
                                            </div>
                                            <div className={`text-sm font-bold mt-0.5 ${isToday ? 'text-[#EB8A33]' : 'text-gray-600'}`}>
                                                {currentDayDate.getDate()}
                                            </div>
                                        </div>

                                        {/* Slots */}
                                        <div className="flex-1 space-y-2 min-h-[120px] bg-slate-50/30 rounded-xl p-2 border border-dashed border-slate-200">
                                            {daySlots.length === 0 ? (
                                                <div className="flex items-center justify-center h-full min-h-[80px]">
                                                    <span className="text-[10px] text-gray-300 italic">No class</span>
                                                </div>
                                            ) : (
                                                daySlots.map(slot => {
                                                    const subject = subjects.find(s => s.id === parseInt(slot.subject_id || slot.subjectId));
                                                    const status = slot.attendanceStatus || 'pending';
                                                    const colorClass = STATUS_COLORS[status] || STATUS_COLORS.pending;
                                                    const badgeClass = STATUS_BADGE[status] || STATUS_BADGE.pending;
                                                    const startTime = (slot.start_time || slot.startTime || '00:00').substring(0, 5);
                                                    const endTime = (slot.end_time || slot.endTime || '00:00').substring(0, 5);

                                                    return (
                                                        <div
                                                            key={slot.id}
                                                            className={`p-2.5 rounded-lg border shadow-sm transition-all ${colorClass}`}
                                                        >
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mb-1">
                                                                <Clock size={9} />
                                                                {startTime} – {endTime}
                                                            </div>
                                                            <div className="font-bold text-gray-800 text-xs mb-1 line-clamp-2" title={subject?.name}>
                                                                {subject?.name || 'Unknown Subject'}
                                                            </div>
                                                            <div className="flex items-center justify-between gap-1">
                                                                {subject?.year && (
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black/5 text-gray-600 rounded">
                                                                        {subject.year}
                                                                    </span>
                                                                )}
                                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ml-auto ${badgeClass}`}>
                                                                    {status}
                                                                </span>
                                                            </div>
                                                            {subject?.program && (
                                                                <div className="text-[9px] text-gray-500 mt-1 truncate font-medium">
                                                                    {subject.program}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* List view for easy reading on mobile */}
            {!loading && totalClasses > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <BookOpen size={18} className="text-green-600" />
                        <h3 className="font-bold text-gray-800 text-sm">All Classes This Week</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-5 py-3">Day</th>
                                <th className="px-5 py-3">Time</th>
                                <th className="px-5 py-3">Subject</th>
                                <th className="px-5 py-3">Grade</th>
                                <th className="px-5 py-3">Program</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {[...schedules]
                                .sort((a, b) => {
                                    const dayOrder = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
                                    const dayDiff = dayOrder[a.day_of_week || a.day] - dayOrder[b.day_of_week || b.day];
                                    if (dayDiff !== 0) return dayDiff;
                                    return (a.start_time || '').localeCompare(b.start_time || '');
                                })
                                .map(slot => {
                                    const subject = subjects.find(s => s.id === parseInt(slot.subject_id || slot.subjectId));
                                    const status = slot.attendanceStatus || 'pending';
                                    const startTime = (slot.start_time || slot.startTime || '00:00').substring(0, 5);
                                    const endTime = (slot.end_time || slot.endTime || '00:00').substring(0, 5);
                                    const badgeClass = STATUS_BADGE[status] || STATUS_BADGE.pending;
                                    return (
                                        <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-gray-800">{slot.day_of_week || slot.day}</td>
                                            <td className="px-5 py-3 text-gray-500 font-mono text-xs">{startTime} – {endTime}</td>
                                            <td className="px-5 py-3 font-bold text-blue-700">{subject?.name || '—'}</td>
                                            <td className="px-5 py-3 text-gray-600">{subject?.year || 'General'}</td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{subject?.program || '—'}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${badgeClass}`}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherSchedule;