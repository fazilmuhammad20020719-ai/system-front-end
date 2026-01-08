import { Menu, Calendar } from 'lucide-react';

const DashboardHeader = ({ toggleSidebar }) => {
    return (
        <header className="px-6 py-4 md:px-8 md:h-20 flex flex-row items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            </div>
            <div className="hidden md:flex bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 shadow-sm">
                <Calendar size={16} />
                <span>December 25, 2025</span>
            </div>
        </header>
    );
};

export default DashboardHeader;
