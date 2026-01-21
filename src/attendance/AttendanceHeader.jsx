import { Menu, Lock, Save, X } from 'lucide-react';

const AttendanceHeader = ({ toggleSidebar, selectedDate, activeTab, setActiveTab, isEditing, onEditClick, onSaveClick, onCancelClick }) => {
    const formattedHeaderDate = new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <header className="px-4 py-4 md:px-8 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Attendance Registry</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Switcher */}
                <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 inline-flex">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'students'
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'teachers'
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Teachers
                    </button>
                </div>

                {!isEditing ? (
                    <button
                        onClick={onEditClick}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Lock size={16} />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onCancelClick}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                        >
                            <X size={16} />
                            <span className="hidden sm:inline">Cancel</span>
                        </button>
                        <button
                            onClick={onSaveClick}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Save size={16} />
                            <span className="hidden sm:inline">Save</span>
                        </button>
                    </div>
                )}

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hidden md:block">
                    <span className="text-gray-700 font-medium text-sm">{formattedHeaderDate}</span>
                </div>
            </div>
        </header>
    );
};

export default AttendanceHeader;
