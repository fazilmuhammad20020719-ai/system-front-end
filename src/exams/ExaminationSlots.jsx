// src/exams/ExaminationSlots.jsx
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, ChevronRight, BookOpen, Trash2, Edit2, Filter, RefreshCw, ClipboardList, GraduationCap, UserCheck } from 'lucide-react';
import { API_URL } from '../config';
import CreateSlotModal from './CreateSlotModal';
import CreateExamModal from './CreateExamModal';
import ResultsLog from './ResultsLog';
import ExaminationAttendance from './ExaminationAttendance';

const ExaminationSlots = () => {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null); // If null, show list. If set, show details.
    const [activeTab, setActiveTab] = useState('exams'); // 'exams' | 'results' | 'attendance'
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [slotExams, setSlotExams] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [jumpToExamId, setJumpToExamId] = useState('');

    // Filters & Reference Data
    const [filterSubject, setFilterSubject] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSupervisor, setFilterSupervisor] = useState('');

    // Slot Filters
    const [slotFilterProgram, setSlotFilterProgram] = useState('');
    const [slotFilterStatus, setSlotFilterStatus] = useState('');
    const [slotSearch, setSlotSearch] = useState('');

    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Fetch Reference Data
    useEffect(() => {
        const fetchRefData = async () => {
            try {
                const [subRes, teachRes] = await Promise.all([
                    fetch(`${API_URL}/api/subjects`),
                    fetch(`${API_URL}/api/teachers`)
                ]);
                if (subRes.ok) setSubjects(await subRes.json());
                if (teachRes.ok) setTeachers(await teachRes.json());
            } catch (err) {
                console.error("Error fetching reference data:", err);
            }
        };
        fetchRefData();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await fetch(`${API_URL}/api/slots`);
            if (res.ok) {
                const freshSlots = await res.json();
                setSlots(freshSlots);
                // Keep selectedSlot in sync with fresh data
                setSelectedSlot(prev => {
                    if (!prev) return null;
                    return freshSlots.find(s => s.id === prev.id) || prev;
                });
            }
        } catch (err) {
            console.error("Error fetching slots:", err);
        }
    };

    const fetchSlotExams = async (slotId) => {
        setLoadingExams(true);
        try {
            const res = await fetch(`${API_URL}/api/exams?slotId=${slotId}`);
            if (res.ok) setSlotExams(await res.json());
        } catch (err) {
            console.error("Error fetching exams:", err);
        } finally {
            setLoadingExams(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    useEffect(() => {
        if (selectedSlot) {
            fetchSlotExams(selectedSlot.id);
            setActiveTab('exams'); // Reset tab when entering a slot
            setJumpToExamId('');
        }
    }, [selectedSlot]);

    const handleDeleteSlot = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this slot and all its exams?")) return;
        try {
            await fetch(`${API_URL}/api/slots/${id}`, { method: 'DELETE' });
            fetchSlots();
            if (selectedSlot?.id === id) setSelectedSlot(null);
        } catch (err) {
            console.error(err);
        }
    }

    const handleEditSlot = (e, slot) => {
        e.stopPropagation();
        setEditingSlot(slot);
        setIsSlotModalOpen(true);
    };

    const handleDeleteExam = async (examId) => {
        if (!window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
        try {
            await fetch(`${API_URL}/api/exams/${examId}`, { method: 'DELETE' });
            fetchSlotExams(selectedSlot.id);
        } catch (err) {
            console.error("Error deleting exam:", err);
            alert("Failed to delete exam");
        }
    };

    const handleEditExam = (exam) => {
        setEditingExam(exam);
        setIsExamModalOpen(true);
    };

    // Filter Logic
    const filteredExams = slotExams.filter(exam => {
        // Compare as strings on both sides to avoid number/string type mismatch from API
        const matchSubject  = filterSubject    ? String(exam.subject_id)    === filterSubject    : true;
        const matchGrade    = filterGrade      ? exam.grade                 === filterGrade      : true;
        const matchStatus   = filterStatus     ? exam.status                === filterStatus     : true;
        const matchSupervisor = filterSupervisor ? String(exam.supervisor_id) === filterSupervisor : true;
        return matchSubject && matchGrade && matchStatus && matchSupervisor;
    });

    // Unique Grades for Filter Dropdown (based on current exams or all possible?)
    // Let's use 1-13 for now, or derive from subjects? 
    // Simpler: Just hardcode Grade 1-13 or use previously seen logic.
    const gradeOptions = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);

    const filteredSlots = slots.filter(slot => {
        const matchProgram = slotFilterProgram ? slot.program_name === slotFilterProgram : true;
        const matchStatus = slotFilterStatus ? slot.status === slotFilterStatus : true;
        const matchSearch = slotSearch ? slot.name?.toLowerCase().includes(slotSearch.toLowerCase()) : true;
        return matchProgram && matchStatus && matchSearch;
    });

    const uniquePrograms = [...new Set(slots.map(s => s.program_name))].filter(Boolean);
    const uniqueStatuses = [...new Set(slots.map(s => s.status))].filter(Boolean);

    // --- RENDER LIST OF SLOTS ---
    if (!selectedSlot) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-700">Examination Sessions</h2>
                    <button
                        onClick={() => { setEditingSlot(null); setIsSlotModalOpen(true); }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
                    >
                        <Plus size={16} /> Add Examination Slot
                    </button>
                </div>

                {/* Slot Filters */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Search Slot Name</label>
                        <input
                            type="text"
                            placeholder="e.g. 1st term..."
                            value={slotSearch}
                            onChange={(e) => setSlotSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Program</label>
                        <select
                            value={slotFilterProgram}
                            onChange={(e) => setSlotFilterProgram(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Programs</option>
                            {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Status</label>
                        <select
                            value={slotFilterStatus}
                            onChange={(e) => setSlotFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {(slotSearch || slotFilterProgram || slotFilterStatus) && (
                        <button
                            onClick={() => {
                                setSlotSearch('');
                                setSlotFilterProgram('');
                                setSlotFilterStatus('');
                            }}
                            className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSlots.map(slot => (
                        <div
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${slot.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                                        slot.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {slot.status}
                                    </span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleEditSlot(e, slot)} className="text-slate-300 hover:text-green-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => handleDeleteSlot(e, slot.id)} className="text-slate-300 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{slot.name}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
                                    <BookOpen size={14} /> {slot.program_name}
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(slot.start_date).toLocaleDateString()} - {new Date(slot.end_date).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div 
                                            className={`w-2 h-2 rounded-full ${Number(slot.total_exams) > 0 && Number(slot.completed_exams) >= Number(slot.total_exams) ? 'bg-green-500' : 'bg-slate-200'}`} 
                                            title={`Exams Completed (${slot.completed_exams || 0}/${slot.total_exams || 0})`} 
                                        />
                                        <div 
                                            className={`w-2 h-2 rounded-full ${Number(slot.total_exams) > 0 && Number(slot.attendance_exams) >= Number(slot.total_exams) ? 'bg-green-500' : 'bg-slate-200'}`} 
                                            title={`Attendance Taken (${slot.attendance_exams || 0}/${slot.total_exams || 0})`} 
                                        />
                                        <div 
                                            className={`w-2 h-2 rounded-full ${Number(slot.total_exams) > 0 && Number(slot.results_exams) >= Number(slot.total_exams) ? 'bg-green-500' : 'bg-slate-200'}`} 
                                            title={`Results Submitted (${slot.results_exams || 0}/${slot.total_exams || 0})`} 
                                        />
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredSlots.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            {slots.length === 0 ? "No examination slots found. Create one to get started." : "No examination slots match your filters."}
                        </div>
                    )}
                </div>

                {/* Modal must be rendered here too so it works from the list view */}
                <CreateSlotModal
                    isOpen={isSlotModalOpen}
                    onClose={() => { setIsSlotModalOpen(false); setEditingSlot(null); }}
                    onSave={fetchSlots}
                    slot={editingSlot}
                />
            </div>
        );
    }
    // --- RENDER SLOT DETAILS (Exams List inside Slot) ---
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <button onClick={() => setSelectedSlot(null)} className="hover:text-green-600 font-bold">Examinations</button>
                <ChevronRight size={14} />
                <span className="font-bold text-slate-800">{selectedSlot.name}</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedSlot.name}</h2>
                    <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1.5"><BookOpen size={16} /> {selectedSlot.program_name}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(selectedSlot.start_date).toLocaleDateString()} - {new Date(selectedSlot.end_date).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedSlot.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>{selectedSlot.status}</span>
                    </div>
                </div>
                <button
                    onClick={() => { setEditingExam(null); setIsExamModalOpen(true); }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} /> Create Examination
                </button>
            </div>

            {/* Inner Tabs for Slot */}
            <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
                {['exams', 'results', 'attendance'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setJumpToExamId(''); }}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === tab
                            ? "border-green-600 text-green-700"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        {tab === 'exams' && <ClipboardList size={16} />}
                        {tab === 'results' && <GraduationCap size={16} />}
                        {tab === 'attendance' && <UserCheck size={16} />}
                        <span className="capitalize">{tab === 'exams' ? 'Scheduled Exams' : tab === 'results' ? 'Exam Results' : 'Attendance'}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'exams' && (
                <>

                    {/* Filters */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Subject</label>
                            <select
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Grade</label>
                            <select
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Grades</option>
                                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                {/* Add other statues if they exist */}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Supervisor</label>
                            <select
                                value={filterSupervisor}
                                onChange={(e) => setFilterSupervisor(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Supervisors</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        {(filterSubject || filterGrade || filterStatus || filterSupervisor) && (
                            <button
                                onClick={() => {
                                    setFilterSubject('');
                                    setFilterGrade('');
                                    setFilterStatus('');
                                    setFilterSupervisor('');
                                }}
                                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* List of Exams in this Slot */}
                    <div className="grid grid-cols-1 gap-4">
                        {loadingExams ? (
                            <div className="text-center py-20 text-slate-400">Loading exams...</div>
                        ) : filteredExams.length > 0 ? (
                            filteredExams.map(exam => (
                                <div key={exam.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col gap-4 hover:shadow-sm transition-shadow group">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-50 text-green-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold border border-green-100 shrink-0">
                                                <span className="text-xs uppercase">{new Date(exam.exam_date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg leading-none">{new Date(exam.exam_date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-800 text-lg">{exam.title}</h4>
                                                    {exam.parts && exam.parts.length > 1 && (
                                                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                                            Multi-Part
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500">{exam.subject_name}</p>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                                                    <div title="Supervisor">
                                                        <span className="font-semibold text-slate-600">Supervisor:</span> {exam.supervisor_name || 'Not Assigned'}
                                                    </div>
                                                    <span className="text-slate-300">•</span>
                                                    <div title="Assigned Students">
                                                        <span className="font-semibold text-slate-600">Students:</span> {exam.assigned_students || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 self-end md:self-auto">
                                            <div className="text-right text-sm text-slate-500 mr-4">
                                                <p className="font-bold text-slate-700">{exam.total_marks} Marks</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {exam.status}
                                            </span>
                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 pl-2 border-l border-slate-200 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setJumpToExamId(exam.id); setActiveTab('attendance'); }}
                                                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                                    title="Take Attendance"
                                                >
                                                    <UserCheck size={16} /> 
                                                </button>
                                                <button
                                                    onClick={() => { setJumpToExamId(exam.id); setActiveTab('results'); }}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                                    title="Add Results"
                                                >
                                                    <GraduationCap size={16} /> 
                                                </button>
                                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                                <button
                                                    onClick={() => handleEditExam(exam)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Exam"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExam(exam.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Exam"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parts List */}
                                    {exam.parts && exam.parts.length > 0 && (
                                        <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 border border-slate-100">
                                            {exam.parts.map((part, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-100">
                                                    <div className="bg-slate-100 text-slate-500 w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0">
                                                        P{idx + 1}
                                                    </div>
                                                    <div className="text-xs">
                                                        <p className="font-bold text-slate-700">{part.name}</p>
                                                        <p className="text-slate-500">
                                                            {new Date(part.exam_date).toLocaleDateString()} • {part.start_time.slice(0, 5)} - {part.end_time.slice(0, 5)}
                                                        </p>
                                                        <p className="text-slate-400">{part.venue}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500">
                                {slotExams.length === 0 ? "No exams scheduled in this slot yet." : "No exams match your filters."}
                            </div>
                        )}

                    </div>
                </>
            )}

            {activeTab === 'results' && (
                <ResultsLog slotId={selectedSlot.id} exams={slotExams} initialExamId={jumpToExamId} />
            )}

            {activeTab === 'attendance' && (
                <ExaminationAttendance slotId={selectedSlot.id} exams={slotExams} initialExamId={jumpToExamId} />
            )}

            <CreateExamModal
                isOpen={isExamModalOpen}
                onClose={() => { setIsExamModalOpen(false); setEditingExam(null); }}
                onSave={(savedData, wasEdit) => {
                    if (wasEdit && savedData?.exam) {
                        // Immediately update the edited exam card for instant UI feedback
                        setSlotExams(prev => prev.map(e =>
                            e.id === savedData.exam.id ? { ...e, ...savedData.exam } : e
                        ));
                    }
                    // Always re-fetch for fully accurate data
                    fetchSlotExams(selectedSlot.id);
                }}
                slot={selectedSlot} // Pass the slot context!
                examToEdit={editingExam}
            />

            {/* Slot Modal — rendered always so it works from both list and detail view */}
            <CreateSlotModal
                isOpen={isSlotModalOpen}
                onClose={() => { setIsSlotModalOpen(false); setEditingSlot(null); }}
                onSave={fetchSlots}
                slot={editingSlot}
            />
        </div>
    );
};

export default ExaminationSlots;
