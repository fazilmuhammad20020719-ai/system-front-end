import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, BookOpen, Users, User, Clock, Calendar,
    Award, CheckCircle, GraduationCap, Download, Edit2, Trash2, Plus, MapPin
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { TEACHERS_DATA } from '../data/mockData'; // Import Mock Data
import SubjectModal from './SubjectModal';
// ScheduleModal removed

const ViewProgram = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedYear, setSelectedYear] = useState('Grade 1');

    // MOCK DATA FETCHING (Simulating API)
    const [program, setProgram] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    // SCHEDULE STATE REMOVED

    useEffect(() => {
        // In a real app, fetch based on ID. Here we mock it.
        setProgram({
            id: id,
            name: "Hifzul Quran",
            head: "Sheikh Abdullah",
            duration: "3 Years", // Duration remains in Years
            description: "A comprehensive program designed for students to memorize the Holy Quran with Tajweed rules, coupled with basic Islamic studies.",
            students: 120,
            fees: "Free",
            status: "Active",
            color: "bg-emerald-100 text-emerald-600",
            startDate: "January 2025"
        });

        setSubjects([
            { id: 101, year: 'Grade 1', name: 'Juz 1-5' },
            { id: 102, year: 'Grade 1', name: 'Tajweed Basics' },
            { id: 103, year: 'Grade 2', name: 'Juz 6-15' },
            { id: 104, year: 'Grade 3', name: 'Juz 16-30' },
        ]);

    }, [id]);

    if (!program) return <div className="p-10 text-center">Loading Program Details...</div>;

    // Filter Logic
    const programTeachers = TEACHERS_DATA.filter(t => t.program === program.name);
    const currentSubjects = subjects.filter(s => s.year === selectedYear);
    const availableYears = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 5'];

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <main className="p-4 md:p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/programs')}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#ea8933] font-medium mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Programs
                    </button>

                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${program.color}`}>
                                    <BookOpen size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><User size={14} /> Head: {program.head}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {program.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 shadow-sm transition-colors">
                                <Download size={16} /> Download Syllabus
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex overflow-x-auto gap-1 border-b border-gray-200 mb-6 bg-white px-4 rounded-t-xl pt-2 shadow-sm">
                        {['overview', 'curriculum', 'teachers'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-bold capitalize relative transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'text-[#ea8933]'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ea8933] rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="space-y-6">

                        {/* 1. OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3">About the Program</h3>
                                        <p className="text-gray-600 leading-relaxed">{program.description}</p>
                                    </div>


                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-3 mb-1 text-purple-600">
                                                <User size={20} /> <span className="font-bold text-xs uppercase">Teachers</span>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">{programTeachers.length}</p>
                                        </div>
                                        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-3 mb-1 text-green-600">
                                                <Award size={20} /> <span className="font-bold text-xs uppercase">Pass Rate</span>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">92%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Program Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-600 flex items-center gap-2"><Clock size={16} /> Duration</span>
                                            <span className="font-semibold text-gray-800">{program.duration}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-600 flex items-center gap-2"><Calendar size={16} /> Start Date</span>
                                            <span className="font-semibold text-gray-800">{program.startDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-600 flex items-center gap-2"><CheckCircle size={16} /> Status</span>
                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. CURRICULUM TAB */}
                        {activeTab === 'curriculum' && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-300">
                                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 rounded-t-xl">
                                    <h3 className="font-bold text-gray-700">Syllabus by Year</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                                            {availableYears.map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => setSelectedYear(year)}
                                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${selectedYear === year
                                                        ? 'bg-[#ea8933] text-white shadow-md'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setEditingSubject(null);
                                                setShowSubjectModal(true);
                                            }}
                                            className="p-2 bg-[#ea8933] text-white rounded-lg hover:bg-[#d97c2a] transition-colors shadow-sm"
                                            title="Add Subject"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {currentSubjects.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentSubjects.map((sub, idx) => (
                                                <div key={sub.id} className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{sub.name}</h4>
                                                            <p className="text-xs text-gray-500">{selectedYear} - Core Module</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setEditingSubject(sub);
                                                                setShowSubjectModal(true);
                                                            }}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this subject?')) {
                                                                    setSubjects(subjects.filter(s => s.id !== sub.id));
                                                                }
                                                            }}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                                            <p>No subjects found for {selectedYear}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 3. TEACHERS TAB */}
                        {activeTab === 'teachers' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                                {programTeachers.map((teacher) => (
                                    <div key={teacher.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/view-teacher/${teacher.id}`)}>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                                            {teacher.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{teacher.name}</h4>
                                            <p className="text-xs text-blue-600 font-medium mb-1">{teacher.role}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <BookOpen size={12} /> {teacher.subject}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {programTeachers.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">No teachers assigned yet.</p>}
                            </div>
                        )}




                    </div>
                </main>
                <SubjectModal
                    isOpen={showSubjectModal}
                    onClose={() => setShowSubjectModal(false)}
                    programs={program ? [program] : []}
                    initialData={editingSubject}
                    isEditing={!!editingSubject}
                    onSave={(data) => {
                        if (editingSubject) {
                            setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...data } : s));
                        } else {
                            setSubjects([...subjects, { id: Date.now(), ...data }]);
                        }
                        setShowSubjectModal(false);
                    }}
                />


            </div>
        </div >
    );
};

export default ViewProgram;
