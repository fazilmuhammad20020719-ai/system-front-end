import { BookOpen, Edit, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfileHeader = ({ student }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-orange-50 overflow-hidden flex items-center justify-center text-2xl font-bold text-gray-400 bg-gray-100">
                        {student.image ? (
                            <img src={student.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{student.firstName?.[0]}{student.lastName?.[0]}</span>
                        )}
                    </div>
                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{student.firstName} {student.lastName}</h1>
                    <div className="flex items-center gap-3 text-gray-500 mt-1">
                        <span className="flex items-center gap-1.5 text-sm"><BookOpen size={16} /> {student.program}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1.5 text-sm"><Calendar size={16} /> {student.year}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">{student.status}</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">{student.id}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => navigate(`/edit-student/${student.id}`)} className="flex-1 md:flex-none px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Edit size={16} /> Edit
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-[#d67b28] text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2">
                    <Download size={16} /> Download
                </button>
            </div>
        </div>
    );
};

export default StudentProfileHeader;