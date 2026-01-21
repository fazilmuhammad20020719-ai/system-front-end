import { Umbrella } from 'lucide-react';

const AttendanceTable = ({ students, onStatusChange, isEditing }) => {

    const getInitials = (name) => name ? name.charAt(0).toLowerCase() : "-";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#f8fafc] p-4 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider min-w-[600px]">
                <div className="col-span-5 pl-2">Student</div>
                <div className="col-span-4">Class Info</div>
                <div className="col-span-3 text-left">Status</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100 overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="min-w-[600px]">
                    {students.length > 0 ? students.map((student) => (
                        <div key={student.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50 transition-colors group">
                            <div className="col-span-5 flex items-center gap-3 pl-2">
                                <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-sm lowercase pb-0.5 shrink-0">
                                    {getInitials(student.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-700 leading-tight truncate">{student.name}</p>
                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{student.adminId}</p>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <span className="inline-block bg-[#f3f4f6] text-gray-500 text-[11px] px-2.5 py-1 rounded font-medium border border-gray-200 whitespace-nowrap">
                                    {student.program} {student.year}
                                </span>
                            </div>

                            <div className="col-span-3 flex items-center gap-2">
                                <button
                                    disabled={!isEditing}
                                    onClick={() => onStatusChange(student.id, 'Present')}
                                    className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Present'
                                        ? 'bg-green-100 border-green-500 text-green-600'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        } ${isEditing ? 'hover:border-green-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                                >
                                    <span className="font-bold text-xs">P</span>
                                </button>
                                <button
                                    disabled={!isEditing}
                                    onClick={() => onStatusChange(student.id, 'Absent')}
                                    className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Absent'
                                        ? 'bg-red-100 border-red-500 text-red-600'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        } ${isEditing ? 'hover:border-red-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                                >
                                    <span className="font-bold text-xs">A</span>
                                </button>
                                <button
                                    disabled={!isEditing}
                                    onClick={() => onStatusChange(student.id, 'Holiday')}
                                    className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${student.status === 'Holiday'
                                        ? 'bg-blue-100 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        } ${isEditing ? 'hover:border-blue-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                                >
                                    <Umbrella size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400 text-sm">No records found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;
