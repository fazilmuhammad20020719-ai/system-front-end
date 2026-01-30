// src/exams/ExaminationAttendance.jsx
import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, UserCheck, XCircle, CheckCircle, Clock } from 'lucide-react';
import { API_URL } from '../config';

const ExaminationAttendance = ({ exams: propExams }) => {
    // --- State ---
    const [selectedExamId, setSelectedExamId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' | 'Late' }
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [saving, setSaving] = useState(false);

    // --- Data Loading ---
    useEffect(() => {
        if (propExams) {
            setExams(propExams);
            return;
        }

        // Fetch Exams
        const fetchExams = async () => {
            try {
                const res = await fetch(`${API_URL}/api/exams`);
                if (res.ok) setExams(await res.json());
            } catch (err) {
                console.error("Error fetching exams:", err);
            }
        };
        fetchExams();
    }, [propExams]);

    useEffect(() => {
        if (!selectedExamId) {
            setStudents([]);
            setAttendance({});
            return;
        }

        const fetchDetails = async () => {
            try {
                // 1. Get Exam Details to know Program
                const exam = exams.find(e => String(e.id) === String(selectedExamId));
                if (!exam) return;

                // 2. Fetch Students for that Program (Simplification: Fetch all and filter, or dedicated route)
                // Better approach: Fetch students by program
                const studentsRes = await fetch(`${API_URL}/api/students`); // Optimally: /api/students?programId=${exam.program_id}
                let allStudents = [];
                if (studentsRes.ok) allStudents = await studentsRes.json();

                // Filter by program and grade (if available in exam or inferred)
                // Assuming exam has program_id. 
                // Note: exam object keys depend on DB query (program_id)
                const relevantStudents = allStudents.filter(s =>
                    String(s.program_id) === String(exam.program_id)
                    // && s.current_year === ... (if we enforced year/grade in exam)
                );
                setStudents(relevantStudents);

                // 3. Fetch Existing Attendance
                const attRes = await fetch(`${API_URL}/api/exams/${selectedExamId}/attendance`);
                if (attRes.ok) {
                    const data = await attRes.json();
                    const map = {};
                    data.forEach(r => map[r.student_id] = r.status);
                    setAttendance(map);
                }

            } catch (err) {
                console.error("Error fetching details:", err);
            }
        };

        fetchDetails();
    }, [selectedExamId, exams]);


    // --- Helpers ---
    const handleMark = async (studentId, status) => {
        // Optimistic UI Update
        setAttendance(prev => ({ ...prev, [studentId]: status }));

        // API Call
        try {
            await fetch(`${API_URL}/api/exams/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: selectedExamId,
                    studentId: studentId,
                    status: status
                })
            });
        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Failed to save status");
        }
    };

    const handleMarkAll = async (status) => {
        const updates = {};
        students.forEach(s => updates[s.id] = status);
        setAttendance(updates);

        // Batch save could be implemented, but iterating for now (or simple alert)
        // In prod: add /bulk-attendance endpoint
        // For now, simulate by looping in background or just local state if "Save Log" is main trigger
    };

    const getStats = () => {
        const total = students.length;
        const present = Object.values(attendance).filter(s => s === 'Present').length;
        const absent = Object.values(attendance).filter(s => s === 'Absent').length;
        const late = Object.values(attendance).filter(s => s === 'Late').length;
        return { total, present, absent, late };
    };

    const stats = getStats();

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.id).toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            onChange={(e) => setSelectedExamId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">-- Choose Exam to Take Attendance --</option>
                            {exams.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.title} ({new Date(ex.exam_date).toLocaleDateString()})</option>
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
                            {/* <button onClick={() => handleMarkAll('Present')} className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Mark All Present</button> */}
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
                                            <td className="p-4 text-xs text-slate-500">{student.program_name || '-'}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                {/* Present Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'Present')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'Present'
                                                        ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-green-300 hover:text-green-500'}`}
                                                >
                                                    <CheckCircle size={16} />
                                                    <span className="text-xs font-bold">Present</span>
                                                </button>

                                                {/* Absent Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'Absent')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'Absent'
                                                        ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-red-300 hover:text-red-500'}`}
                                                >
                                                    <XCircle size={16} />
                                                    <span className="text-xs font-bold">Absent</span>
                                                </button>

                                                {/* Late Button */}
                                                <button
                                                    onClick={() => handleMark(student.id, 'Late')}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${status === 'Late'
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
                            <div className="p-10 text-center text-slate-400">
                                {exams.length === 0 ? "Loading Exams..." : "No students found for this exam's program."}
                            </div>
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

export default ExaminationAttendance;
