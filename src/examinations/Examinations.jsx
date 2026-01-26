import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, ChevronRight, BarChart3, Filter, Edit2, Trash2 } from 'lucide-react';
import Sidebar from '../Sidebar';
import { API_URL } from '../config';

const Examinations = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filter, setFilter] = useState('All');

    // -- MODAL STATE --
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);

    // -- FORM STATE (From CreateExam.jsx) --
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        program_id: '',
        subject_id: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        total_marks: 100
    });

    useEffect(() => {
        fetchExams();
        fetchProgramsAndStudents();
    }, []);

    const fetchProgramsAndStudents = async () => {
        try {
            const [progRes, studRes] = await Promise.all([
                fetch(`${API_URL}/api/programs`),
                fetch(`${API_URL}/api/students`)
            ]);
            const progs = await progRes.json();
            const studs = await studRes.json();
            setPrograms(progs);
            setAllStudents(studs);
        } catch (err) { console.error(err); }
    };

    // Derived Grades from Program Duration
    const availableGrades = (() => {
        const selectedProgram = programs.find(p => p.id == formData.program_id);
        if (!selectedProgram || !selectedProgram.duration) return [];

        const durationStr = String(selectedProgram.duration).toLowerCase();
        let years = 0;

        if (durationStr.includes('year')) {
            years = parseInt(durationStr);
        } else if (!isNaN(durationStr)) {
            years = parseInt(durationStr);
        }

        if (years > 0) {
            return Array.from({ length: years }, (_, i) => `Grade ${i + 1}`);
        }

        // Fallback
        return [...new Set(
            allStudents
                .filter(s => s.program_id == formData.program_id)
                .map(s => s.current_year)
                .filter(g => g)
        )].sort();
    })();

    // Fetch Subjects when Program changes
    useEffect(() => {
        if (formData.program_id) {
            fetch(`${API_URL}/api/subjects?programId=${formData.program_id}`)
                .then(res => res.json())
                .then(setSubjects)
                .catch(() => {
                    fetch(`${API_URL}/api/subjects`).then(res => res.json()).then(setSubjects);
                });

            setSelectedGrade('');
            setSelectedStudentIds([]);
            setFilteredStudents([]);
        }
    }, [formData.program_id]);

    // Filter Students when Grade changes (Robust Numeric Match)
    useEffect(() => {
        if (formData.program_id && selectedGrade) {
            // Extract number from selectedGrade (e.g. "Grade 1" -> 1)
            const selectedMatch = selectedGrade.match(/\d+/);
            const selectedYearNum = selectedMatch ? parseInt(selectedMatch[0]) : null;

            const relevantStudents = allStudents.filter(s => {
                if (s.program_id != formData.program_id) return false;

                // Extract number from student's current_year (e.g. "Year 1" -> 1, "1" -> 1)
                const studentYearStr = String(s.current_year || '');
                const studentMatch = studentYearStr.match(/\d+/);
                const studentYearNum = studentMatch ? parseInt(studentMatch[0]) : null;

                // Match if numbers are equal (and valid)
                return selectedYearNum !== null && studentYearNum !== null && selectedYearNum === studentYearNum;
            });

            setFilteredStudents(relevantStudents);
            setSelectedStudentIds([]);
        } else {
            setFilteredStudents([]);
        }
    }, [selectedGrade, formData.program_id, allStudents]);

    const toggleStudent = (id) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedStudentIds.length === filteredStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(filteredStudents.map(s => s.id));
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const createdExam = await res.json();

                if (selectedStudentIds.length > 0) {
                    const resultsPayload = selectedStudentIds.map(sid => ({
                        student_id: sid,
                        marks: null,
                        grade: null,
                        status: 'Pending',
                        remarks: ''
                    }));
                    await fetch(`${API_URL}/api/exams/${createdExam.id}/results`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ results: resultsPayload })
                    });
                }

                setIsModalOpen(false);
                fetchExams();
                // Reset form
                setFormData({
                    title: '', program_id: '', subject_id: '', exam_date: '',
                    start_time: '', end_time: '', venue: '', total_marks: 100
                });
                setSelectedGrade('');
                setSelectedStudentIds([]);
            }
        } catch (err) { console.error(err); }
    };

    const fetchExams = async () => {
        try {
            const response = await fetch(`${API_URL}/api/exams`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setExams(data);
                } else {
                    console.error('API returned non-array:', data);
                    setExams([]);
                }
            } else {
                console.error('Failed to fetch exams');
                setExams([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setExams([]);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Ongoing': return 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this exam?")) {
            try {
                const response = await fetch(`${API_URL}/api/exams/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setExams(exams.filter(e => e.id !== id));
                } else {
                    alert('Failed to delete exam');
                }
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Error deleting exam');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="p-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Examinations Dashboard</h1>
                            <p className="text-gray-500">Manage schedules, marks, and results</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                        >
                            <Plus size={20} /> Create New Exam
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 mb-6">
                        {['All', 'Upcoming', 'Ongoing', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${filter === f
                                    ? 'bg-white border-green-600 text-green-600 shadow-sm'
                                    : 'bg-transparent border-transparent text-gray-500 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Exam Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(exams) && exams.length > 0 ? (
                            exams.filter(e => filter === 'All' || e.status === filter).map((exam) => (
                                <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden group">

                                    {/* Actions (Edit/Delete) */}
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button
                                            onClick={() => handleDelete(exam.id)}
                                            className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 border border-gray-100 shadow-sm transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BarChart3 size={64} className="text-green-600" />
                                    </div>

                                    <div className="mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(exam.status)}`}>
                                            {exam.status}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-800 mb-1 pr-16">{exam.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">Target: {exam.program_name}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>Date: {new Date(exam.exam_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>Subject: {exam.subject_name} ({exam.subject_code})</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/examinations/manage/${exam.id}`)}
                                        className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-green-600 hover:text-green-600 font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-white"
                                    >
                                        Manage Exam <ChevronRight size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-400">
                                {loading ? "Loading exams..." : "No exams found. Click 'Create New Exam' to start."}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE EXAM MODAL (Program Style) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Schedule New Exam</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Exam Title</label>
                                    <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        placeholder="e.g. First Term Mathematics"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Program</label>
                                    <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                        value={formData.program_id} onChange={e => setFormData({ ...formData, program_id: e.target.value })}>
                                        <option value="">Select Program</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>

                                {formData.program_id && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Grade/Class</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                            value={selectedGrade}
                                            onChange={e => setSelectedGrade(e.target.value)}
                                        >
                                            <option value="">-- Choose Grade --</option>
                                            {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Student Selection */}
                            {selectedGrade && filteredStudents.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-gray-700">Select Students ({selectedStudentIds.length})</h3>
                                        <button
                                            type="button"
                                            onClick={toggleSelectAll}
                                            className="text-sm font-bold text-[#ea8933] hover:underline"
                                        >
                                            {selectedStudentIds.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
                                        {filteredStudents.map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => toggleStudent(student.id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedStudentIds.includes(student.id)
                                                    ? 'bg-white border-[#ea8933] shadow-sm'
                                                    : 'bg-white border-transparent hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedStudentIds.includes(student.id) ? 'bg-[#ea8933] border-[#ea8933]' : 'border-gray-300'
                                                    }`}>
                                                    {selectedStudentIds.includes(student.id) && <span className="text-white text-xs">✓</span>}
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-bold text-gray-800">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.reg_no}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                                    <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                        value={formData.subject_id} onChange={e => setFormData({ ...formData, subject_id: e.target.value })}>
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                    <input required type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        value={formData.exam_date} onChange={e => setFormData({ ...formData, exam_date: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Time</label>
                                    <input required type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">End Time</label>
                                    <input required type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Total Marks</label>
                                    <input required type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        value={formData.total_marks} onChange={e => setFormData({ ...formData, total_marks: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Venue</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                    placeholder="Hall A"
                                    value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a]"
                                >
                                    Schedule Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examinations;