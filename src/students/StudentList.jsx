import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config'; // API_URL முக்கியம்

const StudentList = ({ students }) => {
    const navigate = useNavigate();

    // STATES FOR DELETE MODAL
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            const response = await fetch(`${API_URL}/api/students/${studentToDelete.id}`, { method: 'DELETE' });
            if (response.ok) {
                setShowDeleteConfirm(false);
                setSuccessMsg("Student Deleted Successfully");
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) { console.error("Error:", error); }
    };

    const TableRow = ({ student }) => (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">

                    {/* PHOTO LOGIC IN LIST */}
                    <div className="w-9 h-9 relative rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex-shrink-0">
                        {student.photo_url ? (
                            <img
                                src={`${API_URL}${student.photo_url}`}
                                alt={student.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs text-blue-600 ${student.photo_url ? 'hidden' : 'flex'}`}>
                            {student.name.charAt(0)}
                        </div>
                    </div>

                    <div>
                        <p className="font-medium text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{student.id}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
                {student.enrollments_summary && student.enrollments_summary.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {student.enrollments_summary.map((e, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="font-semibold text-xs">{e.program}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${e.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {e.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p>{student.program}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {student.status}
                        </span>
                    </>
                )}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
                {/* Display Latest Grade/Year */}
                {student.enrollments_summary && student.enrollments_summary.length > 0
                    ? student.enrollments_summary[0].year
                    : student.currentYear || 'N/A'}
            </td>
            <td className="py-3 px-4">
                {/* Status Column removed/merged into program column for cleaner lookup, or keep general? */}
                {/* Keeping empty or generalized status if needed, but better to show per program above */}
                <span className="text-xs text-gray-400">See Program</span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">{student.contact}</td>
            <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                    <button onClick={() => navigate(`/view-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                    <button onClick={() => navigate(`/edit-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteClick(student)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            {/* SUCCESS MSG */}
            {successMsg && (
                <div className="fixed top-5 right-5 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-in">
                    <CheckCircle size={24} /> <div><h4 className="font-bold">Success</h4><p className="text-sm">{successMsg}</p></div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <th className="py-3 px-4">Student Name</th>
                                <th className="py-3 px-4">Program</th>
                                <th className="py-3 px-4">Grade</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Contact</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => <TableRow key={student.id} student={student} />)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DELETE MODAL */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600"><AlertTriangle size={28} /></div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                            <p className="text-gray-500 mb-6 text-sm">Do you want to delete <b>{studentToDelete?.name}</b>?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold text-gray-700">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentList;