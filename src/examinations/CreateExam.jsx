import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, CheckSquare, Square, X, Users, UserCheck } from 'lucide-react';
import Sidebar from '../Sidebar';

const CreateExam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingExam = location.state?.exam;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- State Management ---
    const [examDetails, setExamDetails] = useState({
        title: editingExam?.title || '',
        startDate: editingExam?.startDate || '',
        program: editingExam?.program || '',
        years: editingExam?.years || [],        // Array of selected years
        studentIds: editingExam?.studentIds || [], // Array of selected student IDs
        status: editingExam?.status || 'Upcoming'
    });

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentYearForSelection, setCurrentYearForSelection] = useState(null);

    // Subjects List State
    const [subjects, setSubjects] = useState(editingExam?.subjects || [
        { id: 1, name: '', date: '', startTime: '', endTime: '', maxMarks: 100 }
    ]);

    // --- Derived Data ---

    const availablePrograms = useMemo(() => {
        return [];
    }, []);

    const availableYears = useMemo(() => {
        if (!examDetails.program) return [];
        return [];
    }, [examDetails.program]);

    // --- Modal & Selection Logic ---

    // Open Modal for a specific year
    const handleOpenStudentSelection = (year) => {
        setCurrentYearForSelection(year);
        setIsModalOpen(true);
    };

    // Toggle a student inside the modal
    const handleStudentToggle = (studentId) => {
        setExamDetails(prev => {
            const isSelected = prev.studentIds.includes(studentId);
            let newIds;
            if (isSelected) {
                newIds = prev.studentIds.filter(id => id !== studentId);
            } else {
                newIds = [...prev.studentIds, studentId];
            }

            // If we remove the last student of a year, should we uncheck the year? 
            // For now, let's keep the year checked but with 0 students if user desires.
            return { ...prev, studentIds: newIds };
        });
    };

    // Select All / Deselect All for the current modal year
    const handleSelectAllForYear = (selectAll) => {
        const studentsInYear = [];
        const studentIdsInYear = studentsInYear.map(s => s.id);

        setExamDetails(prev => {
            let newIds = [...prev.studentIds];

            if (selectAll) {
                // Add all IDs from this year that aren't already included
                studentIdsInYear.forEach(id => {
                    if (!newIds.includes(id)) newIds.push(id);
                });
            } else {
                // Remove all IDs belonging to this year
                newIds = newIds.filter(id => !studentIdsInYear.includes(id));
            }

            return { ...prev, studentIds: newIds };
        });
    };

    // Handle Year Checkbox Change
    const handleYearCheckbox = (year) => {
        const isYearCurrentlySelected = examDetails.years.includes(year);

        if (isYearCurrentlySelected) {
            // Remove Year: Also remove all students from this year
            const studentsInYear = [];
            const idsToRemove = studentsInYear.map(s => s.id);

            setExamDetails(prev => ({
                ...prev,
                years: prev.years.filter(y => y !== year),
                studentIds: prev.studentIds.filter(id => !idsToRemove.includes(id))
            }));
        } else {
            // Add Year: Add year AND Open Modal to select students (Default to ALL selected?)
            // Requirement: "popup msg pola... student name katanum"

            // 1. Add Year to state
            setExamDetails(prev => ({
                ...prev,
                years: [...prev.years, year]
            }));

            // 2. Auto-select ALL students initially? Or let user choose?
            // Let's auto-select ALL for convenience, then open modal to refine.
            const studentsInYear = [];
            const newIds = studentsInYear.map(s => s.id);

            setExamDetails(prev => ({
                ...prev,
                years: [...prev.years, year],
                studentIds: [...new Set([...prev.studentIds, ...newIds])] // Merge unique
            }));

            // 3. Open Modal immediately
            handleOpenStudentSelection(year);
        }
    };

    // Helper to count selected students for a specific year
    const getSelectedCountForYear = (year) => {
        const studentsInYear = [];
        const total = studentsInYear.length;
        const selected = studentsInYear.filter(s => examDetails.studentIds.includes(s.id)).length;
        return { selected, total };
    };

    // --- Subject Handlers ---
    const handleAddSubject = () => {
        setSubjects([...subjects, {
            id: Date.now(), name: '', date: '', startTime: '', endTime: '', maxMarks: 100
        }]);
    };

    const handleSubjectChange = (id, field, value) => {
        setSubjects(subjects.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
    };

    const handleRemoveSubject = (id) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter(sub => sub.id !== id));
        }
    };

    const handleSave = () => {
        if (!examDetails.title || !examDetails.program || examDetails.years.length === 0) {
            alert("Please fill in the Exam Title, Program, and select at least one Year.");
            return;
        }
        if (examDetails.studentIds.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        console.log("Saving Exam Data:", { ...examDetails, subjects });
        alert("Exam Created Successfully!");
        navigate('/examinations');
    };

    // --- Render Modal ---
    const renderStudentModal = () => {
        if (!isModalOpen || !currentYearForSelection) return null;

        const studentsInYear = [];
        const selectedCount = studentsInYear.filter(s => examDetails.studentIds.includes(s.id)).length;
        const isAllSelected = selectedCount === studentsInYear.length && studentsInYear.length > 0;

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Modal Header */}
                    <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold text-lg">Select Students</h3>
                            <p className="text-green-100 text-xs">{currentYearForSelection} - {examDetails.program}</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Controls */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="text-sm text-gray-600 font-medium">
                            {selectedCount} / {studentsInYear.length} Selected
                        </div>
                        <button
                            onClick={() => handleSelectAllForYear(!isAllSelected)}
                            className="text-sm font-bold text-green-600 hover:underline"
                        >
                            {isAllSelected ? 'Deselect All' : 'Select All Students'}
                        </button>
                    </div>

                    {/* Student List */}
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {studentsInYear.length > 0 ? (
                            <div className="space-y-1">
                                {studentsInYear.map(student => {
                                    const isSelected = examDetails.studentIds.includes(student.id);
                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => handleStudentToggle(student.id)}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-green-50 border-green-200' : 'bg-white border-transparent hover:bg-gray-50'}`}
                                        >
                                            <div className={`text-green-600 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100 text-gray-300'}`}>
                                                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>{student.name}</p>
                                                <p className="text-xs text-gray-400">ID: {student.id}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400">No students found in this year.</div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="p-8">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">{editingExam ? 'Edit Examination' : 'Schedule New Examination'}</h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* --- STEP 1: EXAM DETAILS --- */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-gray-800 mb-6 border-b pb-2">Step 1: Exam Details & Audience</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exam Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Term 1 Final Examination 2025"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-600 outline-none bg-white"
                                        value={examDetails.title}
                                        onChange={e => setExamDetails({ ...examDetails, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-600 outline-none bg-white"
                                        value={examDetails.startDate}
                                        onChange={e => setExamDetails({ ...examDetails, startDate: e.target.value })}
                                    />
                                </div>

                                {/* Select Program */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Program</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#EB8A33] outline-none bg-white"
                                        value={examDetails.program}
                                        onChange={e => setExamDetails({ ...examDetails, program: e.target.value, years: [], studentIds: [] })}
                                    >
                                        <option value="">-- Choose Program --</option>
                                        {availablePrograms.map(prog => (
                                            <option key={prog} value={prog}>{prog}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Years & Student Selection */}
                                {examDetails.program && (
                                    <div className="col-span-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Grade / Batch</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {availableYears.map(year => {
                                                const isSelected = examDetails.years.includes(year);
                                                const { selected, total } = getSelectedCountForYear(year);

                                                return (
                                                    <div key={year} className={`relative p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'}`}>

                                                        {/* Top Row: Checkbox & Year Name */}
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                                                <div
                                                                    onClick={() => handleYearCheckbox(year)}
                                                                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'}`}
                                                                >
                                                                    {isSelected && <CheckSquare size={14} />}
                                                                </div>
                                                                <span className={`font-bold ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>{year}</span>
                                                            </label>
                                                        </div>

                                                        {/* Bottom Row: Student Count & Edit Button */}
                                                        {isSelected && (
                                                            <div className="flex items-center justify-between text-xs pl-8">
                                                                <span className="text-gray-600 font-medium bg-white px-2 py-1 rounded border border-green-100">
                                                                    <Users size={12} className="inline mr-1 text-green-600" />
                                                                    {selected} / {total} Students
                                                                </span>
                                                                <button
                                                                    onClick={() => handleOpenStudentSelection(year)}
                                                                    className="text-green-600 font-bold hover:underline flex items-center gap-1"
                                                                >
                                                                    <UserCheck size={14} /> Edit Selection
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- STEP 2: SUBJECTS --- */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="font-bold text-gray-800">Step 2: Subjects & Timetable</h2>
                                <button
                                    onClick={handleAddSubject}
                                    className="text-xs font-bold text-green-600 flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} /> Add Subject
                                </button>
                            </div>
                            <div className="space-y-4">
                                {subjects.map((sub) => (
                                    <div key={sub.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="col-span-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Subject Name</label>
                                            <input type="text" className="w-full p-2 border border-gray-200 rounded text-sm" value={sub.name} onChange={e => handleSubjectChange(sub.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Exam Date</label>
                                            <input type="date" className="w-full p-2 border border-gray-200 rounded text-sm" value={sub.date} onChange={e => handleSubjectChange(sub.id, 'date', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Start Time</label>
                                            <input type="time" className="w-full p-2 border border-gray-200 rounded text-sm" value={sub.startTime} onChange={e => handleSubjectChange(sub.id, 'startTime', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">End Time</label>
                                            <input type="time" className="w-full p-2 border border-gray-200 rounded text-sm" value={sub.endTime} onChange={e => handleSubjectChange(sub.id, 'endTime', e.target.value)} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Marks</label>
                                            <input type="number" value={sub.maxMarks} className="w-full p-2 border rounded text-sm text-center" readOnly />
                                        </div>
                                        <div className="col-span-1 flex justify-center pb-2">
                                            <button onClick={() => handleRemoveSubject(sub.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                                <Save size={20} /> Create Exam
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Modal for Student Selection */}
            {renderStudentModal()}
        </div>
    );
};

export default CreateExam;