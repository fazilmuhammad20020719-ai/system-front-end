import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const CreateExam = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Student Selection State
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

    // 1. Fetch Programs & Students
    useEffect(() => {
        const fetchData = async () => {
            const [progRes, studRes] = await Promise.all([
                fetch(`${API_URL}/api/programs`),
                fetch(`${API_URL}/api/students`)
            ]);
            const progs = await progRes.json();
            const studs = await studRes.json();
            setPrograms(progs);
            setAllStudents(studs);
        };
        fetchData();
    }, []);

    // 2. Fetch Subjects when Program changes
    useEffect(() => {
        if (formData.program_id) {
            // Fetch Subjects
            fetch(`${API_URL}/api/subjects?programId=${formData.program_id}`)
                .then(res => res.json())
                .then(setSubjects)
                .catch(() => {
                    fetch(`${API_URL}/api/subjects`).then(res => res.json()).then(setSubjects);
                });

            // Reset Selections
            setSelectedGrade('');
            setSelectedStudentIds([]);
            setFilteredStudents([]);
        }
    }, [formData.program_id]);

    // 3. Filter Students when Grade changes
    useEffect(() => {
        if (formData.program_id && selectedGrade) {
            const relevantStudents = allStudents.filter(s =>
                s.program_id == formData.program_id && s.current_year === selectedGrade
            );
            setFilteredStudents(relevantStudents);
            // Auto Select All? Let's default to empty or all? User asked for "all student select btn", so default empty.
            setSelectedStudentIds([]);
        } else {
            setFilteredStudents([]);
        }
    }, [selectedGrade, formData.program_id, allStudents]);

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

        // Fallback: Use existing student grades if duration parse fails
        return [...new Set(
            allStudents
                .filter(s => s.program_id == formData.program_id)
                .map(s => s.current_year)
                .filter(g => g)
        )].sort();
    })();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Exam
            const res = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const createdExam = await res.json();

                // 2. Assign Results (if students selected)
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

                navigate('/examinations');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 hover:text-[#ea8933]">
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule New Exam</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                            <input required type="text" className="w-full p-3 border rounded-lg"
                                placeholder="e.g. First Term Mathematics"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                            <select required className="w-full p-3 border rounded-lg"
                                value={formData.program_id} onChange={e => setFormData({ ...formData, program_id: e.target.value })}>
                                <option value="">Select Program</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        {/* Grade Selection (Only if program selected) */}
                        {formData.program_id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Grade/Class</label>
                                <select
                                    className="w-full p-3 border rounded-lg"
                                    value={selectedGrade}
                                    onChange={e => setSelectedGrade(e.target.value)}
                                >
                                    <option value="">-- Choose Grade --</option>
                                    {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Student Selection Area */}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
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

                    {/* Subject & Timing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select required className="w-full p-3 border rounded-lg"
                                value={formData.subject_id} onChange={e => setFormData({ ...formData, subject_id: e.target.value })}>
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input required type="date" className="w-full p-3 border rounded-lg"
                                value={formData.exam_date} onChange={e => setFormData({ ...formData, exam_date: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                            <input required type="time" className="w-full p-3 border rounded-lg"
                                value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                            <input required type="time" className="w-full p-3 border rounded-lg"
                                value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                            <input required type="number" className="w-full p-3 border rounded-lg"
                                value={formData.total_marks} onChange={e => setFormData({ ...formData, total_marks: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                        <input type="text" className="w-full p-3 border rounded-lg"
                            placeholder="Hall A"
                            value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                    </div>

                    <button type="submit" className="w-full bg-[#ea8933] text-white py-3 rounded-lg font-bold hover:bg-[#d67b2b]">
                        <Save className="inline mr-2" size={20} /> Schedule Exam
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateExam;
