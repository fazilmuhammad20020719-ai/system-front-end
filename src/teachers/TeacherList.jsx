import { Mail, Phone, Eye, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const TeacherList = ({ teachers, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher Profile</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Program & Subject</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact Info</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-orange-50/30 transition-colors group">
                            <td className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EB8A33] font-bold text-sm overflow-hidden border border-gray-100">
                                        {teacher.photo_url ? (
                                            <img
                                                src={`${API_URL}${teacher.photo_url}`}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = teacher.name.charAt(0) }}
                                            />
                                        ) : (
                                            teacher.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{teacher.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">{teacher.empid}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">{teacher.program}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">{teacher.subject}</span>
                                </div>
                            </td>
                            <td className="p-5 hidden md:table-cell">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={12} className="text-gray-400" /> {teacher.email}</div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600"><Phone size={12} className="text-gray-400" /> {teacher.phone}</div>
                                </div>
                            </td>
                            <td className="p-5 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{teacher.status}</span>
                            </td>
                            <td className="p-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all">
                                    <button onClick={() => navigate(`/view-teacher/${teacher.id}`)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="View Profile"><Eye size={18} /></button>
                                    <Link to={`/edit-teacher/${teacher.id}`}><button className="p-1.5 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-lg transition-colors" title="Edit"><Pencil size={18} /></button></Link>
                                    <button onClick={() => onDelete(teacher.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherList;
