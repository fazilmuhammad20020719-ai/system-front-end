const AttendanceStats = ({ dailyRate, averageRate }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Date Attendance</h3>
                    <p className="text-xs text-gray-300 font-medium mt-1">On Selected Date</p>
                </div>
                <div className="text-3xl font-bold text-[#10b981]">{dailyRate}%</div>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Average</h3>
                    <p className="text-xs text-gray-300 font-medium mt-1">Till Date (Filtered)</p>
                </div>
                <div className="text-3xl font-bold text-[#6366f1]">{averageRate}%</div>
            </div>
        </div>
    );
};

export default AttendanceStats;
