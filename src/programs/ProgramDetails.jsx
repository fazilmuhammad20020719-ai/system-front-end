import React, { useState } from 'react';
import { X, BookOpen, User, Clock, Calendar, CheckCircle, FileText, DollarSign, Award } from 'lucide-react';

const ProgramDetails = ({ isOpen, onClose, program }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen || !program) return null;

    // Helper to get mock curriculum based on program name
    const getCurriculum = (name) => {
        if (name.includes("Hifz")) return ["Juz 1-5 (Beginner)", "Juz 6-15 (Intermediate)", "Juz 16-30 (Advanced)", "Tajweed Rules", "Revision Cycles"];
        if (name.includes("Alim")) return ["Arabic Grammar (Nahw/Sarf)", "Fiqh (Jurisprudence)", "Hadith Studies", "Tafseer (Exegesis)", "Islamic History", "Logic (Mantiq)"];
        if (name.includes("O/L")) return ["Mathematics", "Science", "Religion (Islam)", "Sinhala/Tamil", "English", "History", "ICT (Optional)", "Business Studies (Optional)"];
        if (name.includes("A/L")) return ["Stream Selection: Bio/Maths/Arts/Comm", "General English", "GIT", "Z-Score Targetting", "Past Paper Revisions"];
        return ["Core Modules", "Practical Sessions", "Assignments", "Final Exam"];
    };

    const curriculum = getCurriculum(program.name);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header with Dynamic Color */}
                <div className={`${program.color.split(' ')[0]} p-6 flex justify-between items-start`}>
                    <div>
                        <h2 className={`text-2xl font-bold ${program.color.split(' ')[1]}`}>{program.name}</h2>
                        <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/60 rounded-full text-sm font-medium text-gray-700">
                            <span className={`w-2 h-2 rounded-full ${program.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {program.status}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 mt-2">
                    {['overview', 'curriculum', 'schedule'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 pt-3 px-4 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Body Content */}
                <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <User size={16} /> <span className="text-xs font-bold uppercase">Head of Dept</span>
                                    </div>
                                    <p className="font-semibold text-gray-800">{program.head}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock size={16} /> <span className="text-xs font-bold uppercase">Duration</span>
                                    </div>
                                    <p className="font-semibold text-gray-800">{program.duration}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Fee Structure</span>
                                    </div>
                                    <p className="font-semibold text-gray-800">{program.fees}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <User size={16} /> <span className="text-xs font-bold uppercase">Enrolled</span>
                                    </div>
                                    <p className="font-semibold text-gray-800">{program.students} Students</p>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm leading-relaxed">
                                <h4 className="font-bold flex items-center gap-2 mb-2"><Award size={16} /> Program Goal</h4>
                                This program is designed to provide comprehensive knowledge in {program.name} following the Sri Lankan national and religious education standards.
                            </div>
                        </div>
                    )}

                    {/* CURRICULUM TAB */}
                    {activeTab === 'curriculum' && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Syllabus & Subjects</h3>
                            <ul className="space-y-3">
                                {curriculum.map((subject, index) => (
                                    <li key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-colors shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <BookOpen size={16} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{subject}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* SCHEDULE TAB */}
                    {activeTab === 'schedule' && (
                        <div className="text-center py-8">
                            <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800">Class Schedule</h3>
                            <p className="text-gray-500 mb-6">Standard timing for {program.name}</p>

                            <div className="inline-block text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between gap-8 mb-2 border-b border-gray-200 pb-2">
                                    <span className="text-gray-600 font-medium">Weekdays</span>
                                    <span className="font-bold text-gray-800">7:30 AM - 1:30 PM</span>
                                </div>
                                <div className="flex items-center justify-between gap-8">
                                    <span className="text-gray-600 font-medium">Jumu'ah (Fri)</span>
                                    <span className="font-bold text-gray-800">7:30 AM - 11:00 AM</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <FileText size={16} /> Download Syllabus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
