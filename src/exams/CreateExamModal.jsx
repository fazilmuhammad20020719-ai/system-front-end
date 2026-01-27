import { useState, useEffect } from 'react';
import { X, Save, Users, Check, AlertCircle, CheckCircle, Plus, Minus, Layers, Calendar, Clock, MapPin, Hash } from 'lucide-react';
import { API_URL } from '../config';

const CreateExamModal = ({ isOpen, onClose, onSave, slot }) => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        title: '',
        grade: '',
        subjectId: '',
        description: '',
        examType: 'Single' // 'Single' or 'Multi'
    });

    // Parts State
    const [parts, setParts] = useState([
        { name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }
    ]);
    const [partCount, setPartCount] = useState(2);

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectedAllStudents, setSelectedAllStudents] = useState(false);

    // Data
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [showSummary, setShowSummary] = useState(false);

    // --- Data Loading ---
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [subRes, stuRes, progRes] = await Promise.all([
                        fetch(`${API_URL}/api/subjects`),
                        fetch(`${API_URL}/api/students`),
                        fetch(`${API_URL}/api/programs`)
                    ]);

                    if (subRes.ok) setSubjects(await subRes.json());
                    if (stuRes.ok) setStudents(await stuRes.json());
                    if (progRes.ok) setPrograms(await progRes.json());

                    // Reset State
                    setFormData({
                        title: '',
                        grade: '',
                        subjectId: '',
                        description: '',
                        examType: 'Single'
                    });
                    setParts([{ name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }]);
                    setPartCount(2);
                    setSelectedStudentIds([]);
                    setSelectedAllStudents(false);
                    setTouched({});
                    setShowSummary(false);

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [isOpen, slot]);

    // --- Logic & Filtering ---

    // 1. Available Grades (Respect Slot's Program Duration if applicable)
    const slotProgram = slot?.program_id ? programs.find(p => p.id === parseInt(slot.program_id)) : null;
    const maxGrade = slotProgram?.duration ? parseInt(slotProgram.duration) : 13;
    const availableGrades = Array.from({ length: maxGrade }, (_, i) => `Grade ${i + 1}`);

    // 2. Filtered Subjects (Based on Grade AND Slot's Program if applicable)
    const availableSubjects = subjects.filter(s => {
        const gradeMatch = formData.grade && (s.year === formData.grade || s.year === formData.grade.replace('Grade ', ''));
        // If we are in a slot, strictly show subjects for that slot's program. 
        // If not, show all subjects for that grade.
        const programMatch = slot?.program_id ? s.program_id === parseInt(slot.program_id) : true;
        return gradeMatch && programMatch;
    });

    // 3. Filtered Students
    const availableStudents = students.filter(s => {
        const gradeMatch = formData.grade && (s.currentYear === formData.grade || s.currentYear === formData.grade.replace('Grade ', ''));
        const programMatch = slot?.program_id ? String(s.program_id) === String(slot.program_id) : true;
        return gradeMatch && programMatch;
    });

    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };

            // Reset dependent fields
            if (name === 'grade') {
                updates.subjectId = '';
                setSelectedStudentIds([]);
                setSelectedAllStudents(false);
            }

            return updates;
        });
    };

    const handleTypeChange = (type) => { // 'Single' or 'Multi'
        setFormData(prev => ({ ...prev, examType: type }));

        if (type === 'Single') {
            setParts([{ name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }]);
        } else {
            syncPartsWithCount(partCount);
        }
    };

    const handlePartCountChange = (increment) => {
        const newCount = partCount + increment;
        if (newCount < 1) return;
        if (newCount > 10) return;

        setPartCount(newCount);
        syncPartsWithCount(newCount);
    };

    const syncPartsWithCount = (count) => {
        setParts(prev => {
            const newParts = [...prev];
            if (count > prev.length) {
                for (let i = prev.length; i < count; i++) {
                    newParts.push({ name: `Part ${i + 1}`, date: '', startTime: '', endTime: '', venue: '' });
                }
            } else if (count < prev.length) {
                newParts.splice(count);
            }
            return newParts.map((p, i) => ({ ...p, name: `Part ${i + 1}` }));
        });
    };

    const handlePartChange = (index, field, value) => {
        setParts(prev => {
            const newParts = [...prev];
            newParts[index] = { ...newParts[index], [field]: value };
            return newParts;
        });
    };

    const toggleStudent = (id) => {
        if (selectedAllStudents) return;
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSelectAllToggle = () => {
        const newValue = !selectedAllStudents;
        setSelectedAllStudents(newValue);
        if (newValue) {
            setSelectedStudentIds(availableStudents.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    // --- Validation ---
    const getErrors = () => {
        const errors = {};
        if (!formData.grade) errors.grade = "Grade is required";
        if (!formData.subjectId) errors.subjectId = "Subject is required";

        if (selectedStudentIds.length === 0) errors.students = "Select at least one student";

        const partErrors = {};
        parts.forEach((part, index) => {
            if (!part.date) partErrors[`date_${index}`] = "Required";
            if (!part.startTime) partErrors[`start_${index}`] = "Required";
            if (!part.endTime) partErrors[`end_${index}`] = "Required";

            if (part.startTime && part.endTime && part.startTime >= part.endTime) {
                partErrors[`end_${index}`] = "Invalid";
            }
        });
        if (Object.keys(partErrors).length > 0) errors.parts = partErrors;

        return errors;
    };

    const errors = getErrors();
    const isValid = Object.keys(errors).length === 0;

    const handleInitialSubmit = () => {
        setTouched({
            grade: true, subjectId: true, students: true, parts: true
        });

        if (isValid) {
            setShowSummary(true);
        }
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));
            // Inferred Logic:
            // If slot exists, use its programId.
            // If not, try to use subject's programId.
            // If strictly needed, we assume the backend handles null or we rely on subject linkage.
            const inferredProgramId = slot?.program_id ? parseInt(slot.program_id) : selectedSubject?.program_id;

            const payload = {
                title: formData.title || `${selectedSubject?.name} - ${formData.grade} Exam`,
                grade: formData.grade,
                subjectId: formData.subjectId,
                programId: inferredProgramId,
                description: formData.description,
                examType: formData.examType,
                studentIds: selectedStudentIds,
                parts: parts,
                slotId: slot?.id || null
            };

            const response = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newExam = await response.json();
                onSave(newExam);
                onClose();
            } else {
                alert("Failed to create exam");
            }
        } catch (error) {
            console.error("Error creating exam:", error);
            alert("Error creating exam");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (showSummary) {
        const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Confirm Schedule
                        </h2>
                        <button onClick={() => setShowSummary(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Type</span>
                                <span className="font-medium">{formData.examType} ({parts.length} Parts)</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Grade</span>
                                <span className="font-medium">{formData.grade}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Subject</span>
                                <span className="font-medium">{selectedSubject?.name}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Students</span>
                                <span className="font-medium">{selectedStudentIds.length} Selected</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                            <p className="font-bold text-gray-500 text-xs uppercase mb-1">Schedule Details</p>
                            {parts.map((p, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <span className="text-gray-600">{p.name}</span>
                                    <span className="font-medium">{p.date} • {p.startTime}-{p.endTime}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleFinalSubmit} disabled={loading} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition-colors">
                            {loading ? 'Scheduling...' : 'Confirm & Create'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Create New Exam</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Configure exam structure, assign students, and set schedule.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* 1. Exam Type Selection */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">01</span> Exam Configuration
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 block">Exam Type</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleTypeChange('Single')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.examType === 'Single' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        Single Exam
                                    </button>
                                    <button
                                        onClick={() => handleTypeChange('Multi')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.examType === 'Multi' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        Multi-Part Exam
                                    </button>
                                </div>
                            </div>

                            {/* 2. Multi-Part Controller */}
                            {formData.examType === 'Multi' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="text-sm font-bold text-gray-700 block">Number of Parts</label>
                                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-2 w-fit">
                                        <button
                                            onClick={() => handlePartCountChange(-1)}
                                            className="p-1.5 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 text-gray-600"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold text-lg w-8 text-center text-gray-800">{partCount}</span>
                                        <button
                                            onClick={() => handlePartCountChange(1)}
                                            className="p-1.5 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 text-gray-600"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 3. Grade Selection */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">02</span> Target Grade
                        </div>
                        <div className="w-full md:w-1/2">
                            <label className="text-sm font-bold text-gray-700 block mb-1">Select Grade</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option value="">-- Choose Grade --</option>
                                {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            {touched.grade && errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade}</p>}
                        </div>
                    </section>

                    {/* Steps 4, 5, 6 - Unlocked after Grade */}
                    <div className={`space-y-8 transition-all duration-300 ${!formData.grade ? 'opacity-50 pointer-events-none grayscale' : ''}`}>

                        {/* 4. Student Selection */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">03</span> Students
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={selectedAllStudents}
                                            onChange={handleSelectAllToggle}
                                            className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                                        />
                                        <span className={`font-bold ${selectedAllStudents ? 'text-green-700' : 'text-gray-500'}`}>Select All Students</span>
                                    </label>
                                </div>
                            </div>

                            <div className={`border rounded-xl overflow-hidden transition-colors ${selectedAllStudents ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                                {selectedAllStudents ? (
                                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                        <CheckCircle size={32} className="text-green-500 mb-2" />
                                        <p className="font-medium">All {availableStudents.length} students in {formData.grade} selected.</p>
                                        <p className="text-xs mt-1">Individual selection is disabled.</p>
                                    </div>
                                ) : (
                                    <div className="max-h-48 overflow-y-auto p-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {availableStudents.length > 0 ? availableStudents.map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => toggleStudent(student.id)}
                                                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all ${selectedStudentIds.includes(student.id) ? 'bg-green-50 border-green-200' : 'border-transparent hover:bg-gray-50'}`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedStudentIds.includes(student.id) ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white'}`}>
                                                    {selectedStudentIds.includes(student.id) && <Check size={14} className="text-white" />}
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">{student.name}</span>
                                            </div>
                                        )) : (
                                            <div className="col-span-2 py-8 text-center text-gray-400 text-xs">No students found for {formData.grade}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.students && errors.students && <p className="text-xs text-red-500 font-medium">{errors.students}</p>}
                        </section>

                        {/* 5. Subject Selection */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">04</span> Subject
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Subject</label>
                                    <select
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option value="">-- Select Subject --</option>
                                        {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    {touched.subjectId && errors.subjectId && <p className="text-xs text-red-500 mt-1">{errors.subjectId}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="e.g. Unit 1-5"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 6. Date & Time Selection */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">05</span> Date & Time
                            </div>

                            <div className="space-y-4">
                                {parts.map((part, index) => (
                                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 animate-in fade-in duration-300">
                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {part.name}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Date</label>
                                                <div className="relative">
                                                    <Calendar size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        value={part.date}
                                                        onChange={(e) => handlePartChange(index, 'date', e.target.value)}
                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none ${touched.parts && errors.parts?.[`date_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Start Time</label>
                                                <div className="relative">
                                                    <Clock size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                                    <input
                                                        type="time"
                                                        value={part.startTime}
                                                        onChange={(e) => handlePartChange(index, 'startTime', e.target.value)}
                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none ${touched.parts && errors.parts?.[`start_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">End Time</label>
                                                <div className="relative">
                                                    <Clock size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                                    <input
                                                        type="time"
                                                        value={part.endTime}
                                                        onChange={(e) => handlePartChange(index, 'endTime', e.target.value)}
                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none ${touched.parts && errors.parts?.[`end_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Venue (Optional)</label>
                                                <div className="relative">
                                                    <MapPin size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={part.venue}
                                                        onChange={(e) => handlePartChange(index, 'venue', e.target.value)}
                                                        placeholder="Hall A"
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end gap-3 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInitialSubmit}
                        disabled={loading}
                        className={`flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={16} /> Save Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateExamModal;
