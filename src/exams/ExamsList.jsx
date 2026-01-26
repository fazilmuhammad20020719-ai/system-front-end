// src/exams/ExamsList.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, AlertCircle, Trash2 } from 'lucide-react';
import CreateExamModal from './CreateExamModal';
import { API_URL } from '../config';

const ExamsList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exams, setExams] = useState([]);

    const fetchExams = async () => {
        try {
            const response = await fetch(`${API_URL}/api/exams`);
            if (response.ok) {
                const data = await response.json();
                setExams(data);
            }
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        try {
            await fetch(`${API_URL}/api/exams/${id}`, { method: 'DELETE' });
            fetchExams();
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    };

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
                        <p className="text-sm text-green-600 font-medium mb-4">{exam.program_name}</p>

                        <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(exam.exam_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {exam.start_time} - {exam.end_time}
                            </div>
                            <button onClick={() => handleDelete(exam.id)} className="ml-auto text-red-400 hover:text-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <CreateExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchExams}
            />
        </div>
    );
};

export default ExamsList;
