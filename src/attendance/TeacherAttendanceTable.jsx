import { Umbrella } from 'lucide-react';

const TeacherAttendanceTable = ({ teachers, onStatusChange }) => {

    const getInitials = (name) => name ? name.charAt(0).toLowerCase() : "-";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#f8fafc] p-4 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider min-w-[600px]">
                <div className="col-span-5 pl-2">Teacher</div>
                <div className="col-span-4">Position Info</div>
                <div className="col-span-3 text-left">Status</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="min-w-[600px]">
                    {teachers.length > 0 ? teachers.map((teacher) => (
                        <div key={teacher.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50 transition-colors group">
                            <div className="col-span-5 flex items-center gap-3 pl-2">
                                <div className="w-9 h-9 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-sm lowercase pb-0.5 shrink-0">
                                    {getInitials(teacher.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-700 leading-tight truncate">{teacher.name}</p>
                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{teacher.empid}</p>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-gray-600 truncate">{teacher.role}</span>
                                    <span className="inline-block bg-[#f3f4f6] text-gray-500 text-[10px] px-2 py-0.5 rounded border border-gray-200 w-fit truncate max-w-full">
                                        {teacher.subject}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-3 flex items-center gap-2">
                                <button onClick={() => onStatusChange(teacher.id, 'Present')} className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${teacher.attendanceStatus === 'Present' ? 'bg-green-100 border-green-500 text-green-600' : 'bg-white border-gray-200 text-gray-400 hover:border-green-300'}`}><span className="font-bold text-xs">P</span></button>
                                <button onClick={() => onStatusChange(teacher.id, 'Absent')} className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${teacher.attendanceStatus === 'Absent' ? 'bg-red-100 border-red-500 text-red-600' : 'bg-white border-gray-200 text-gray-400 hover:border-red-300'}`}><span className="font-bold text-xs">A</span></button>
                                <button onClick={() => onStatusChange(teacher.id, 'Holiday')} className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${teacher.attendanceStatus === 'Holiday' ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'}`}><Umbrella size={14} strokeWidth={2.5} /></button>
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

export default TeacherAttendanceTable;
