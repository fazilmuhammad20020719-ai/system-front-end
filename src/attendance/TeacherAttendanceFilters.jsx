import { RotateCcw, Check, X, Umbrella } from 'lucide-react';

const TeacherAttendanceFilters = ({
    selectedDate, setSelectedDate,
    filterProgram, setFilterProgram,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    onBulkAction,
    onLoadData, // Added prop
    programs = []
}) => {
    return (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-4 md:p-5 mb-6">

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-3 mb-6">
                {/* Date */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-green-500"
                    />
                </div>

                {/* Program / Department */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Department</label>
                    <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                    >
                        <option value="All">All Departments</option>
                        {programs.map(prog => (
                            <option key={prog.id} value={prog.name}>{prog.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Attendance Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Holiday">Holiday</option>
                    </select>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[180px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Teacher Search</label>
                    <input
                        type="text"
                        name="teacher_search_query"
                        autoComplete="off"
                        placeholder="Name or Emp ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-green-500 placeholder-gray-400"
                    />
                </div>

                {/* Load Button */}
                <div className="w-full md:w-auto">
                    <button
                        onClick={onLoadData}
                        className="w-full md:w-auto bg-[#1f2937] hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium flex justify-center items-center gap-2 transition-colors h-[38px]"
                    >
                        <RotateCcw size={14} /> Load Data
                    </button>
                </div>
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Bulk Actions */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <button onClick={() => onBulkAction('all-present')} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Check size={14} className="text-gray-400" /> All Present
                </button>
                <button onClick={() => onBulkAction('all-absent')} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <X size={14} className="text-gray-400" /> All Absent
                </button>
                <button onClick={() => onBulkAction('all-holiday')} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Umbrella size={14} className="text-gray-400" /> All Holiday
                </button>
            </div>
        </div>
    );
};

export default TeacherAttendanceFilters;
