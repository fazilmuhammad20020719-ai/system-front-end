// src/exams/CreateExamModal.jsx
import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, BookOpen, Layers, Bookmark, Users, Check, AlertCircle, CheckCircle } from 'lucide-react';

const CreateExamModal = ({ isOpen, onClose, onSave }) => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        title: '',
        programId: '',
        grade: '',
        subjectId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: ''
    });

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]); // Mock Students
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({}); // Field touch state for error display
    const [showSummary, setShowSummary] = useState(false);

    // --- Mock Data Loading ---
    useEffect(() => {
        if (isOpen) {
            setPrograms([
                { id: 1, name: 'Diploma in Arabic', duration: 2 },
                { id: 2, name: 'Higher Diploma in Islamic Studies', duration: 3 },
                { id: 3, name: 'Certificate in Fiqh', duration: 1 }
            ]);

            setSubjects([
                { id: 101, programId: 1, name: 'Arabic Grammar (Nahw)', grade: 'Year 1' },
                { id: 102, programId: 1, name: 'Morphology (Sarf)', grade: 'Year 1' },
                { id: 103, programId: 1, name: 'Advanced Grammar', grade: 'Year 2' },
                { id: 201, programId: 2, name: 'Usul al-Fiqh', grade: 'Year 1' },
                { id: 301, programId: 3, name: 'Basics of Fiqh', grade: 'Year 1' }
            ]);

            setStudents([
                { id: 1, name: 'Ahmed Ali', programId: 1, grade: 'Year 1' },
                { id: 2, name: 'Mohamed Fazil', programId: 1, grade: 'Year 1' },
                { id: 3, name: 'Yusuf Khan', programId: 1, grade: 'Year 2' },
                { id: 4, name: 'Ibrahim Zaid', programId: 2, grade: 'Year 1' },
                { id: 5, name: 'Omar Farooq', programId: 1, grade: 'Year 1' },
            ]);

            // Reset state on open
            setFormData({
                title: '', programId: '', grade: '', subjectId: '',
                startDate: '', startTime: '', endDate: '', endTime: '', description: ''
            });
            setSelectedStudentIds([]);
            setTouched({});
            setShowSummary(false);
        }
    }, [isOpen]);

    // --- Computed / Derived Values ---

    // 1. Available Grades based on Program
    const selectedProgram = programs.find(p => p.id === parseInt(formData.programId));
    const availableGrades = selectedProgram
        ? Array.from({ length: selectedProgram.duration }, (_, i) => `Year ${i + 1}`)
        : [];

    // 2. Filtered Subjects
    const availableSubjects = subjects.filter(
        s => s.programId === parseInt(formData.programId) && s.grade === formData.grade
    );
    const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));

    // 3. Filtered Students
    const availableStudents = students.filter(
        s => s.programId === parseInt(formData.programId) && s.grade === formData.grade
    );

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

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const toggleStudent = (id) => {
        // Simple toggle, no checks for step
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const toggleAllStudents = () => {
        // Simple toggle all, no checks for step
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

        // Date/Time Validation
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        const now = new Date();

        if (formData.startDate && formData.startTime && startDateTime <= now) {
            errors.start = "Start time must be in the future";
        }
        if (formData.endDate && formData.endTime && startDateTime && endDateTime <= startDateTime) {
            errors.end = "End time must be after start time";
        }
        if (!formData.startDate || !formData.startTime) errors.startTimeMissing = true;
        if (!formData.endDate || !formData.endTime) errors.endTimeMissing = true;

        return errors;
    };

    const errors = getErrors();
    const isValid = Object.keys(errors).length === 0;

    const handleInitialSubmit = () => {
        setTouched({
            title: true, programId: true, grade: true, subjectId: true,
            start: true, end: true, students: true
        });

        if (isValid) {
            setShowSummary(true);
        }
    };

    const handleFinalSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            console.log("Saving Exam:", { ...formData, studentIds: selectedStudentIds });
            setLoading(false);
            onSave({ ...formData, studentIds: selectedStudentIds });
            onClose();
        }, 800);
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

                    <div className="p-6 space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Title</p><p>{formData.title}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Program</p><p>{sProgram?.name}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Grade</p><p>{formData.grade}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Subject</p><p>{sSubject?.name}</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Students</p><p>{selectedStudentIds.length} Selected</p></div>
                            <div><p className="font-bold text-gray-500 text-xs uppercase">Timing</p><p>{formData.startDate} {formData.startTime} - {formData.endTime}</p></div>
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
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
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

                    {/* Step 3: Timing - Enabled when Step 2 is mostly done */}
                    <section className={`space-y-4 transition-opacity duration-300 ${!isStep2Complete ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <div className="flex items-center gap-2 text-purple-700 font-bold border-b border-purple-100 pb-2">
                            <span className="bg-purple-100 px-2 py-0.5 rounded text-sm">Step 3</span> Schedule Timing
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Time */}
                            <div className={`p-4 rounded-xl border ${touched.start && errors.start ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1"><Calendar size={12} /> Start</h4>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('start')}
                                    className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('start')}
                                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                                />
                                {touched.start && errors.start && <p className="text-xs text-red-600 font-bold mt-2">{errors.start}</p>}
                            </div>

                            {/* End Time */}
                            <div className={`p-4 rounded-xl border ${touched.end && errors.end ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1"><Clock size={12} /> End</h4>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('end')}
                                    className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('end')}
                                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                                />
                                {touched.end && errors.end && <p className="text-xs text-red-600 font-bold mt-2">{errors.end}</p>}
                            </div>
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
