import { Menu } from 'lucide-react';

const AttendanceHeader = ({ toggleSidebar, selectedDate, activeTab, setActiveTab }) => {
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

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hidden md:block">
                    <span className="text-gray-700 font-medium text-sm">{formattedHeaderDate}</span>
                </div>
            </div>
        </header>
    );
};

export default AttendanceHeader;
