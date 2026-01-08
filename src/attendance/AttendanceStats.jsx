import { UserCheck, UserX, Percent, Activity } from 'lucide-react';

const AttendanceStats = ({ dailyRate, averageRate, presentCount, absentCount }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Present Count */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Present Today</p>
                    <p className="text-2xl font-bold text-gray-800">{presentCount}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <UserCheck size={20} />
                </div>
            </div>

            {/* Absent Count */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Absent Today</p>
                    <p className="text-2xl font-bold text-gray-800">{absentCount}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <UserX size={20} />
                </div>
            </div>

            {/* Daily Rate */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Daily Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{dailyRate}%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Percent size={20} />
                </div>
            </div>

            {/* Average Rate */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Average Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{averageRate}%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Activity size={20} />
                </div>
            </div>

        </div>
    );
};

export default AttendanceStats;
