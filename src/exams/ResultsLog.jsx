// src/exams/ResultsLog.jsx
import { useState, useEffect } from 'react';
import { Filter, Download, Save, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const ResultsLog = ({ exams: propExams }) => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
                    setResults(data);
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
        setResults(prev => prev.map(r => {
            if (r.student_id === studentId) {
                return {
                    ...r,
                    marks_obtained: newMarks,
                    grade: calculateGrade(newMarks),
                    status: calculateStatus(newMarks)
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
                examId: selectedExamId,
                results: results.map(r => ({
                    studentId: r.student_id,
                    marks: r.marks_obtained,
                    grade: r.grade,
                    status: r.status,
                    remarks: r.remarks
                }))
            };

            const res = await fetch(`${API_URL}/api/exams/results`, {
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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            {/* Filters Header */}
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm w-full md:w-64">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={selectedExamId}
                            onChange={(e) => setSelectedExamId(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none text-slate-700 w-full"
                        >
                            <option value="">Select Exam</option>
                            {exams.map(e => (
                                <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-bold">
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedExamId}
                        className={`flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${saving ? "opacity-70" : "hover:bg-green-700 active:scale-95"}`}
                    >
                        {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Marks (0-100)</th>
                            <th className="px-6 py-4">Grade</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center text-slate-500">Loading Results...</td></tr>
                        ) : results.length === 0 ? (
                            <tr><td colSpan="4" className="p-10 text-center text-slate-400">
                                {selectedExamId ? "No students found for this exam's program." : "Please select an exam to view results."}
                            </td></tr>
                        ) : (
                            results.map((row) => (
                                <tr key={row.student_id} className="hover:bg-green-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {row.student_name}
                                        <span className="text-slate-400 text-xs ml-2">#{row.student_id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={row.marks_obtained || ''}
                                                onChange={(e) => handleMarksChange(row.student_id, e.target.value)}
                                                className="w-20 px-2 py-1 border border-slate-200 rounded text-center font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                            <span className="text-slate-400 text-sm ml-1">/ 100</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${!row.grade ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {row.grade || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.status && (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {row.status === 'Pass' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                {row.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsLog;
