import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Users, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const ExamManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [exam, setExam] = useState(null);
    const [students, setStudents] = useState([]);

    // 1. Fetch Exam & Students
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/exams/${id}/details`);
                if (res.ok) {
                    const data = await res.json();
                    setExam(data.exam);
                    // Initialize results based on fetched data or defaults
                    const initializedStudents = data.students.map(s => ({
                        ...s,
                        marks: s.marks_obtained || '',
                        grade: s.grade || '',
                        status: s.attendance_status || 'Present',
                        remarks: s.remarks || ''
                    }));
                    setStudents(initializedStudents);
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    // 2. Handle Mark Change
    const handleResultChange = (studentId, field, value) => {
        setStudents(prev => prev.map(s =>
            s.student_id === studentId ? { ...s, [field]: value } : s
        ));
    };

    // 3. Save Results
    const handleSave = async () => {
        try {
            const payload = students.map(s => ({
                student_id: s.student_id,
                marks: s.marks === '' ? null : s.marks,
                grade: s.grade,
                status: s.status,
                remarks: s.remarks
            }));

            const res = await fetch(`${API_URL}/api/exams/${id}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: payload })
            });

            if (res.ok) alert('Results saved successfully!');
        } catch (err) { alert('Failed to save'); }
    };

    if (loading) return <div>Loading...</div>;
    if (!exam) return <div>Exam not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#ea8933]">
                    <ArrowLeft size={20} className="mr-2" /> Back to Exams
                </button>
                <div className="flex gap-3">
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-[#ea8933] text-white rounded-xl hover:bg-[#d67b2b]">
                        <Save size={20} /> Save Results
                    </button>
                </div>
            </div>

            {/* Exam Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
                <div className="flex gap-6 mt-2 text-sm text-gray-500">
                    <span>Program: {exam.program_name}</span>
                    <span>Subject: {exam.subject_name}</span>
                    <span>Date: {new Date(exam.exam_date).toDateString()}</span>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-gray-600">Student</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-600">Marks (/{exam.total_marks})</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-600">Grade</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-600">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <tr key={student.student_id} className="hover:bg-gray-50">
                                <td className="py-4 px-6">
                                    <div className="font-medium text-gray-800">{student.name}</div>
                                    <div className="text-xs text-gray-500">{student.reg_no}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <select
                                        value={student.status}
                                        onChange={(e) => handleResultChange(student.student_id, 'status', e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm border ${student.status === 'Absent' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'
                                            }`}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Excused">Excused</option>
                                    </select>
                                </td>
                                <td className="py-4 px-6">
                                    <input
                                        type="number"
                                        disabled={student.status === 'Absent'}
                                        value={student.marks}
                                        onChange={(e) => handleResultChange(student.student_id, 'marks', e.target.value)}
                                        className="w-24 p-2 border rounded-lg text-center disabled:bg-gray-100"
                                    />
                                </td>
                                <td className="py-4 px-6">
                                    <input
                                        type="text"
                                        value={student.grade}
                                        onChange={(e) => handleResultChange(student.student_id, 'grade', e.target.value)}
                                        className="w-20 p-2 border rounded-lg text-center uppercase"
                                    />
                                </td>
                                <td className="py-4 px-6">
                                    <input
                                        type="text"
                                        value={student.remarks}
                                        onChange={(e) => handleResultChange(student.student_id, 'remarks', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Optional..."
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamManager;