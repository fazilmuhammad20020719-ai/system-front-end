import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../Sidebar';

const CreateExam = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Exam Basic Details
    const [examDetails, setExamDetails] = useState({
        title: '',
        targetType: 'class', // 'class', 'program', 'all'
        targetValue: '',
        startDate: '',
        endDate: '',
        status: 'Upcoming'
    });

    // Subjects List State
    const [subjects, setSubjects] = useState([
        { id: 1, name: '', date: '', startTime: '', endTime: '', maxMarks: 100 }
    ]);

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
        // API Call to save exam logic here
        console.log("Exam Data:", { ...examDetails, subjects });
        alert("Exam Created Successfully!");
        navigate('/examinations');
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
                        <h1 className="text-2xl font-bold text-gray-800">Schedule New Examination</h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* 1. Basic Information */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Step 1: Exam Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exam Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Term 1 Final Examination 2025"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#EB8A33] outline-none"
                                        value={examDetails.title}
                                        onChange={e => setExamDetails({ ...examDetails, title: e.target.value })}
                                    />
                                </div>

                                {/* Target Audience Logic */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Who is this for?</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#EB8A33] outline-none bg-white"
                                        value={examDetails.targetType}
                                        onChange={e => setExamDetails({ ...examDetails, targetType: e.target.value })}
                                    >
                                        <option value="class">Specific Class</option>
                                        <option value="program">Specific Program</option>
                                        <option value="all">All Students</option>
                                    </select>
                                </div>

                                {/* Conditional Dropdown based on Target */}
                                {examDetails.targetType !== 'all' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                            Select {examDetails.targetType === 'class' ? 'Class' : 'Program'}
                                        </label>
                                        <select
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#EB8A33] outline-none bg-white"
                                            value={examDetails.targetValue}
                                            onChange={e => setExamDetails({ ...examDetails, targetValue: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Year 1">Year 1</option>
                                            <option value="Year 2">Year 2</option>
                                            <option value="Hifz">Hifz Section</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Overall Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#EB8A33] outline-none"
                                        onChange={e => setExamDetails({ ...examDetails, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Subjects & Timetable */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="font-bold text-gray-800">Step 2: Subjects & Timetable</h2>
                                <button
                                    onClick={handleAddSubject}
                                    className="text-xs font-bold text-[#EB8A33] flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} /> Add Subject
                                </button>
                            </div>

                            <div className="space-y-4">
                                {subjects.map((sub, index) => (
                                    <div key={sub.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="col-span-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Subject Name</label>
                                            <input
                                                type="text"
                                                placeholder="Subject"
                                                className="w-full p-2 border border-gray-200 rounded text-sm"
                                                value={sub.name}
                                                onChange={e => handleSubjectChange(sub.id, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Exam Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-2 border border-gray-200 rounded text-sm"
                                                value={sub.date}
                                                onChange={e => handleSubjectChange(sub.id, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Start Time</label>
                                            <input
                                                type="time"
                                                className="w-full p-2 border border-gray-200 rounded text-sm"
                                                value={sub.startTime}
                                                onChange={e => handleSubjectChange(sub.id, 'startTime', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">End Time</label>
                                            <input
                                                type="time"
                                                className="w-full p-2 border border-gray-200 rounded text-sm"
                                                value={sub.endTime}
                                                onChange={e => handleSubjectChange(sub.id, 'endTime', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Marks</label>
                                            <input type="number" value={sub.maxMarks} className="w-full p-2 border rounded text-sm text-center" readOnly />
                                        </div>
                                        <div className="col-span-1 flex justify-center pb-2">
                                            <button
                                                onClick={() => handleRemoveSubject(sub.id)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSave}
                                className="bg-[#EB8A33] hover:bg-[#d67b28] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Save size={20} /> Create & Publish Schedule
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;
