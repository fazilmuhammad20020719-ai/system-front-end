// src/exams/ExamsList.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, AlertCircle, Trash2, Edit2, User, Users, CheckCircle, XCircle } from 'lucide-react';
import CreateExamModal from './CreateExamModal';
import { API_URL } from '../config';

const ExamsList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exams, setExams] = useState([]);
    const [editingExam, setEditingExam] = useState(null);
    const [detailsExam, setDetailsExam] = useState(null); // For Details View

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

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to CANCEL this exam?")) return;
        try {
            await fetch(`${API_URL}/api/exams/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled' })
            });
            fetchExams();
        } catch (error) {
            console.error("Error cancelling exam:", error);
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingExam(null);
        setIsModalOpen(true);
    };

    const StatusBadge = ({ status }) => {
        let colors = 'bg-slate-100 text-slate-600';
        if (status === 'Upcoming') colors = 'bg-blue-100 text-blue-700';
        if (status === 'Ongoing') colors = 'bg-green-100 text-green-700';
        if (status === 'Completed') colors = 'bg-gray-100 text-gray-500';
        if (status === 'Cancelled') colors = 'bg-red-100 text-red-700';

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors}`}>
                {status}
            </span>
        );
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
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Schedule Exam
                </button>
            </div>

            {/* Modern Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                            <StatusBadge status={exam.status} />
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setDetailsExam(exam)} className="text-slate-400 hover:text-green-600" title="View Details">
                                    <AlertCircle size={18} />
                                </button>
                                <button onClick={() => handleEdit(exam)} className="text-slate-400 hover:text-blue-600" title="Edit">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleCancel(exam.id)} className="text-slate-400 hover:text-orange-600" title="Cancel Exam">
                                    <XCircle size={18} />
                                </button>
                                <button onClick={() => handleDelete(exam.id)} className="text-slate-400 hover:text-red-600" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{exam.title}</h3>
                            {exam.exam_type === 'Multi' && (
                                <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide shrink-0">
                                    Multi-Part
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-green-600 font-medium mb-4">{exam.program_name} • {exam.subject_name}</p>

                        <div className="mt-auto space-y-3">
                            {/* Schedule Info */}
                            <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-slate-400" />
                                    {new Date(exam.exam_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-slate-400" />
                                    {exam.start_time?.slice(0, 5)} - {exam.end_time?.slice(0, 5)}
                                </div>
                            </div>

                            {/* Quick Stats Summary */}
                            <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                                <div className="flex items-center gap-1">
                                    <User size={12} />
                                    <span>{exam.supervisor_name || 'No Supervisor'}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Assigned Students">
                                    <Users size={12} />
                                    <span>{exam.assigned_students || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Create/Edit */}
            <CreateExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchExams}
                examToEdit={editingExam}
            />

            {/* Details Modal */}
            {detailsExam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">Exam Details</h2>
                            <button onClick={() => setDetailsExam(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">

                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-800">{detailsExam.title}</h3>
                                <StatusBadge status={detailsExam.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Date</label>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar size={16} className="text-green-600" />
                                        {new Date(detailsExam.exam_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Time</label>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Clock size={16} className="text-green-600" />
                                        {detailsExam.start_time?.slice(0, 5)} - {detailsExam.end_time?.slice(0, 5)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Supervisor</label>
                                    <div className="flex items-center gap-2 font-medium">
                                        <User size={16} className="text-green-600" />
                                        {detailsExam.supervisor_name || 'Not Assigned'}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <label className="text-xs font-bold text-gray-500 block mb-3 uppercase">Student Statistics</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                                        <span className="block text-xl font-bold text-blue-700">{detailsExam.assigned_students}</span>
                                        <span className="text-xs text-blue-600">Assigned</span>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 rounded-lg">
                                        <span className="block text-xl font-bold text-green-700">{detailsExam.present_students || 0}</span>
                                        <span className="text-xs text-green-600">Present</span>
                                    </div>
                                    <div className="text-center p-2 bg-red-50 rounded-lg">
                                        <span className="block text-xl font-bold text-red-700">{detailsExam.absent_students || 0}</span>
                                        <span className="text-xs text-red-600">Absent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamsList;
