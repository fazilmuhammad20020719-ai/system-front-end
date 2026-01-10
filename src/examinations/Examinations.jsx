import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, ChevronRight, BarChart3, Filter } from 'lucide-react';
import Sidebar from '../Sidebar';

const Examinations = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filter, setFilter] = useState('All');

    // MOCK DATA: பரிட்சைகள் பட்டியல்
    const exams = [
        {
            id: 1,
            title: "Term 1 Examination 2025",
            target: "Year 1 & Year 2",
            status: "Upcoming",
            startDate: "2025-03-15",
            subjectsCount: 5
        },
        {
            id: 2,
            title: "Monthly Assessment - Jan",
            target: "Hifz Class A",
            status: "Ongoing",
            startDate: "2025-01-28",
            subjectsCount: 2
        },
        {
            id: 3,
            title: "Year End Final 2024",
            target: "All Students",
            status: "Completed",
            startDate: "2024-12-10",
            subjectsCount: 6
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Ongoing': return 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="p-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Examinations Dashboard</h1>
                            <p className="text-gray-500">Manage schedules, marks, and results</p>
                        </div>
                        <button
                            onClick={() => navigate('/examinations/create')}
                            className="bg-[#EB8A33] hover:bg-[#d67b28] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                        >
                            <Plus size={20} /> Create New Exam
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 mb-6">
                        {['All', 'Upcoming', 'Ongoing', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${filter === f
                                        ? 'bg-white border-[#EB8A33] text-[#EB8A33] shadow-sm'
                                        : 'bg-transparent border-transparent text-gray-500 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Exam Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.filter(e => filter === 'All' || e.status === filter).map((exam) => (
                            <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BarChart3 size={64} className="text-[#EB8A33]" />
                                </div>

                                <div className="mb-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(exam.status)}`}>
                                        {exam.status}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-800 mb-1">{exam.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">Target: {exam.target}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-600 gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Starts: {exam.startDate}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span>{exam.subjectsCount} Subjects Scheduled</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/examinations/manage/${exam.id}`)}
                                    className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-[#EB8A33] hover:text-[#EB8A33] font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-white"
                                >
                                    Manage Exam <ChevronRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Examinations;