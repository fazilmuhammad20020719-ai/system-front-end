import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

const StudentGrid = ({ students, cardSize }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Graduated': return 'bg-yellow-100 text-yellow-700';
            case 'Inactive': return 'bg-red-50 text-red-600'; // Light red
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div>
            <div className={`grid gap-4 ${cardSize === 'large'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                {students.map((student) => (
                    <div key={student.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col ${cardSize === 'large' ? 'p-5' : 'p-3'
                        }`}>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`rounded-full bg-orange-100 text-[#EB8A33] flex items-center justify-center font-bold ${cardSize === 'large' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm'
                                    }`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-gray-800 line-clamp-1 ${cardSize === 'large' ? 'text-base' : 'text-sm'
                                        }`}>{student.name}</h3>
                                    <p className="text-[10px] text-gray-500 font-mono">#{student.id}</p>
                                </div>
                            </div>
                            <span className={`rounded text-[10px] font-bold uppercase ${cardSize === 'large' ? 'px-2 py-1' : 'px-1.5 py-0.5'
                                } ${getStatusColor(student.status)}`}>
                                {student.status}
                            </span>
                        </div>

                        {/* Card Details */}
                        <div className="space-y-2 mb-3 flex-1">
                            <div className={`bg-gray-50 rounded-lg border border-gray-100 ${cardSize === 'large' ? 'p-3' : 'p-2'
                                }`}>
                                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Academic</p>
                                <p className={`font-medium text-gray-800 truncate ${cardSize === 'large' ? 'text-sm' : 'text-xs'
                                    }`}>{student.program}</p>
                                <p className="text-[10px] text-[#EB8A33] font-medium">{student.year}</p>
                            </div>

                            {cardSize === 'large' && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Guardian:</span>
                                        <span className="font-medium text-gray-700 truncate max-w-[120px]" title={student.guardian}>{student.guardian}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Contact:</span>
                                        <span className="font-medium text-gray-700">{student.contact}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className={`grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mt-auto ${cardSize === 'large' ? '' : 'text-xs'
                            }`}>
                            <button onClick={() => navigate(`/view-student/${student.id}`)} className="flex items-center justify-center gap-1 py-1.5 font-medium text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                                <Eye size={14} /> {cardSize === 'large' && 'View'}
                            </button>
                            <button onClick={() => navigate(`/edit-student/${student.id}`)} className="flex items-center justify-center gap-1 py-1.5 font-medium text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors">
                                <Edit size={14} /> {cardSize === 'large' && 'Edit'}
                            </button>
                            <button className="flex items-center justify-center gap-1 py-1.5 font-medium text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                                <Trash2 size={14} /> {cardSize === 'large' && 'Del'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <Pagination />
            </div>
        </div>
    );
};

export default StudentGrid;
