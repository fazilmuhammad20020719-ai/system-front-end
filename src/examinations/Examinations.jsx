import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    CheckCircle,
    Calendar,
    ChevronDown,
    Save
} from 'lucide-react';
import Sidebar from '../Sidebar';

const Examinations = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('exams'); // 'exams' | 'results'

    // --- MOCK DATA ---
    const exams = [
        { id: 1, name: "Term 1 Examination 2025", type: "Term Test", startDate: "2025-03-15", endDate: "2025-03-25", status: "Scheduled" },
        { id: 2, name: "Monthly Assessment - Jan", type: "Assessment", startDate: "2025-01-28", endDate: "2025-01-30", status: "Active" },
    ];

    const resultStudents = [
        { id: 101, name: "Ahamad Fazil", index: "STU-001", marks: "" },
        { id: 102, name: "Mohamed Rizan", index: "STU-002", marks: "" },
        { id: 103, name: "Fathima Nuzha", index: "STU-003", marks: "" },
        { id: 104, name: "Yusuf Khan", index: "STU-004", marks: "" },
    ];

    // --- STATE FOR RESULTS ENTRY ---
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [studentMarks, setStudentMarks] = useState(resultStudents);

    const handleMarkChange = (id, value) => {
        setStudentMarks(studentMarks.map(s => s.id === id ? { ...s, marks: value } : s));
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <main className="p-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Examinations</h1>
                            <p className="text-gray-500 text-sm">Manage exams and enter student results</p>
                        </div>
                        {activeTab === 'exams' && (
                            <button className="bg-[#EB8A33] hover:bg-[#d67b28] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                                <Plus size={18} /> New Exam
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('exams')}
                            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'exams' ? 'text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Exam List
                            {activeTab === 'exams' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EB8A33] rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'results' ? 'text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Results Entry
                            {activeTab === 'results' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EB8A33] rounded-t-full"></div>}
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    {activeTab === 'exams' ? (
                        /* --- EXAM MANAGEMENT TAB --- */
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Exam Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Start Date</th>
                                        <th className="px-6 py-4">End Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {exams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-800">{exam.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{exam.type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{exam.startDate}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{exam.endDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${exam.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {exam.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* --- RESULTS ENTRY TAB --- */
                        <div className="space-y-6">
                            {/* Filters Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Select Exam Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Exam</label>
                                        <div className="relative">
                                            <select
                                                value={selectedExam}
                                                onChange={(e) => setSelectedExam(e.target.value)}
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:border-[#EB8A33] outline-none appearance-none"
                                            >
                                                <option value="">Select Exam</option>
                                                {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Class / Program</label>
                                        <div className="relative">
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:border-[#EB8A33] outline-none appearance-none"
                                            >
                                                <option value="">Select Class</option>
                                                <option value="year1">Al-Alimah Year 1</option>
                                                <option value="year2">Hifz Class A</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Subject</label>
                                        <div className="relative">
                                            <select
                                                value={selectedSubject}
                                                onChange={(e) => setSelectedSubject(e.target.value)}
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:border-[#EB8A33] outline-none appearance-none"
                                            >
                                                <option value="">Select Subject</option>
                                                <option value="fiqh">Fiqh</option>
                                                <option value="aqidah">Aqidah</option>
                                                <option value="arabic">Arabic Language</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Results Table (Only Show if Filters Selected) */}
                            {selectedExam && selectedClass && selectedSubject ? (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-700">Student Marks</h3>
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm">
                                            <Save size={14} /> Save Results
                                        </button>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold bg-white">
                                            <tr>
                                                <th className="px-6 py-4 w-20">#</th>
                                                <th className="px-6 py-4">Index No</th>
                                                <th className="px-6 py-4">Student Name</th>
                                                <th className="px-6 py-4 w-40">Marks (100)</th>
                                                <th className="px-6 py-4">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {studentMarks.map((student, index) => {
                                                const mark = parseInt(student.marks) || 0;
                                                let grade = "-";
                                                if (student.marks) {
                                                    if (mark >= 75) grade = "A";
                                                    else if (mark >= 65) grade = "B";
                                                    else if (mark >= 50) grade = "C";
                                                    else if (mark >= 35) grade = "S";
                                                    else grade = "F";
                                                }

                                                return (
                                                    <tr key={student.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-3 text-gray-400 font-medium">{index + 1}</td>
                                                        <td className="px-6 py-3 text-sm font-mono text-gray-500">{student.index}</td>
                                                        <td className="px-6 py-3 font-medium text-gray-800">{student.name}</td>
                                                        <td className="px-6 py-3">
                                                            <input
                                                                type="number"
                                                                max="100"
                                                                value={student.marks}
                                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded-lg text-center font-bold focus:border-[#EB8A33] outline-none"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <span className={`font-bold inline-block w-8 text-center ${grade === 'A' ? 'text-green-600' :
                                                                    grade === 'F' ? 'text-red-600' :
                                                                        'text-gray-600'
                                                                }`}>
                                                                {grade}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>Select Exam, Class, and Subject to enter results.</p>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Examinations;
