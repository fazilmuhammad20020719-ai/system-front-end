import { Menu, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeachersHeader = ({ toggleSidebar }) => {
    return (
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm transition-all">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teachers Directory</h1>
                    <p className="text-sm text-gray-500">Manage teachers and faculty</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
                    <Download size={16} /> Export CSV
                </button>
                <Link to="/add-teacher">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all">
                        <Plus size={18} /> Add Teacher
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default TeachersHeader;
