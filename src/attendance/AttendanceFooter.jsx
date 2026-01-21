import { Lock, Save, X, Edit } from 'lucide-react';

const AttendanceFooter = ({ count, isEditing, onEditClick, onSaveClick, onCancelClick, isSidebarOpen }) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-10 transition-all duration-300 ${isSidebarOpen ? "md:left-64" : "md:left-20"}`}>
            <div className="text-sm font-semibold text-gray-500">
                Records: <span className="text-gray-800">{count}</span>
            </div>

            <div className="flex items-center gap-3">
                {!isEditing ? (
                    <button
                        onClick={onEditClick}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Lock size={16} />
                        <span>Edit Attendance</span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onCancelClick}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                        >
                            <X size={16} />
                            <span>Cancel</span>
                        </button>
                        <button
                            onClick={onSaveClick}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceFooter;
