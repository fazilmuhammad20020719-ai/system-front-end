import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config';

const StudentList = ({ students, viewMode }) => {
    const navigate = useNavigate();

    // --- STATES FOR MODAL & SUCCESS MSG ---
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    // 1. DELETE ACTION (List & Grid இரண்டிற்கும் இதுதான் Common Function)
    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
        setShowDeleteConfirm(true); // Popup Open
    };

    // 2. CONFIRM DELETE
    const confirmDelete = async () => {
        if (!studentToDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/students/${studentToDelete.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowDeleteConfirm(false);
                setSuccessMsg("Student Deleted Successfully"); // Green Message

                // 1.5 நொடியில் Page Refresh ஆகும்
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                alert("Failed to delete student");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    // --- GRID CARD COMPONENT (Grid View-ல் Delete Button இங்குள்ளது) ---
    const GridCard = ({ student }) => (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{student.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{student.id}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {student.status}
                        </span>
                    </div>
                </div>

                {/* GRID ACTIONS */}
                <div className="flex gap-1">
                    <button onClick={() => navigate(`/view-student/${student.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye size={18} />
                    </button>
                    <button onClick={() => navigate(`/edit-student/${student.id}`)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                    </button>
                    {/* DELETE BUTTON (Connected to handleDeleteClick) */}
                    <button onClick={() => handleDeleteClick(student)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Program:</span>
                    <span className="font-medium text-xs text-right truncate w-32">{student.program}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Contact:</span>
                    <span className="font-medium text-xs">{student.contact}</span>
                </div>
            </div>
        </div>
    );

    // --- LIST TABLE ROW (List View-ல் Delete Button இங்குள்ளது) ---
    const TableRow = ({ student }) => (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{student.id}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">{student.program}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{student.currentYear || 'N/A'}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {student.status}
                </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">{student.contact}</td>
            <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                    <button onClick={() => navigate(`/view-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye size={16} />
                    </button>
                    <button onClick={() => navigate(`/edit-student/${student.id}`)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit size={16} />
                    </button>
                    {/* DELETE BUTTON */}
                    <button onClick={() => handleDeleteClick(student)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            {/* SUCCESS MESSAGE (Green Toast) */}
            {successMsg && (
                <div className="fixed top-5 right-5 z-[70] bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-in">
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                        <h4 className="font-bold">Success</h4>
                        <p className="text-sm">{successMsg}</p>
                    </div>
                    <button onClick={() => setSuccessMsg("")} className="ml-4 text-green-800 hover:text-green-900">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* MAIN LIST CONTENT (Switches between Grid and List) */}
            {students.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.map(student => <GridCard key={student.id} student={student} />)}
                    </div>
                ) : (
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
                )
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">No students found matching your criteria.</p>
                </div>
            )}

            {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                            <p className="text-gray-500 mb-6 text-sm">
                                Do you really want to delete <b>{studentToDelete?.name}</b>? This process cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentList;