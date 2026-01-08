import { Lock } from 'lucide-react';

const AttendanceFooter = ({ count, onSaveClick, isSidebarOpen }) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-10 transition-all duration-300 ${isSidebarOpen ? "md:left-64" : "md:left-20"}`}>
            <div className="text-sm font-semibold text-gray-500">
                Records: <span className="text-gray-800">{count}</span>
            </div>
            <button
                onClick={onSaveClick}
                className="bg-[#ea8933] hover:bg-[#d97c2a] text-white px-5 py-2.5 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
                <Lock size={16} />
                <span className="hidden xs:inline">Save Attendance</span>
                <span className="inline xs:hidden">Save</span>
            </button>
        </div>
    );
};

export default AttendanceFooter;
