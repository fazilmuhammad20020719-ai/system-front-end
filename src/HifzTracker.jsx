import React, { useState, useEffect } from 'react';
import { useNotification } from './context/NotificationContext';
import { useLoader } from './context/LoaderContext';
import {
    Search, Plus, Edit2, X, Save, BookOpen,
    Users, TrendingUp, Award, Filter, ChevronDown
} from 'lucide-react';
import { API_URL } from './config';
import Sidebar from './Sidebar';

/* ─── tiny progress ring ─────────────────────────────────────── */
const ProgressRing = ({ juz = 0 }) => {
    const pct = Math.min((juz / 30) * 100, 100);
    const r = 18;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={44} height={44} viewBox="0 0 44 44" className="rotate-[-90deg]">
            <circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
            <circle
                cx={22} cy={22} r={r}
                fill="none"
                stroke={pct >= 80 ? '#16a34a' : pct >= 40 ? '#2563eb' : '#f59e0b'}
                strokeWidth={4}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text
                x={22} y={22}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fontWeight={700}
                fill="#374151"
                transform="rotate(90,22,22)"
            >
                {juz}/30
            </text>
        </svg>
    );
};

/* ─── stat card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════ */
const HifzTracker = () => {
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [allStudents, setAllStudents] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);

    /* assign area */
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    /* assign panel filters */
    const [filterProgram, setFilterProgram] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterGrade, setFilterGrade] = useState('');

    /* table search */
    const [tableSearch, setTableSearch] = useState('');

    /* modal */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [updateJuz, setUpdateJuz] = useState('');
    const [updateSurah, setUpdateSurah] = useState('');

    useEffect(() => {
        fetchAllStudents();
        fetchAssignedStudents();
        fetchPrograms();
    }, []);

    /* ── API helpers ── */
    const fetchAllStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch students from API');
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.students || []);
            setAllStudents(list);
        } catch (error) {
            console.error('Students fetch error:', error);
            showNotification('Failed to load students list', 'error');
        }
    };

    const fetchPrograms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/programs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setAllPrograms(Array.isArray(data) ? data : []);
        } catch { /* silent */ }
    };

    const fetchAssignedStudents = async () => {
        try {
            showLoader();
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/hifz/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setAssignedStudents(data);
        } catch {
            showNotification('Failed to load Hifz tracker list', 'error');
        } finally {
            hideLoader();
        }
    };

    const handleAssignStudent = async () => {
        if (!selectedStudentId) {
            showNotification('Please select a student', 'warning');
            return;
        }
        try {
            showLoader();
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/hifz/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ studentId: selectedStudentId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            showNotification('Student added to Hifz Tracker!', 'success');
            setSelectedStudentId('');
            setSearchTerm('');
            fetchAssignedStudents();
        } catch (err) {
            showNotification(err.message || 'Failed to assign student', 'error');
        } finally {
            hideLoader();
        }
    };

    const openUpdateModal = (student) => {
        setEditingStudent(student);
        setUpdateJuz(student.current_juz || '');
        setUpdateSurah(student.current_surah || '');
        setIsModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
        setUpdateJuz('');
        setUpdateSurah('');
    };

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        if (!editingStudent) return;
        if (updateJuz === '' || isNaN(updateJuz) || updateJuz < 1 || updateJuz > 30) {
            showNotification('Please enter a valid Juz number (1–30)', 'warning');
            return;
        }
        if (!updateSurah.trim()) {
            showNotification('Please enter the current Surah', 'warning');
            return;
        }
        try {
            showLoader();
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/hifz/update/${editingStudent.student_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ current_juz: parseInt(updateJuz), current_surah: updateSurah })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            showNotification('Progress updated successfully!', 'success');
            closeUpdateModal();
            fetchAssignedStudents();
        } catch (err) {
            showNotification(err.message || 'Failed to update progress', 'error');
        } finally {
            hideLoader();
        }
    };

    /* ── derived data ── */
    // Unique filter options derived from student list
    const programOptions = [...new Set(allStudents.map(s => s.program).filter(Boolean))].sort();
    const batchOptions = [...new Set(allStudents.map(s => s.session).filter(Boolean))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    // Grade options: if a program is selected and we have programs list, generate from duration
    let gradeOptions = [];
    if (filterProgram) {
        const prog = allPrograms.find(p => p.name === filterProgram);
        if (prog) {
            const dur = parseInt(prog.duration) || 5;
            gradeOptions = Array.from({ length: dur }, (_, i) => `Grade ${i + 1}`);
        }
    }
    if (gradeOptions.length === 0) {
        gradeOptions = [...new Set(allStudents.map(s => s.currentYear).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }

    // Filtered students for assign panel
    const assignedIds = new Set(assignedStudents.map(s => String(s.student_id)));
    const filteredDropdown = allStudents.filter(s => {
        const matchSearch = (s?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(s?.id || '').includes(searchTerm);
        const matchProgram = !filterProgram || s.program === filterProgram;
        const matchBatch = !filterBatch || s.session === filterBatch;
        const matchGrade = !filterGrade || s.currentYear === filterGrade;
        return matchSearch && matchProgram && matchBatch && matchGrade;
    });

    const selectedStudent = allStudents.find(s => String(s.id) === String(selectedStudentId));
    const selectedName = selectedStudent?.name || '';

    const hasAssignFilters = searchTerm || filterProgram || filterBatch || filterGrade;

    const filteredTable = assignedStudents.filter(s =>
        (s?.student_name || '').toLowerCase().includes(tableSearch.toLowerCase()) ||
        (s?.student_id || '').toString().includes(tableSearch)
    );

    const avgJuz = assignedStudents.length
        ? (assignedStudents.reduce((sum, s) => sum + (s.current_juz || 0), 0) / assignedStudents.length).toFixed(1)
        : '—';

    const completed = assignedStudents.filter(s => s.current_juz >= 30).length;

    /* ══════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* MAIN NAV SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 min-h-screen bg-gray-50`}>

                {/* ── Top header bar ── */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 leading-tight">Hifz Tracker</h1>
                            <p className="text-xs text-gray-500">Quran memorisation progress</p>
                        </div>
                    </div>
                    <span className="bg-green-50 text-green-700 font-semibold px-3 py-1.5 rounded-full text-sm border border-green-100">
                        {assignedStudents.length} enrolled
                    </span>
                </div>

                {/* ── Stats row ── */}
                <div className="px-6 pt-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard icon={Users} label="Total Tracked" value={assignedStudents.length} color="bg-green-500" />
                    <StatCard icon={TrendingUp} label="Average Juz" value={avgJuz} color="bg-blue-500" />
                    <StatCard icon={Award} label="Completed (30)" value={completed} color="bg-amber-500" />
                </div>

                {/* ── Body: sidebar + table ── */}
                <div className="flex gap-6 px-6 pt-5 pb-24">

                    {/* ════ LEFT SIDEBAR PANEL ════ */}
                    <aside className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">

                            {/* sidebar header */}
                            <div className="bg-gradient-to-br from-green-600 to-green-700 p-5">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                    <Plus size={20} className="text-white" />
                                </div>
                                <h2 className="text-white font-bold text-lg leading-tight">Assign Student</h2>
                                <p className="text-green-100 text-xs mt-1">Filter &amp; select a student for the Hifz programme</p>
                            </div>

                            {/* ── FILTER ROW ── */}
                            <div className="px-4 pt-4 space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                    <Filter size={11} /> Filters
                                </p>

                                {/* Program filter */}
                                <div className="relative">
                                    <select
                                        value={filterProgram}
                                        onChange={e => { setFilterProgram(e.target.value); setFilterGrade(''); setSelectedStudentId(''); }}
                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs appearance-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 text-gray-700"
                                    >
                                        <option value="">All Programs</option>
                                        {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Batch + Grade row */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <select
                                            value={filterBatch}
                                            onChange={e => { setFilterBatch(e.target.value); setSelectedStudentId(''); }}
                                            className="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs appearance-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 text-gray-700"
                                        >
                                            <option value="">All Batches</option>
                                            {batchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={filterGrade}
                                            onChange={e => { setFilterGrade(e.target.value); setSelectedStudentId(''); }}
                                            className="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs appearance-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 text-gray-700"
                                        >
                                            <option value="">All Grades</option>
                                            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                                    <input
                                        type="text"
                                        placeholder="Search name or ID…"
                                        className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none bg-gray-50"
                                        value={searchTerm}
                                        onChange={e => { setSearchTerm(e.target.value); setSelectedStudentId(''); }}
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>

                                {/* clear filters pill */}
                                {hasAssignFilters && (
                                    <button
                                        onClick={() => { setFilterProgram(''); setFilterBatch(''); setFilterGrade(''); setSearchTerm(''); setSelectedStudentId(''); }}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                                    >
                                        <X size={11} /> Clear filters
                                    </button>
                                )}
                            </div>

                            {/* ── STUDENT LIST ── */}
                            <div className="px-4 pt-3 pb-2">
                                <p className="text-xs text-gray-400 mb-2">
                                    {filteredDropdown.length} student{filteredDropdown.length !== 1 ? 's' : ''} found
                                    {selectedStudentId && <span className="ml-2 text-green-600 font-semibold">· 1 selected</span>}
                                </p>
                                <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                                    {filteredDropdown.length > 0 ? filteredDropdown.map(s => {
                                        const isSelected = String(s.id) === String(selectedStudentId);
                                        const isAssigned = assignedIds.has(String(s.id));
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => !isAssigned && setSelectedStudentId(isSelected ? '' : s.id)}
                                                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors
                                                    ${isAssigned ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                                        : isSelected ? 'bg-green-50 border-l-2 border-green-500'
                                                            : 'hover:bg-gray-50'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                                    ${isSelected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                                    {(s.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        ID: {s.id}
                                                        {s.currentYear && <span className="ml-1">· {s.currentYear}</span>}
                                                        {s.session && <span className="ml-1">· {s.session}</span>}
                                                    </p>
                                                </div>
                                                {isAssigned && (
                                                    <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full flex-shrink-0">In Tracker</span>
                                                )}
                                                {isSelected && !isAssigned && (
                                                    <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }) : (
                                        <div className="py-8 text-center text-sm text-gray-400">No students found</div>
                                    )}
                                </div>
                            </div>

                            {/* ── SELECTED BADGE + ADD BUTTON ── */}
                            <div className="px-4 pb-4 space-y-3">
                                {selectedName && (
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {selectedName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-green-800 flex-1 truncate">{selectedName}</span>
                                        <button onClick={() => setSelectedStudentId('')} className="text-green-400 hover:text-green-600">
                                            <X size={13} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleAssignStudent}
                                    disabled={!selectedStudentId}
                                    className={`w-full py-2.5 rounded-xl font-semibold flex justify-center items-center gap-2 text-sm transition-all ${selectedStudentId
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Plus size={16} />
                                    Add to Tracker
                                </button>
                            </div>

                            {/* sidebar mini-legend */}
                            <div className="px-4 pb-4">
                                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Juz Progress Legend</p>
                                    {[
                                        { label: 'Starting (1–12)', color: 'bg-amber-400' },
                                        { label: 'Midway (13–24)', color: 'bg-blue-500' },
                                        { label: 'Advanced (25–30)', color: 'bg-green-600' },
                                    ].map(({ label, color }) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                            <span className="text-xs text-gray-600">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ════ MAIN CONTENT ════ */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* table toolbar */}
                            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BookOpen size={18} className="text-green-600" />
                                    Tracked Students
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search students…"
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
                                        value={tableSearch}
                                        onChange={e => setTableSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Surah</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Juz</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredTable.length > 0 ? filteredTable.map(student => {
                                            const juz = student.current_juz || 0;
                                            const pct = Math.round((juz / 30) * 100);
                                            const badgeColor = juz >= 25 ? 'bg-green-100 text-green-700' : juz >= 13 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';
                                            return (
                                                <tr key={student.tracker_id} className="hover:bg-gray-50 transition-colors group">
                                                    {/* student */}
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                                                                {(student.student_name || '?').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{student.student_name}</p>
                                                                <p className="text-xs text-gray-400">ID: {student.student_id}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* ring */}
                                                    <td className="px-5 py-4 whitespace-nowrap text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <ProgressRing juz={juz} />
                                                            <span className="text-xs text-gray-400">{pct}%</span>
                                                        </div>
                                                    </td>

                                                    {/* surah */}
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <p className="text-sm font-medium text-gray-800">{student.current_surah || '—'}</p>
                                                    </td>

                                                    {/* juz badge */}
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                                                            Juz {juz || 'N/A'}
                                                        </span>
                                                    </td>

                                                    {/* action */}
                                                    <td className="px-5 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => openUpdateModal(student)}
                                                            className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Edit2 size={14} />
                                                            Update
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                                        <BookOpen size={44} className="text-gray-200" />
                                                        <p className="text-base font-medium text-gray-500">
                                                            {tableSearch ? 'No matching students' : 'No students assigned yet'}
                                                        </p>
                                                        <p className="text-sm">
                                                            {tableSearch ? 'Try a different search term' : 'Use the sidebar to assign students to the tracker'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>

                {/* ══════════ UPDATE MODAL ══════════ */}
                {isModalOpen && editingStudent && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease]">
                            {/* modal header */}
                            <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                        <BookOpen size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">Update Progress</h3>
                                        <p className="text-green-200 text-xs">Hifz Tracker</p>
                                    </div>
                                </div>
                                <button onClick={closeUpdateModal} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProgress} className="p-6">
                                {/* student info */}
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                                        {editingStudent.student_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{editingStudent.student_name}</p>
                                        <p className="text-xs text-gray-400">ID: {editingStudent.student_id}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <ProgressRing juz={editingStudent.current_juz || 0} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Current Juz <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number" min="1" max="30"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
                                            placeholder="e.g. 15"
                                            value={updateJuz}
                                            onChange={e => setUpdateJuz(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Enter a number between 1 and 30</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Current Surah <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
                                            placeholder='e.g. "Al-Kahf"'
                                            value={updateSurah}
                                            onChange={e => setUpdateSurah(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={closeUpdateModal}
                                        className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
                                    >
                                        <Save size={16} />
                                        Save Progress
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HifzTracker;
