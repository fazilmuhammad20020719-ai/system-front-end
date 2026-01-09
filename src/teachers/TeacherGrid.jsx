import { Mail, Phone, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TeacherGrid = ({ teachers, totalCount }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-[#EB8A33] flex items-center justify-center text-lg font-bold">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{teacher.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{teacher.empid}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {teacher.status}
                            </span>
                        </div>
                        <div className="space-y-3 mb-5 flex-1">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Program & Subject</p>
                                <p className="text-sm font-medium text-gray-800">{teacher.program}</p>
                                <p className="text-xs text-[#EB8A33] font-medium">{teacher.subject}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                <span className="truncate" title={teacher.email}>{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} className="text-gray-400" />
                                <span>{teacher.phone}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 mt-auto">
                            <button onClick={() => navigate(`/view-teacher/${teacher.id}`)} className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"><Eye size={14} /> View</button>
                            <Link to={`/edit-teacher/${teacher.id}`} className="w-full"><button className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"><Pencil size={14} /> Edit</button></Link>
                            <button className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"><Trash2 size={14} /> Del</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 px-2">
                <span className="text-xs text-gray-500">Showing {teachers.length} of {totalCount} records</span>
                <div className="flex gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white"><ChevronRight size={16} /></button>
                </div>
            </div>
        </>
    );
};

export default TeacherGrid;
