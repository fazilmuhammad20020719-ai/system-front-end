import { RotateCcw, Check, X, Umbrella } from 'lucide-react';

const AttendanceFilters = ({
    selectedDate, setSelectedDate,
    filterProgram, setFilterProgram,
    filterYear, setFilterYear,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    onBulkAction
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
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                    />
                </div>

                {/* Program */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Program</label>
                    <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                    >
                        <option value="All">All Programs</option>
                        <option value="Hifzul Quran">Hifzul Quran</option>
                        <option value="Al-Alim Course">Al-Alim Course</option>
                        <option value="Al-Alimah (Girls)">Al-Alimah (Girls)</option>
                        <option value="Secondary (Gr 8-10)">Secondary (Gr 8-10)</option>
                        <option value="G.C.E. O/L Prep">G.C.E. O/L Prep</option>
                        <option value="G.C.E. A/L">G.C.E. A/L</option>
                    </select>
                </div>

                {/* Year */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Year</label>
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                    >
                        <option value="All">All Years</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                    </select>
                </div>

                {/* Status */}
                <div className="flex-1 min-w-[140px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Holiday">Holiday</option>
                    </select>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[180px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Student Search</label>
                    <input
                        type="text"
                        placeholder="Name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 placeholder-gray-400"
                    />
                </div>

                {/* Load Button */}
                <div className="w-full md:w-auto">
                    <button className="w-full md:w-auto bg-[#1f2937] hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium flex justify-center items-center gap-2 transition-colors h-[38px]">
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

export default AttendanceFilters;
