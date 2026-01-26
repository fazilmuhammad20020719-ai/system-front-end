// src/exams/ExamRegistrations.jsx
import { useState, useMemo } from 'react';
import { Search, Calendar, UserCheck, XCircle, CheckCircle, Clock } from 'lucide-react';

const ExamRegistrations = () => {
    // --- State ---
    const [selectedExamId, setSelectedExamId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'late' }
    const [saving, setSaving] = useState(false);

    // --- Mock Data ---
    const exams = [
        { id: 'EX101', title: 'Arabic Grammar (Nahw) - Mid Term', date: '2025-10-15', time: '09:00 AM' },
        { id: 'EX102', title: 'Morphology (Sarf) - Final', date: '2025-10-18', time: '02:00 PM' },
        { id: 'EX103', title: 'Fiqh Basics - Monthly Test', date: '2025-10-20', time: '10:00 AM' },
    ];

    const students = [
        { id: 'ST001', name: 'Ahmed Fazil', program: 'Diploma in Arabic' },
        { id: 'ST002', name: 'Mohamed Nazeer', program: 'Diploma in Arabic' },
        { id: 'ST003', name: 'Yusuf Khan', program: 'Diploma in Arabic' },
        { id: 'ST004', name: 'Ibrahim Zaid', program: 'Higher Diploma' },
        { id: 'ST005', name: 'Omar Farooq', program: 'Higher Diploma' },
    ];

    // --- Helpers ---
    const handleMark = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleMarkAll = (status) => {
        const updates = {};
        students.forEach(s => updates[s.id] = status);
        setAttendance(updates);
    };

    const getStats = () => {
        const total = students.length;
        const present = Object.values(attendance).filter(s => s === 'present').length;
        const absent = Object.values(attendance).filter(s => s === 'absent').length;
        const late = Object.values(attendance).filter(s => s === 'late').length;
        return { total, present, absent, late, unmarked: total - (present + absent + late) };
    };

    const stats = getStats();

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            alert(`Attendance Saved!\nPresent: ${stats.present}, Absent: ${stats.absent}`);
            setSaving(false);
        }, 800);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* TOP BAR: Exam Selector & Stats */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="w-full md:w-1/2">
                    <label className="text-sm font-bold text-slate-500 mb-1 block uppercase tracking-wider">Select Examination</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <select
                            value={selectedExamId}
                            onChange={(e) => { setSelectedExamId(e.target.value); setAttendance({}); }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">-- Choose Exam to Take Attendance --</option>
                            {exams.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.title} ({ex.date})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedExamId && (
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Present</span>
                            <span className="text-xl font-bold">{stats.present}</span>
                        </div>
                        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Absent</span>
                            <span className="text-xl font-bold">{stats.absent}</span>
                        </div>
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg border border-orange-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Late</span>
                            <span className="text-xl font-bold">{stats.late}</span>
                        </div>
                        <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Total</span>
                            <span className="text-xl font-bold">{stats.total}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT Area */}
            {selectedExamId ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => handleMarkAll('present')} className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Mark All Present</button>
                            <button onClick={handleSave} disabled={saving} className="ml-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                                {saving ? "Saving..." : "Save Log"}
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="overflow-y-auto flex-1 p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 sticky top-0 z-10 text-xs uppercase text-slate-500 font-bold">
                                <tr>
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Student Name</th>
                                    <th className="p-4 border-b">Program</th>
                                    <th className="p-4 border-b text-center">Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map(student => {
                                    const status = attendance[student.id];
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-slate-600">{student.id}</td>
                                            <td className="p-4 text-sm font-bold text-slate-800">{student.name}</td>
                                            <td className="p-4 text-xs text-slate-500">{student.program}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                {/* Present Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'present')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'present'
                                                        ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-green-300 hover:text-green-500'}`}
                                                >
                                                    <CheckCircle size={16} />
                                                    <span className="text-xs font-bold">Present</span>
                                                </button>

                                                {/* Absent Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'absent')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'absent'
                                                        ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-red-300 hover:text-red-500'}`}
                                                >
                                                    <XCircle size={16} />
                                                    <span className="text-xs font-bold">Absent</span>
                                                </button>

                                                {/* Late Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'late')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'late'
                                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-orange-300 hover:text-orange-500'}`}
                                                >
                                                    <Clock size={16} />
                                                    <span className="text-xs font-bold">Late</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div className="p-10 text-center text-slate-400">No students match your search.</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 gap-4">
                    <div className="bg-white p-6 rounded-full shadow-sm">
                        <UserCheck size={64} className="text-slate-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-600">No Exam Selected</h3>
                        <p>Please select an exam from the dropdown above to start taking attendance.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamRegistrations;
