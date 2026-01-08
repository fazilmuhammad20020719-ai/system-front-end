import { Menu, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentHeader = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();

    return (
        <header className="px-6 py-4 md:px-8 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Students Directory</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and view all registered students.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                    <Download size={16} /> <span className="hidden sm:inline">Export</span>
                </button>
                <button
                    onClick={() => navigate('/add-student')}
                    className="px-4 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add Student
                </button>
            </div>
        </header>
    );
};

export default StudentHeader;
