import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Save, UserCheck, UserX } from 'lucide-react';

const AttendanceActionModal = ({ isOpen, onClose, onSaveAttendance, onCancelClass, slotDetails, students = [], existingAttendance = {} }) => {
    // State to track attendance: { [studentId]: 'present' | 'absent' }
    const [attendanceMap, setAttendanceMap] = useState({});

    // Initialize attendance when modal opens
    useEffect(() => {
        if (isOpen && students.length > 0) {
            const initialMap = {};
            students.forEach(student => {
                // Use existing record if available, otherwise default to 'present'
                initialMap[student.id] = existingAttendance[student.id] || 'present';
            });
            setAttendanceMap(initialMap);
        }
    }, [isOpen, students, existingAttendance]);

    if (!isOpen) return null;

    const toggleAttendance = (studentId) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const handleSave = () => {
        onSaveAttendance(attendanceMap);
    };

    // Calculate stats
    const totalStudents = students.length;
    const presentCount = Object.values(attendanceMap).filter(s => s === 'present').length;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Mark Attendance</h3>
                        <p className="text-xs text-gray-500">{slotDetails?.subject} • {slotDetails?.grade}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable Student List */}
                <div className="p-4 overflow-y-auto flex-1">
                    {students.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <UserX size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No students found for this class.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4 px-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Student List ({totalStudents})</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {presentCount} Present
                                </span>
                            </div>
                            <div className="space-y-2">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        onClick={() => toggleAttendance(student.id)}
                                        className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all ${attendanceMap[student.id] === 'present'
                                                ? 'bg-white border-gray-200 hover:border-green-300'
                                                : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${attendanceMap[student.id] === 'present' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${attendanceMap[student.id] === 'absent' ? 'text-gray-500' : 'text-gray-800'}`}>
                                                    {student.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">{student.id}</p>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${attendanceMap[student.id] === 'present'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {attendanceMap[student.id] === 'present' ? 'Present' : 'Absent'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-3">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a] flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                    >
                        <Save size={18} />
                        Save Attendance
                    </button>

                    <button
                        onClick={onCancelClass}
                        className="w-full py-3 rounded-xl bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-all"
                    >
                        <XCircle size={18} />
                        Cancel Class
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceActionModal;
