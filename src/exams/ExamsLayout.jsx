// src/exams/ExamsLayout.jsx
import { useState } from 'react';
import Sidebar from '../Sidebar';
import ExamsList from './ExamsList';
import ResultsLog from './ResultsLog';
import ExamRegistrations from './ExamRegistrations'; // New Component
import { ClipboardList, GraduationCap, UserCheck } from 'lucide-react';

const ExamsLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState('exams'); // 'exams' | 'results' | 'registration'

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Academic Assessments</h1>
                            <p className="text-sm text-slate-500">Manage exams, results, and student enrollments</p>
                        </div>

                        {/* 3-Way Toggle Switch */}
                        <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap items-center shadow-inner gap-1">
                            {['exams', 'results', 'registration'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab
                                        ? "bg-white text-green-700 shadow-md"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                        }`}
                                >
                                    {tab === 'exams' && <ClipboardList size={16} />}
                                    {tab === 'results' && <GraduationCap size={16} />}
                                    {tab === 'registration' && <UserCheck size={16} />}
                                    <span className="capitalize">{tab === 'registration' ? 'Attendance' : tab}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {activeTab === 'exams' && <ExamsList />}
                    {activeTab === 'results' && <ResultsLog />}
                    {activeTab === 'registration' && <ExamRegistrations />}
                </main>
            </div>
        </div>
    );
};

export default ExamsLayout;
