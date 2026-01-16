import React, { useState, useEffect } from 'react';
import { X, Check, Clock, User, Ban, Save, Search } from 'lucide-react';

const AttendancePopup = ({ isOpen, onClose, slot, subjects, onSave, onCancel }) => {
    if (!isOpen || !slot) return null;

    // 1. Get Subject Details to filter students
    const subject = subjects.find(s => s.id === parseInt(slot.subjectId));

    // 2. State for Students List & Search
    const [attendanceList, setAttendanceList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // 3. Load & Filter Students on Mount
    useEffect(() => {
        if (subject) {
            // Filter Mock Data based on Program and Year/Grade
            const classStudents = [];

            setAttendanceList(classStudents);
        }
    }, [subject, slot]);

    // 4. Handlers
    const handleStatusChange = (studentId, status) => {
        setAttendanceList(attendanceList.map(s =>
            s.id === studentId ? { ...s, status } : s
        ));
    };

    const handleSave = () => {
        onSave(attendanceList);
    };

    const handleCancelClass = () => {
        if (window.confirm("Are you sure you want to CANCEL this class session?")) {
            onCancel();
        }
    };

    // Filter displayed students by search
    const filteredStudents = attendanceList.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery)
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

                {/* --- Header --- */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 rounded-t-2xl">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">Mark Attendance</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ea8933]/10 text-[#ea8933] border border-[#ea8933]/20">
                                {subject?.program}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">{subject?.name}</span>
                            <span>•</span>
                            <span>{subject?.year}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                <Clock size={10} /> {slot.startTime} - {slot.endTime}
                            </span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* --- Toolbar --- */}
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                        />
                    </div>
                    <div className="text-xs font-bold text-gray-500">
                        Total: {attendanceList.length} Students
                    </div>
                </div>

                {/* --- Student List (Scrollable) --- */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f8fafc]">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{student.name}</h4>
                                        <p className="text-xs text-gray-400 font-mono">{student.id}</p>
                                    </div>
                                </div>

                                {/* Status Buttons */}
                                <div className="flex gap-2">
                                    {['Present', 'Absent'].map((status) => {
                                        const isActive = student.status === status;
                                        let colorClass = "hover:bg-gray-50 border-gray-200 text-gray-400"; // Default

                                        if (isActive && status === 'Present') colorClass = "bg-emerald-100 border-emerald-500 text-emerald-700 font-bold";
                                        if (isActive && status === 'Absent') colorClass = "bg-rose-100 border-rose-500 text-rose-700 font-bold";

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(student.id, status)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${colorClass}`}
                                            >
                                                {status === 'Present' ? 'P' : 'A'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <User size={40} className="mb-2 opacity-20" />
                            <p className="text-sm">No students found for this class.</p>
                        </div>
                    )}
                </div>

                {/* --- Footer / Actions --- */}
                <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl flex justify-between items-center">

                    {/* Cancel Class Button */}
                    <button
                        onClick={handleCancelClass}
                        className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                        <Ban size={16} />
                        Cancel Class
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-500 text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                            Close
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-[#ea8933] text-white rounded-xl text-sm font-bold hover:bg-[#d97c2a] shadow-sm shadow-orange-200 flex items-center gap-2 transition-all"
                        >
                            <Save size={16} />
                            Save Attendance
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AttendancePopup;