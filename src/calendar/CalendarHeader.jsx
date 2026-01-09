import { Menu } from 'lucide-react';

const CalendarHeader = ({ toggleSidebar, monthYear }) => {
    return (
        <header className="px-6 py-4 md:px-8 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all flex-shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Executive Calendar</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage schedules and events.</p>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm shadow-sm">
                {monthYear}
            </div>
        </header>
    );
};

export default CalendarHeader;
