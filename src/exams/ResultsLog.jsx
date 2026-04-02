// src/exams/ResultsLog.jsx
import { useState, useEffect } from 'react';
import { Filter, Download, Save, Search, CheckCircle, AlertCircle, Calendar, UserCheck, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

const ResultsLog = ({ slotId, exams: propExams, initialExamId }) => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(initialExamId || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState(null);

    // Fetch Exams on Mount or use Props
    useEffect(() => {
        if (propExams) {
            setExams(propExams);
            return;
        }

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

    // Fetch Results when Exam Selected
    useEffect(() => {
        if (!selectedExamId) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/results`);
                if (res.ok) {
                    const data = await res.json();
                    const processedData = data.map(r => ({
                        ...r,
                        // Remember if they were marked absent in attendance
                        is_absent: r.status === 'Absent',
                        // Clear the frontend UI status badge unless it's a graded result (Pass/Fail)
                        status: (r.status === 'Pass' || r.status === 'Fail') ? r.status : ''
                    }));
                    setResults(processedData);
                }
            } catch (err) {
                console.error("Error fetching results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [selectedExamId]);

    // Calculate Grade Helper (Simple Logic - can be expanded)
    const calculateGrade = (marks) => {
        if (!marks && marks !== 0) return '';
        const m = parseInt(marks);
        if (m >= 90) return 'A+';
        if (m >= 80) return 'A';
        if (m >= 70) return 'B';
        if (m >= 60) return 'C';
        if (m >= 50) return 'S';
        return 'F';
    };

    const calculateStatus = (marks) => {
        if (!marks && marks !== 0) return '';
        return parseInt(marks) >= 50 ? 'Pass' : 'Fail';
    };

    // Handle Input Change
    const handleMarksChange = (studentId, newMarks) => {
        // Enforce 0-100 range constraints
        let validMarks = newMarks;
        if (newMarks !== '') {
            let num = parseInt(newMarks, 10);
            if (isNaN(num)) num = 0;
            if (num > 100) num = 100;
            if (num < 0) num = 0;
            validMarks = num.toString();
        }

        setResults(prev => prev.map(r => {
            if (r.student_id === studentId) {
                return {
                    ...r,
                    marks_obtained: validMarks,
                    grade: calculateGrade(validMarks),
                    status: calculateStatus(validMarks)
                };
            }
            return r;
        }));
    };

    // Save Results
    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                results: results.map(r => ({
                    id: r.student_id,
                    marks_obtained: r.marks_obtained,
                    grade: r.grade,
                    // Send back the correct DB status: Absent, or the Pass/Fail calculation, or default to Present if ungraded
                    status: r.is_absent ? 'Absent' : (r.status || 'Present'),
                    remarks: r.remarks
                }))
            };

            const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Results saved successfully!");
            } else {
                alert("Failed to save results.");
            }
        } catch (err) {
            console.error("Error saving results:", err);
            alert("Error saving results.");
        } finally {
            setSaving(false);
        }
    };

    const getStats = () => {
        const total = results.length;
        const pass = results.filter(r => r.status === 'Pass').length;
        const fail = results.filter(r => r.status === 'Fail').length;
        const pending = results.filter(r => r.marks_obtained === null || r.marks_obtained === '').length;
        return { total, pass, fail, pending };
    };

    const handleUploadPaper = async (studentId, file) => {
        setUploadingId(studentId);
        try {
            const formData = new FormData();
            formData.append('paper', file);

            const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/results/${studentId}/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setResults(prev => prev.map(r => r.student_id === studentId ? { ...r, paper_url: data.url } : r));
            } else {
                alert("Failed to upload paper.");
            }
        } catch (err) {
            console.error("Error uploading paper:", err);
            alert("Error uploading paper.");
        } finally {
            setUploadingId(null);
        }
    };

    const handleDeletePaper = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this exam paper?")) return;
        setUploadingId(studentId); // Reusing uploadingId flag for the loading spinner
        try {
            const res = await fetch(`${API_URL}/api/exams/${selectedExamId}/results/${studentId}/upload`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setResults(prev => prev.map(r => r.student_id === studentId ? { ...r, paper_url: null } : r));
            } else {
                alert("Failed to delete paper.");
            }
        } catch (err) {
            console.error("Error deleting paper:", err);
            alert("Error deleting paper.");
        } finally {
            setUploadingId(null);
        }
    };

    const stats = getStats();

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
                            <option value="">-- Choose Exam to Input Results --</option>
                            {exams.map(e => (
                                <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedExamId && (
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Total</span>
                            <span className="text-xl font-bold">{stats.total}</span>
                        </div>
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Passed</span>
                            <span className="text-xl font-bold">{stats.pass}</span>
                        </div>
                        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Failed</span>
                            <span className="text-xl font-bold">{stats.fail}</span>
                        </div>
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg border border-orange-100 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold uppercase">Pending</span>
                            <span className="text-xl font-bold">{stats.pending}</span>
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
                                // We don't have search implemented but it looks good for UI consistency
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => alert("Export functionality coming soon. You can print this page or copy the data manually.")}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition"
                            >
                                <Download size={16} /> Export
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition border border-transparent ${saving ? "opacity-70" : "hover:bg-green-700 active:scale-95"}`}
                            >
                                {saving ? "Saving..." : <><Save size={16} /> Save Results</>}
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="flex-1 overflow-y-auto p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 sticky top-0 z-10 text-xs uppercase text-slate-500 font-bold">
                                <tr>
                                    <th className="p-4 border-b">Student Name</th>
                                    <th className="p-4 border-b text-center">Marks (0-100)</th>
                                    <th className="p-4 border-b text-center">Grade</th>
                                    <th className="p-4 border-b text-center">Exam Paper</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-500 font-bold">Loading Results...</td></tr>
                                ) : results.length === 0 ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400">
                                        No students found for this exam's program.
                                    </td></tr>
                                ) : (
                                    results.map((row) => (
                                        <tr key={row.student_id} className="hover:bg-green-50/20 transition-colors">
                                            <td className="p-4 font-medium text-slate-700">
                                                <div className="font-bold text-sm text-slate-800">{row.student_name}</div>
                                                <div className="text-xs text-slate-400">ID: {row.student_id}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={row.marks_obtained !== null ? row.marks_obtained : ''}
                                                        onChange={(e) => handleMarksChange(row.student_id, e.target.value)}
                                                        disabled={row.is_absent}
                                                        className={`w-20 px-2 py-1.5 border rounded-md text-center font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm ${row.is_absent ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' : 'bg-white border-slate-300'}`}
                                                        placeholder={row.is_absent ? "Abs" : "-"}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`font-bold inline-block min-w-[30px] ${(!row.grade || row.is_absent) ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {row.grade || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-center mt-2">
                                                {row.is_absent ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-slate-100 text-slate-500 border border-slate-200">
                                                        <AlertCircle size={14} /> Absent (Locked)
                                                    </span>
                                                ) : uploadingId === row.student_id ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-50 text-blue-600 border border-blue-200">
                                                        <Loader2 size={14} className="animate-spin" /> Uploading...
                                                    </span>
                                                ) : row.paper_url ? (
                                                    <div className="flex items-center gap-2">
                                                        <a 
                                                            href={`${API_URL}/${row.paper_url}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition"
                                                        >
                                                            <Download size={14} /> Download
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDeletePaper(row.student_id)}
                                                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"
                                                            title="Remove Paper"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <input 
                                                            type="file" 
                                                            id={`upload-${row.student_id}`}
                                                            className="hidden"
                                                            accept=".pdf,image/*,.doc,.docx"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleUploadPaper(row.student_id, e.target.files[0]);
                                                                }
                                                                e.target.value = null; // reset input
                                                            }}
                                                        />
                                                        <label 
                                                            htmlFor={`upload-${row.student_id}`}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition"
                                                        >
                                                            <UploadCloud size={14} /> Upload Paper
                                                        </label>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 gap-4">
                    <div className="bg-white p-6 rounded-full shadow-sm">
                        <UserCheck size={64} className="text-slate-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-600">No Exam Selected</h3>
                        <p>Please select an exam from the dropdown above to view or input results.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsLog;
