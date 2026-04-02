// src/exams/ExaminationAttendance.jsx
import { useState, useEffect } from 'react';
import { Search, Calendar, UserCheck, XCircle, CheckCircle, Clock } from 'lucide-react';
import { API_URL } from '../config';

const ExaminationAttendance = ({ slotId, exams: propExams, initialExamId }) => {
    // --- State ---
    const [selectedExamId, setSelectedExamId] = useState(initialExamId || "");
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

    // Automatically select initial if passed subsequently
    useEffect(() => {
        if (initialExamId) {
            setSelectedExamId(initialExamId);
        }
    }, [initialExamId]);

    useEffect(() => {
        if (!selectedExamId) {
            setStudents([]);
            setAttendance({});
            return;
        }

        const fetchDetails = async () => {
            try {
                // Fetch accurately assigned students and their attendance status
                const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/results`);
                if (res.ok) {
                    const data = await res.json();
                    
                    const exam = exams.find(e => String(e.id) === String(selectedExamId));
                    
                    const mappedStudents = data.map(r => ({
                        id: r.student_id,
                        name: r.student_name,
                        program_name: exam?.program_name || '-'
                    }));
                    
                    setStudents(mappedStudents);

                    const attMap = {};
                    data.forEach(r => {
                        let st = r.status;
                        if (st === 'Pass' || st === 'Fail') st = 'Present';
                        attMap[r.student_id] = st;
                    });
                    setAttendance(attMap);
                }
            } catch (err) {
                console.error("Error fetching details:", err);
            }
        };

        fetchDetails();
    }, [selectedExamId, exams]);


    // --- Helpers ---
    const handleMark = (studentId, status) => {
        // UI Update
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleMarkAll = (status) => {
        const updates = {};
        students.forEach(s => updates[s.id] = status);
        setAttendance(prev => ({...prev, ...updates}));
    };

    const handleSaveAttendance = async () => {
        if (!selectedExamId) return;
        setSaving(true);
        try {
            // Only send attendance for students currently listed — avoids
            // accidentally updating rows from a previously selected exam.
            const filteredAttendance = {};
            students.forEach(s => {
                if (attendance[s.id] !== undefined) {
                    filteredAttendance[s.id] = attendance[s.id];
                }
            });

            const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/attendance/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attendanceData: filteredAttendance
                })
            });
            if (res.ok) {
                alert("Attendance saved successfully!");
            } else {
                alert("Failed to save attendance.");
            }
        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Error saving attendance.");
        } finally {
            setSaving(false);
        }
    };

    const getStats = () => {
        const total = students.length;
        // Count only against the currently displayed students to avoid stale map keys
        const present = students.filter(s => attendance[s.id] === 'Present').length;
        const absent  = students.filter(s => attendance[s.id] === 'Absent').length;
        const late    = students.filter(s => attendance[s.id] === 'Late').length;
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
                            <button onClick={() => handleMarkAll('Present')} className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Mark All Present</button>
                            <button onClick={() => handleMarkAll('Absent')} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Mark All Absent</button>
                            <button 
                                onClick={handleSaveAttendance} 
                                disabled={saving}
                                className={`px-4 py-2 text-sm font-bold text-white rounded shadow-md transition ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {saving ? 'Saving...' : 'Save Attendance'}
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
                                {students.length === 0 ? "No students found for this exam." : "No students match your search."}
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
