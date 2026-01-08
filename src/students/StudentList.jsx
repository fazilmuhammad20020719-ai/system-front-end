import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

const StudentList = ({ students }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Graduated': return 'bg-blue-100 text-blue-800';
            case 'Inactive': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Student ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Program</th>
                            <th className="px-6 py-4">Batch & Grade</th>
                            <th className="px-6 py-4">Guardian</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">#{student.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EB8A33] flex items-center justify-center text-xs font-bold">{student.name.charAt(0)}</div>
                                        <div className="text-sm font-semibold text-gray-800">{student.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                    {student.program}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded w-fit">Batch {student.session}</span>
                                        <span className="text-sm text-gray-600">{student.year}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{student.guardian}</div>
                                    <div className="text-xs text-gray-400">{student.contact}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => navigate(`/view-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={16} /></button>
                                        <button onClick={() => navigate(`/edit-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"><Edit size={16} /></button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination />
        </div>
    );
};

export default StudentList;