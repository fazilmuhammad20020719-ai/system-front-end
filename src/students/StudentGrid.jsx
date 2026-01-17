import React from 'react';
import { Eye, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { API_URL } from '../config'; // API_URL முக்கியம்

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

                        {/* HEADER PART */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">

                                {/* --- PHOTO LOGIC (இங்கே மாற்றம் செய்யப்பட்டுள்ளது) --- */}
                                <div className={`relative rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 ${cardSize === 'large' ? 'w-12 h-12' : 'w-10 h-10'}`}>

                                    {/* 1. போட்டோ இருந்தால் அதை காட்டு */}
                                    {student.photo_url ? (
                                        <img
                                            src={`${API_URL}${student.photo_url}`}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // போட்டோ லோட் ஆகவில்லை என்றால், அதை மறைத்து எழுத்தைக் காட்டு
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}

                                    {/* 2. போட்டோ இல்லை என்றால் எழுத்தைக் காட்டு (Initial) */}
                                    <div className={`absolute inset-0 flex items-center justify-center font-bold uppercase bg-orange-50 text-[#EB8A33] ${student.photo_url ? 'hidden' : 'flex'}`}>
                                        {student.name.charAt(0)}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`font-bold text-gray-800 line-clamp-1 group-hover:text-[#EB8A33] transition-colors ${cardSize === 'large' ? 'text-base' : 'text-sm'}`}>{student.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded w-fit mt-0.5">#{student.id}</p>
                                </div>
                            </div>
                            <span className={`border rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(student.status)}`}>
                                {student.status}
                            </span>
                        </div>

                        {/* DETAILS PART */}
                        <div className="space-y-3 flex-1 mb-4">
                            <div className={`bg-gray-50/80 rounded-lg border border-gray-100 ${cardSize === 'large' ? 'p-3' : 'p-2.5'}`}>
                                <div className="mb-2">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                        <GraduationCap size={10} /> Program
                                    </p>
                                    <p className={`font-semibold text-gray-800 truncate ${cardSize === 'large' ? 'text-sm' : 'text-xs'}`}>
                                        {student.program}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white border border-gray-200 text-gray-600 shadow-sm">
                                        <Calendar size={10} className="text-gray-400" />
                                        Batch {student.session}
                                    </span>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 border border-orange-100 text-[#EB8A33]">
                                        {student.currentYear}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS PART */}
                        <div className={`grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mt-auto`}>
                            <button onClick={() => navigate(`/view-student/${student.id}`)} className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                <Eye size={14} /> {cardSize === 'large' && 'View'}
                            </button>
                            <button onClick={() => navigate(`/edit-student/${student.id}`)} className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">
                                <Edit size={14} /> {cardSize === 'large' && 'Edit'}
                            </button>
                            <button onClick={() => onDelete(student)} className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
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