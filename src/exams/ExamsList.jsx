// src/exams/ExamsList.jsx
import { useState } from 'react';
import { Plus, Search, Calendar, Clock, AlertCircle } from 'lucide-react';
import CreateExamModal from './CreateExamModal';

const ExamsList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data for "Perfect" Visualization
    const exams = [
        { id: 1, title: 'Mid-Term Arabic Grammar', program: 'Diploma in Arabic', date: '2026-02-10', time: '09:00 AM', status: 'Upcoming' },
        { id: 2, title: 'Islamic History Final', program: 'Higher Diploma', date: '2026-01-15', time: '10:00 AM', status: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 w-64 shadow-sm"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Schedule Exam
                </button>
            </div>

            {/* Modern Card Grid (Better than a boring table) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {exam.status}
                            </span>
                            <button className="text-slate-300 group-hover:text-green-600 transition-colors">
                                <AlertCircle size={18} />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 mb-1">{exam.title}</h3>
                        <p className="text-sm text-green-600 font-medium mb-4">{exam.program}</p>

                        <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {exam.date}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {exam.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <CreateExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newExam) => console.log("New Exam Config:", newExam)}
            />
        </div>
    );
};

export default ExamsList;
