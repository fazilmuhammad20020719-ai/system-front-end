import { Eye, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import Pagination from './Pagination';

const StudentGrid = ({ students, cardSize, currentPage, totalPages, onPageChange, onDelete }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Graduated': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Inactive': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div>
            <div className={`grid gap-4 ${cardSize === 'large'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                {students.map((student) => (
                    <div key={student.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col group ${cardSize === 'large' ? 'p-5' : 'p-4'}`}>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`relative rounded-full overflow-hidden bg-orange-50 border border-orange-100 flex-shrink-0 ${cardSize === 'large' ? 'w-12 h-12' : 'w-10 h-10'}`}>
                                    {student.photo_url ? (
                                        <img
                                            src={`${API_URL}${student.photo_url}`}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center font-bold uppercase text-[#EB8A33] ${student.photo_url ? 'hidden' : 'flex'} ${cardSize === 'large' ? 'text-lg' : 'text-sm'}`}>
                                        {student.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`font-bold text-gray-800 line-clamp-1 group-hover:text-[#EB8A33] transition-colors ${cardSize === 'large' ? 'text-base' : 'text-sm'}`}>{student.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded w-fit mt-0.5">#{student.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div className="space-y-3 flex-1 mb-4">
                            <div className={`bg-gray-50/80 rounded-lg border border-gray-100 ${cardSize === 'large' ? 'p-3' : 'p-2.5'}`}>
                                {/* Program */}
                                <div className="mb-2">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                        <GraduationCap size={10} /> Programs
                                    </p>
                                    <div className="flex flex-col gap-2 mt-1">
                                        {student.enrollments_summary && student.enrollments_summary.length > 0 ? (
                                            student.enrollments_summary.slice(0, 2).map((e, idx) => (
                                                <div key={idx} className="bg-white px-2 py-1.5 rounded border border-gray-100 shadow-sm flex flex-col gap-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className={`font-semibold text-gray-800 line-clamp-1 ${cardSize === 'large' ? 'text-xs' : 'text-[10px]'}`} title={e.program}>
                                                            {e.program}
                                                        </span>
                                                        <span className={`shrink-0 text-[9px] px-1.5 rounded uppercase font-bold ${getStatusColor(e.status)}`}>
                                                            {e.status || 'Active'}
                                                        </span>
                                                    </div>

                                                    {/* Batch & Year for this Program */}
                                                    <div className="flex items-center gap-2">
                                                        {e.session && (
                                                            <span className="inline-flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                                                <Calendar size={8} /> {e.session}
                                                            </span>
                                                        )}
                                                        {/* Hide Grade if Graduated/Completed */}
                                                        {e.year && e.status !== 'Graduated' && e.status !== 'Completed' && (
                                                            <span className="inline-flex items-center text-[9px] font-bold text-[#EB8A33] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                                                {e.year}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white px-2 py-1.5 rounded border border-gray-100 shadow-sm flex flex-col gap-1">
                                                <p className={`font-semibold text-gray-800 truncate ${cardSize === 'large' ? 'text-sm' : 'text-xs'}`}>
                                                    {student.program}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                                        <Calendar size={8} /> {student.session}
                                                    </span>
                                                    <span className="inline-flex items-center text-[9px] font-bold text-[#EB8A33] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                                        {student.currentYear}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {student.enrollments_summary && student.enrollments_summary.length > 2 && (
                                            <p className="text-[9px] text-gray-400 text-center">+{student.enrollments_summary.length - 2} more</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {cardSize === 'large' && (
                                <div className="px-1 space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Guardian:</span>
                                        <span className="font-medium text-gray-800 truncate max-w-[120px]">{student.guardian}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Contact:</span>
                                        <span className="font-medium text-gray-800">{student.contact}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className={`grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mt-auto`}>
                            <button onClick={() => navigate(`/view-student/${student.id}`)} className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                <Eye size={14} /> {cardSize === 'large' && 'View'}
                            </button>
                            <button onClick={() => navigate(`/edit-student/${student.id}`)} className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors border border-transparent hover:border-orange-100">
                                <Edit size={14} /> {cardSize === 'large' && 'Edit'}
                            </button>

                            {/* DELETE BUTTON FIXED HERE */}
                            <button
                                onClick={() => onDelete(student)}
                                className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            >
                                <Trash2 size={14} /> {cardSize === 'large' && 'Del'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default StudentGrid;