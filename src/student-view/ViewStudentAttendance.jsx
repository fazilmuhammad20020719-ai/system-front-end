import { CheckCircle, XCircle, Clock } from 'lucide-react';

const ViewStudentAttendance = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500 text-sm font-medium">Attendance Rate</p>
                    <h2 className="text-4xl font-bold text-[#EB8A33] mt-2">
                        {Math.round((stats.present / stats.total) * 100)}%
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Total Days: {stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                    <span className="text-green-700 font-medium flex items-center gap-2"><CheckCircle size={16} /> Present</span>
                    <span className="font-bold text-green-800 text-lg">{stats.present}</span>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                    <span className="text-red-700 font-medium flex items-center gap-2"><XCircle size={16} /> Absent</span>
                    <span className="font-bold text-red-800 text-lg">{stats.absent}</span>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-[#EB8A33]" size={20} />
                    <h3 className="font-bold text-gray-800">Attendance Log</h3>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
                    Detailed Calendar View Component Goes Here
                </div>
            </div>
        </div>
    );
};

export default ViewStudentAttendance;