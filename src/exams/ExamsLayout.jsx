import { useState } from 'react';
import Sidebar from '../Sidebar';
import ExaminationSlots from './ExaminationSlots';

const ExamsLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    <ExaminationSlots />
                </main>
            </div>
        </div>
    );
};

export default ExamsLayout;
