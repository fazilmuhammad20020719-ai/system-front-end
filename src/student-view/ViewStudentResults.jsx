// src/student-view/ViewStudentResults.jsx
import { useState, useEffect } from 'react';
import { Award, Download, BookOpen, AlertCircle, Loader2, FileText, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { API_URL } from '../config';

const statusConfig = {
    Pass:    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
    Fail:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
    Absent:  { bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400'  },
    Present: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
};

const gradeColor = (grade) => {
    if (!grade) return 'text-slate-400';
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B') return 'text-blue-600';
    if (grade === 'C') return 'text-yellow-600';
    if (grade === 'S') return 'text-orange-500';
    return 'text-red-500';
};

// ── Single slot section ──────────────────────────────────────────────────────
const SlotSection = ({ slotName, rows }) => {
    const [collapsed, setCollapsed] = useState(false);

    const passed  = rows.filter(r => r.status === 'Pass').length;
    const failed  = rows.filter(r => r.status === 'Fail').length;
    const graded  = rows.filter(r => r.marks_obtained !== null && r.marks_obtained !== '').length;
    const avg     = graded
        ? rows.reduce((s, r) => s + (parseFloat(r.marks_obtained) || 0), 0) / graded
        : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Slot heading bar ── */}
            <button
                onClick={() => setCollapsed(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors text-left"
            >
                <div className="flex items-center gap-2.5">
                    <FolderOpen className="text-green-600 shrink-0" size={18} />
                    <span className="font-bold text-gray-800">{slotName}</span>
                    <span className="text-xs text-slate-400 font-medium">{rows.length} exam{rows.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Mini stats + collapse icon */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
                        <span className="text-green-600">{passed} Passed</span>
                        {failed > 0 && <span className="text-red-500">{failed} Failed</span>}
                        {avg !== null && (
                            <span className="text-slate-500">Avg&nbsp;{avg.toFixed(1)}%</span>
                        )}
                    </div>
                    {collapsed
                        ? <ChevronDown size={16} className="text-slate-400" />
                        : <ChevronUp   size={16} className="text-slate-400" />
                    }
                </div>
            </button>

            {/* ── Collapsible table ── */}
            {!collapsed && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-3">Exam</th>
                                <th className="px-6 py-3">Subject / Program</th>
                                <th className="px-6 py-3 text-center">Date</th>
                                <th className="px-6 py-3 text-center">Marks</th>
                                <th className="px-6 py-3 text-center">Grade</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Paper</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {rows.map((res, i) => {
                                const cfg = statusConfig[res.status] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
                                const examDate = res.exam_date
                                    ? new Date(res.exam_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : '—';

                                const marksDisplay = res.status === 'Absent'
                                    ? <span className="text-slate-400 font-medium">Absent</span>
                                    : (res.marks_obtained !== null && res.marks_obtained !== undefined && res.marks_obtained !== '')
                                        ? <span className="font-bold text-slate-800">
                                            {res.marks_obtained}
                                            <span className="text-slate-400 font-normal text-xs">/{res.total_marks || 100}</span>
                                          </span>
                                        : <span className="text-slate-300">—</span>;

                                return (
                                    <tr key={i} className="hover:bg-green-50/20 transition-colors">

                                        {/* Exam name */}
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800">{res.exam_name}</div>
                                            {res.remarks && (
                                                <div className="text-xs text-slate-400 mt-0.5 italic">"{res.remarks}"</div>
                                            )}
                                        </td>

                                        {/* Subject / Program */}
                                        <td className="px-6 py-4">
                                            {res.subject_name
                                                ? <div className="flex items-center gap-1.5 text-slate-600">
                                                    <BookOpen size={13} className="text-slate-400" />
                                                    {res.subject_name}
                                                  </div>
                                                : <span className="text-slate-300">—</span>
                                            }
                                            {res.program_name && (
                                                <div className="text-xs text-slate-400 mt-0.5">{res.program_name}</div>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-center text-slate-500">{examDate}</td>

                                        {/* Marks */}
                                        <td className="px-6 py-4 text-center">{marksDisplay}</td>

                                        {/* Grade */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-lg font-extrabold ${gradeColor(res.grade)}`}>
                                                {res.grade || '—'}
                                            </span>
                                        </td>

                                        {/* Status badge */}
                                        <td className="px-6 py-4 text-center">
                                            {res.status ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                                                    {res.status}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">Pending</span>
                                            )}
                                        </td>

                                        {/* Exam paper */}
                                        <td className="px-6 py-4 text-center">
                                            {res.paper_url ? (
                                                <a
                                                    href={`${API_URL}/${res.paper_url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition"
                                                >
                                                    <Download size={12} /> View
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
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

// ── Main component ───────────────────────────────────────────────────────────
const ViewStudentResults = ({ studentId }) => {
    const [results, setResults]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error,   setError]     = useState(null);

    // Filters
    const [filterSlot, setFilterSlot] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        if (!studentId) return;
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/api/exams/student/${studentId}/results`);
                if (!res.ok) throw new Error('Failed to fetch results');
                const data = await res.json();
                // Patch any bad database data on the frontend: 
                // if marks exist, status MUST be Pass or Fail, not Present/Late
                const patchedData = data.map(r => {
                    let st = r.status;
                    if (r.marks_obtained !== null && r.marks_obtained !== undefined && r.marks_obtained !== '') {
                        if (st !== 'Pass' && st !== 'Fail') {
                            const val = parseInt(r.marks_obtained);
                            st = (!isNaN(val) && val >= 50) ? 'Pass' : 'Fail';
                        }
                    }
                    return { ...r, status: st };
                });
                setResults(patchedData);
            } catch (err) {
                console.error('Error fetching student results:', err);
                setError('Could not load results. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [studentId]);

    // ── Loading ──
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-green-400" />
                <span className="text-sm font-medium">Loading results…</span>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
                <AlertCircle size={32} />
                <span className="text-sm font-medium">{error}</span>
            </div>
        );
    }

    // ── Empty ──
    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-300 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-slate-50 rounded-full p-5 border border-slate-100">
                    <FileText size={40} className="text-slate-300" />
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-slate-500">No Results Yet</p>
                    <p className="text-sm text-slate-400">This student has not been assigned to any exams.</p>
                </div>
            </div>
        );
    }

    // ── Filter Data ──
    const filteredResults = results.filter(r => {
        const matchSlot = filterSlot ? r.slot_name === filterSlot : true;
        const matchSubject = filterSubject ? r.subject_name === filterSubject : true;
        const matchGrade = filterGrade ? r.grade === filterGrade : true;
        const matchStatus = filterStatus ? r.status === filterStatus : true;
        return matchSlot && matchSubject && matchGrade && matchStatus;
    });

    // Extract unique options
    const uniqueSlots = [...new Set(results.map(r => r.slot_name).filter(Boolean))].sort();
    const uniqueSubjects = [...new Set(results.map(r => r.subject_name).filter(Boolean))].sort();
    const uniqueGrades = [...new Set(results.map(r => r.grade).filter(Boolean))].sort();
    const uniqueStatuses = [...new Set(results.map(r => r.status).filter(Boolean))].sort();

    // ── Group by slot ──
    const slotMap = new Map(); // slotKey → { name, rows[] }

    filteredResults.forEach(r => {
        const key  = r.slot_id != null ? String(r.slot_id) : 'no-slot';
        const name = r.slot_name || 'Unassigned Exams';
        if (!slotMap.has(key)) slotMap.set(key, { name, rows: [] });
        slotMap.get(key).rows.push(r);
    });

    const slots = Array.from(slotMap.values());

    // Global summary
    const total  = filteredResults.length;
    const passed = filteredResults.filter(r => r.status === 'Pass').length;
    const failed = filteredResults.filter(r => r.status === 'Fail').length;
    const gradedAll = filteredResults.filter(r => r.marks_obtained !== null && r.marks_obtained !== '');
    const avgAll = gradedAll.length > 0
        ? gradedAll.reduce((s, r) => s + (parseFloat(r.marks_obtained) || 0), 0) / gradedAll.length
        : null;

    return (
        <div className="space-y-5">

            {/* ── Global summary card ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Award className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-800">Examination Results</h3>
                    </div>
                </div>

                {/* ── Filters ── */}
                <div className="bg-slate-50 px-6 py-4 flex flex-wrap gap-4 border-b border-gray-100">
                    <div className="flex-1 min-w-[140px]">
                        <select
                            value={filterSlot}
                            onChange={(e) => setFilterSlot(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Slots</option>
                            {uniqueSlots.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Subjects</option>
                            {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <select
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Grades</option>
                            {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {(filterSlot || filterSubject || filterGrade || filterStatus) && (
                        <button
                            onClick={() => {
                                setFilterSlot('');
                                setFilterSubject('');
                                setFilterGrade('');
                                setFilterStatus('');
                            }}
                            className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b border-gray-100">
                    <div className="px-5 py-3 flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-bold text-slate-700">{total}</span>
                    </div>
                    <div className="px-5 py-3 flex flex-col items-center">
                        <span className="text-xs text-green-500 font-semibold uppercase tracking-wider">Passed</span>
                        <span className="text-2xl font-bold text-green-600">{passed}</span>
                    </div>
                    <div className="px-5 py-3 flex flex-col items-center">
                        <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Failed</span>
                        <span className="text-2xl font-bold text-red-500">{failed}</span>
                    </div>
                    <div className="px-5 py-3 flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg. Marks</span>
                        <span className="text-2xl font-bold text-slate-700">
                            {avgAll !== null ? `${avgAll.toFixed(1)}%` : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Per-slot sections ── */}
            {filteredResults.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed border-gray-200">
                    No results match your selected filters.
                </div>
            ) : (
                slots.map((slot, idx) => (
                    <SlotSection key={idx} slotName={slot.name} rows={slot.rows} />
                ))
            )}
        </div>
    );
};

export default ViewStudentResults;