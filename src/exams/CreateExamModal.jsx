// src/exams/CreateExamModal.jsx
import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, BookOpen, Layers, Bookmark, Users, Check, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { API_URL } from '../config';

const CreateExamModal = ({ isOpen, onClose, onSave, slot }) => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        title: '',
        programId: slot?.program_id || '',
        grade: '',
        subjectId: '',
        description: '',
        examType: 'Single' // 'Single' or 'Multi'
    });

    // Parts State: Always an array. If Single, length is 1.
    const [parts, setParts] = useState([
        { name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }
    ]);

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]); // Mock Students
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({}); // Field touch state for error display
    const [showSummary, setShowSummary] = useState(false);

    // --- Data Loading ---
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [programsRes, subjectsRes, studentsRes] = await Promise.all([
                        fetch(`${API_URL}/api/programs`),
                        fetch(`${API_URL}/api/subjects`),
                        fetch(`${API_URL}/api/students`)
                    ]);

                    if (programsRes.ok) setPrograms(await programsRes.json());
                    if (subjectsRes.ok) setSubjects(await subjectsRes.json());
                    if (studentsRes.ok) setStudents(await studentsRes.json());

                    // Reset state (Preserve slot info if exists via prop)
                    setFormData({
                        title: '',
                        programId: slot?.program_id || '',
                        grade: '',
                        subjectId: '',
                        description: '',
                        examType: 'Single'
                    });
                    setParts([{ name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }]);
                    setSelectedStudentIds([]);
                    setTouched({});
                    setShowSummary(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [isOpen, slot]);

    // --- Computed / Derived Values ---

    // 1. Available Grades based on Program
    const selectedProgram = programs.find(p => p.id === parseInt(formData.programId));
    const duration = selectedProgram?.duration ? parseInt(selectedProgram.duration) : 0;
    const availableGrades = duration > 0
        ? Array.from({ length: duration }, (_, i) => `Grade ${i + 1}`)
        : [];

    // 2. Filtered Subjects
    const availableSubjects = subjects.filter(
        s => s.program_id === parseInt(formData.programId) &&
            (s.year === formData.grade || s.year === formData.grade.replace('Grade ', '') || !s.year)
    );
    const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));

    // 3. Filtered Students
    // Note: API returns currentYear (camelCase)
    const availableStudents = students.filter(s => {
        const pIdMatch = String(s.program_id) === String(formData.programId);
        const gradeMatch = s.currentYear === formData.grade || s.currentYear === formData.grade.replace('Grade ', '');
        return pIdMatch && gradeMatch;
    });

    // --- Progressive Disclosure State ---
    const isStep1Complete = formData.title && formData.programId && formData.grade;
    const isStep2Complete = formData.subjectId && selectedStudentIds.length > 0;

    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };

            // Dependency Resets
            if (name === 'programId') {
                updates.grade = '';
                updates.subjectId = '';
                setSelectedStudentIds([]);
            }
            if (name === 'grade') {
                updates.subjectId = '';
                setSelectedStudentIds([]);
            }

            return updates;
        });
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setFormData(prev => ({ ...prev, examType: type }));

        // Reset parts based on type
        if (type === 'Single') {
            setParts([{ name: 'Main Exam', date: '', startTime: '', endTime: '', venue: '' }]);
        } else {
            // Keep existing or reset to Multi default if empty (though rarely empty)
            if (parts.length === 0) {
                setParts([{ name: 'Part 1', date: '', startTime: '', endTime: '', venue: '' }, { name: 'Part 2', date: '', startTime: '', endTime: '', venue: '' }]);
            } else if (parts.length === 1 && parts[0].name === 'Main Exam') {
                // Converting from Single to Multi: Rename Main to Part 1 and maybe add Part 2? Or just keep it.
                // Let's just keep it as Part 1.
                setParts([{ ...parts[0], name: 'Part 1' }]);
            }
        }
    };

    const handlePartChange = (index, field, value) => {
        setParts(prev => {
            const newParts = [...prev];
            newParts[index] = { ...newParts[index], [field]: value };
            return newParts;
        });
    };

    const addPart = () => {
        setParts(prev => [
            ...prev,
            { name: `Part ${prev.length + 1}`, date: '', startTime: '', endTime: '', venue: '' }
        ]);
    };

    const removePart = (index) => {
        if (parts.length > 1) {
            setParts(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const toggleStudent = (id) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const toggleAllStudents = () => {
        if (selectedStudentIds.length === availableStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(availableStudents.map(s => s.id));
        }
    };

    // --- Validation Logic ---

    const getErrors = () => {
        const errors = {};
        if (!formData.title) errors.title = "Exam title is required";
        if (!formData.programId) errors.programId = "Program is required";
        if (!formData.grade) errors.grade = "Grade is required";
        if (!formData.subjectId) errors.subjectId = "Subject is required";

        if (selectedStudentIds.length === 0 && formData.grade) errors.students = "Select at least one student";

        // Validate Parts
        const now = new Date();
        const partErrors = {};
        parts.forEach((part, index) => {
            if (!part.date) partErrors[`date_${index}`] = "Date is required";
            if (!part.startTime) partErrors[`start_${index}`] = "Start time is required";
            if (!part.endTime) partErrors[`end_${index}`] = "End time is required";

            if (part.date && part.startTime) {
                const start = new Date(`${part.date}T${part.startTime}`);
                if (start <= now && index === 0) { // Only strict future check for 1st part usually, or all? Let's say all.
                    // errors[`future_${index}`] = "Must be in future"; 
                    // Relaxing future check for demo ease, or keep it strict?
                    // Strict: if (start <= now) partErrors[`start_${index}`] = "Must be future";
                }
                if (part.endTime) {
                    const end = new Date(`${part.date}T${part.endTime}`);
                    if (end <= start) partErrors[`end_${index}`] = "End > Start";
                }
            }
        });

        if (Object.keys(partErrors).length > 0) errors.parts = partErrors;

        return errors;
    };

    const errors = getErrors();
    const isValid = Object.keys(errors).length === 0;

    const handleInitialSubmit = () => {
        setTouched({
            title: true, programId: true, grade: true, subjectId: true,
            students: true, parts: true
        });

        if (isValid) {
            setShowSummary(true);
        }
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                studentIds: selectedStudentIds,
                slotId: slot?.id || null,
                parts: parts
            };

            const response = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newExam = await response.json();
                onSave({ ...newExam, id: newExam.id });
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
        // --- SUMMARY VIEW ---
        const sProgram = programs.find(p => p.id === parseInt(formData.programId));
        const sSubject = subjects.find(s => s.id === parseInt(formData.subjectId));

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Confirm Schedule
                        </h2>
                        <button onClick={() => setShowSummary(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4 text-sm max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Title</p><p>{formData.title}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Type</p><p>{formData.examType} Part</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Program</p><p>{sProgram?.name}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Grade</p><p>{formData.grade}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Subject</p><p>{sSubject?.name}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Students</p><p>{selectedStudentIds.length} Selected</p></div>
                        </div>

                        <div className="border-t pt-2">
                            <p className="font-bold text-gray-500 text-xs uppercase mb-2">Schedule</p>
                            {parts.map((p, i) => (
                                <div key={i} className="flex justify-between text-xs mb-1">
                                    <span className="font-medium">{p.name}</span>
                                    <span>{p.date} • {p.startTime} - {p.endTime}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-yellow-800 text-xs">
                            <AlertCircle size={14} className="inline mr-1 mb-0.5" />
                            Please double check the dates. Notifications will be sent to all selected students.
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button onClick={() => setShowSummary(false)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700">Back to Edit</button>
                        <button onClick={handleFinalSubmit} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700">
                            {loading ? 'Saving...' : 'Confirm & Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Schedule Examination</h2>
                        <p className="text-xs text-gray-500 mt-1">Setup exam details, assign students, and schedule timing.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8">
                    {/* Step 1: Basic Info */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-green-700 font-bold border-b border-green-100 pb-2">
                            <span className="bg-green-100 px-2 py-0.5 rounded text-sm">Step 1</span> Basic Information
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Exam Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={() => handleBlur('title')}
                                className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${touched.title && errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                                placeholder="e.g. Mid-Term Assessment"
                            />
                            {touched.title && errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Program <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Layers size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                    <select
                                        name="programId"
                                        value={formData.programId}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('programId')}
                                        disabled={!!slot} // Lock if slot provided
                                        className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 ${slot ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                                    >
                                        <option value="">Select Program</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Grade <span className="text-red-500">*</span></label>
                                <select
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('grade')}
                                    disabled={!formData.programId}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">{formData.programId ? "Select Grade" : "Select Program First"}</option>
                                    {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Exam Type Selection */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Presentation Mode</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="examType"
                                        value="Single"
                                        checked={formData.examType === 'Single'}
                                        onChange={handleTypeChange}
                                        className="text-green-600 focus:ring-green-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">Single Part</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="examType"
                                        value="Multi"
                                        checked={formData.examType === 'Multi'}
                                        onChange={handleTypeChange}
                                        className="text-green-600 focus:ring-green-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">Multi-Part (Part 1, Part 2...)</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Step 2: Assignments - Enabled when Step 1 is mostly done (Program & Grade) */}
                    <section className={`space-y-4 transition-all duration-300 ${!isStep1Complete ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <div className="flex items-center gap-2 text-blue-700 font-bold border-b border-blue-100 pb-2">
                            <span className="bg-blue-100 px-2 py-0.5 rounded text-sm">Step 2</span> Assignments
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Students Selection */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 flex flex-col">
                                <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Users size={14} /> Students
                                    </label>
                                    <button
                                        type="button"
                                        onClick={toggleAllStudents}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                                    >
                                        {selectedStudentIds.length === availableStudents.length ? 'Unselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                                    {availableStudents.length > 0 ? (
                                        availableStudents.map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => toggleStudent(student.id)}
                                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedStudentIds.includes(student.id) ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-100 border border-transparent'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedStudentIds.includes(student.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                                                    {selectedStudentIds.includes(student.id) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm text-gray-700">{student.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center mt-10">No students found for this grade.</p>
                                    )}
                                </div>
                                {touched.students && errors.students && <p className="text-xs text-red-500 mt-1 text-center font-medium bg-red-50 p-1 rounded">{errors.students}</p>}
                            </div>

                            {/* Subject Selection */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Subject <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Bookmark size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                        <select
                                            name="subjectId"
                                            value={formData.subjectId}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('subjectId')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="">Select Subject</option>
                                            {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    {touched.subjectId && errors.subjectId && <p className="text-xs text-red-500">{errors.subjectId}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Instructions for students..."
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Step 3: Timing - Multi-Part Aware */}
                    <section className={`space-y-4 transition-opacity duration-300 ${!isStep2Complete ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <div className="flex items-center gap-2 text-purple-700 font-bold border-b border-purple-100 pb-2">
                            <span className="bg-purple-100 px-2 py-0.5 rounded text-sm">Step 3</span> Schedule {formData.examType === 'Multi' ? 'Parts' : 'Timing'}
                        </div>

                        <div className="space-y-4">
                            {parts.map((part, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-sm text-gray-600 flex items-center gap-2">
                                            {formData.examType === 'Multi' ? (
                                                <input
                                                    value={part.name}
                                                    onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                                                    className="bg-transparent border-b border-dashed border-gray-400 text-gray-800 focus:outline-none focus:border-green-500 w-32"
                                                />
                                            ) : (
                                                <span className="uppercase text-xs tracking-wide">Standard Schedule</span>
                                            )}
                                        </h4>
                                        {formData.examType === 'Multi' && parts.length > 1 && (
                                            <button onClick={() => removePart(index)} className="text-red-400 hover:text-red-600 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date and Venue */}
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">Date</label>
                                                <input
                                                    type="date"
                                                    value={part.date}
                                                    onChange={(e) => handlePartChange(index, 'date', e.target.value)}
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                                                />
                                                {touched.parts && errors.parts?.[`date_${index}`] && <p className="text-xs text-red-500">{errors.parts[`date_${index}`]}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">Venue</label>
                                                <input
                                                    type="text"
                                                    value={part.venue}
                                                    onChange={(e) => handlePartChange(index, 'venue', e.target.value)}
                                                    placeholder="Classroom / Hall"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Time Range */}
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={part.startTime}
                                                    onChange={(e) => handlePartChange(index, 'startTime', e.target.value)}
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                                                />
                                                {touched.parts && errors.parts?.[`start_${index}`] && <p className="text-xs text-red-500">{errors.parts[`start_${index}`]}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">End Time</label>
                                                <input
                                                    type="time"
                                                    value={part.endTime}
                                                    onChange={(e) => handlePartChange(index, 'endTime', e.target.value)}
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                                                />
                                                {touched.parts && errors.parts?.[`end_${index}`] && <p className="text-xs text-red-500">{errors.parts[`end_${index}`]}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {formData.examType === 'Multi' && (
                                <button
                                    onClick={addPart}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold text-sm hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add Part
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInitialSubmit}
                        disabled={loading}
                        className={`flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        <Save size={16} /> Schedule Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateExamModal;
