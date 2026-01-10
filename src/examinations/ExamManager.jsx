import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle, XCircle, Printer, Filter, UserCheck, Calculator } from 'lucide-react';
import Sidebar from '../Sidebar';

const ExamManager = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'marks' | 'report'
    const [selectedSubject, setSelectedSubject] = useState('Fiqh'); // Default Subject

    // MOCK DATA (In real app, fetch based on examId)
    const subjects = ['Fiqh', 'Aqidah', 'Arabic', 'Tajweed'];

    // STUDENTS DATA
    // 'status': 'Present' | 'Absent'
    // 'marks': 0-100
    const [studentData, setStudentData] = useState([
        { id: 101, name: "Ahamad Fazil", index: "STU-001", attendance: "Present", marks: "" },
        { id: 102, name: "Mohamed Rizan", index: "STU-002", attendance: "Present", marks: "" },
        { id: 103, name: "Fathima Nuzha", index: "STU-003", attendance: "Absent", marks: "" }, // Absent Student
        { id: 104, name: "Yusuf Khan", index: "STU-004", attendance: "Present", marks: "" },
    ]);

    // --- LOGIC HELPERS ---

    const toggleAttendance = (id) => {
        setStudentData(studentData.map(s =>
            s.id === id ? { ...s, attendance: s.attendance === "Present" ? "Absent" : "Present" } : s
        ));
    };

    const handleMarkChange = (id, value) => {
        let val = parseInt(value);
        if (val > 100) val = 100;
        if (val < 0) val = 0;
        setStudentData(studentData.map(s => s.id === id ? { ...s, marks: val } : s));
    };

    const calculateGrade = (marks) => {
        if (!marks && marks !== 0) return "-";
        if (marks >= 75) return "A";
        if (marks >= 65) return "B";
        if (marks >= 50) return "C";
        if (marks >= 35) return "S";
        return "F";
    };

    // Calculate Stats
    const stats = useMemo(() => {
        const total = studentData.length;
        const present = studentData.filter(s => s.attendance === "Present").length;
        const passed = studentData.filter(s => s.attendance === "Present" && s.marks >= 35).length;
        return { total, present, absent: total - present, passed };
    }, [studentData]);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="p-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/examinations')} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Exam Manager</h1>
                                <p className="text-sm text-gray-500">Term 1 Examination 2025 • Year 1</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-4 py-2 rounded-lg border text-sm">
                                <span className="text-gray-500">Subject:</span>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="font-bold text-gray-800 ml-2 outline-none cursor-pointer"
                                >
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Students</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-green-500 uppercase font-bold">Present</p>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-red-500 uppercase font-bold">Absent</p>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-blue-500 uppercase font-bold">Pass Rate</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.present > 0 ? Math.round((stats.passed / stats.present) * 100) : 0}%
                            </p>
                        </div>
                    </div>

                    {/* TABS Navigation */}
                    <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl w-fit border shadow-sm">
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'attendance' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <UserCheck size={16} /> Attendance
                        </button>
                        <button
                            onClick={() => setActiveTab('marks')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'marks' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Calculator size={16} /> Marks Entry
                        </button>
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'report' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Filter size={16} /> Result Sheet
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* TAB 1: ATTENDANCE */}
                        {activeTab === 'attendance' && (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Index No</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {studentData.map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-gray-500 text-sm">{student.index}</td>
                                            <td className="px-6 py-4 font-bold text-gray-700">{student.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.attendance === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {student.attendance}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => toggleAttendance(student.id)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${student.attendance === 'Present'
                                                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                            : 'border-green-200 text-green-600 hover:bg-green-50'
                                                        }`}
                                                >
                                                    Mark {student.attendance === 'Present' ? 'Absent' : 'Present'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* TAB 2: MARKS ENTRY */}
                        {activeTab === 'marks' && (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Index</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4 text-center">Marks (100)</th>
                                        <th className="px-6 py-4 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {studentData.map(student => {
                                        const isAbsent = student.attendance === "Absent";
                                        return (
                                            <tr key={student.id} className={`hover:bg-gray-50 ${isAbsent ? 'bg-gray-50 opacity-60' : ''}`}>
                                                <td className="px-6 py-4 font-mono text-gray-500 text-sm">{student.index}</td>
                                                <td className="px-6 py-4 font-bold text-gray-700">
                                                    {student.name}
                                                    {isAbsent && <span className="ml-2 text-xs text-red-500 font-normal">(Absent)</span>}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="number"
                                                        disabled={isAbsent}
                                                        value={student.marks}
                                                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                        placeholder={isAbsent ? "ABS" : "-"}
                                                        className={`w-20 p-2 text-center border rounded-lg font-bold outline-none focus:border-[#EB8A33] ${isAbsent ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-600">
                                                    {isAbsent ? 'F' : calculateGrade(student.marks)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* TAB 3: REPORT VIEW */}
                        {activeTab === 'report' && (
                            <div>
                                <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-yellow-800 text-sm flex justify-between items-center">
                                    <span>🚀 This is a preview of the final result sheet for {selectedSubject}.</span>
                                    <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-yellow-200 text-xs font-bold hover:bg-yellow-100">
                                        <Printer size={14} /> Print / Export PDF
                                    </button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-gray-800 text-white text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4 text-center">Attendance</th>
                                            <th className="px-6 py-4 text-center">Marks</th>
                                            <th className="px-6 py-4 text-center">Grade</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {studentData.map(student => {
                                            const grade = student.attendance === 'Absent' ? 'F' : calculateGrade(student.marks);
                                            const status = grade === 'F' ? 'Fail' : 'Pass';
                                            return (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-3 font-bold text-gray-700">{student.name}</td>
                                                    <td className="px-6 py-3 text-center text-sm">{student.attendance}</td>
                                                    <td className="px-6 py-3 text-center font-mono">{student.marks || 0}</td>
                                                    <td className="px-6 py-3 text-center font-bold">{grade}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded ${status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Save Button for Marks/Attendance */}
                    {activeTab !== 'report' && (
                        <div className="mt-6 flex justify-end">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamManager;
