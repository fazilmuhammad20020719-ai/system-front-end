import React, { useState } from 'react';
import { X, BookOpen, User, Calendar, Clock, ArrowLeft, GraduationCap } from 'lucide-react';
import { TEACHERS_DATA } from '../data/mockData'; // Ensure this path is correct

const ProgramDetails = ({ isOpen, onClose, program, subjects }) => {
    const [selectedYear, setSelectedYear] = useState('Grade 1');

    if (!isOpen || !program) return null;

    // Filter Subjects based on Program ID and Selected Year
    const programSubjects = subjects.filter(
        sub => sub.programId === program.id && sub.year === selectedYear
    );

    // Filter Teachers based on Program Name
    const programTeachers = TEACHERS_DATA.filter(
        teacher => teacher.program === program.name
    );

    // Available Years
    const availableYears = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 5'];

    return (
        <div className="fixed inset-0 z-50 bg-[#f3f4f6] overflow-y-auto animate-in fade-in duration-200">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{program.name}</h2>
                        <p className="text-sm text-gray-500">Program Details & Curriculum</p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${program.color || 'bg-blue-100 text-blue-600'}`}>
                    {program.status}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* 1. Program Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><User size={24} /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Head of Dept</p>
                            <p className="font-semibold text-gray-800">{program.head}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Clock size={24} /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Duration</p>
                            <p className="font-semibold text-gray-800">{program.duration}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><GraduationCap size={24} /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Students</p>
                            <p className="font-semibold text-gray-800">{program.students}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Calendar size={24} /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Fees</p>
                            <p className="font-semibold text-gray-800">{program.fees}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 2. SUBJECTS SECTION */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BookOpen size={20} className="text-[#ea8933]" /> Curriculum / Subjects
                                </h3>

                                {/* Year Filter Tabs */}
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {availableYears.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedYear === year
                                                ? 'bg-white text-gray-800 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5">
                                {programSubjects.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {programSubjects.map((subject, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-white text-[#ea8933] flex items-center justify-center font-bold text-sm shadow-sm border border-gray-100">
                                                    {idx + 1}
                                                </div>
                                                <span className="font-medium text-gray-700">{subject.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No subjects added for {selectedYear}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. TEACHERS SECTION */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
                            <div className="p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" /> Academic Staff
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {programTeachers.length > 0 ? (
                                    programTeachers.map((teacher) => (
                                        <div key={teacher.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{teacher.name}</p>
                                                <p className="text-xs text-gray-500">{teacher.role}</p>
                                                <p className="text-xs text-blue-600 mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">
                                                    {teacher.subject}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm text-center">No teachers assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;