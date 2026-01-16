import { Menu, Plus, BookOpen } from 'lucide-react';

const ProgramsHeader = ({ toggleSidebar, onAddClick, onAddSubjectClick }) => {
    return (
        <header className="px-6 py-5 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Academic Programs</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Manage courses, subjects, and curriculum details.</p>
                </div>
            </div>

            <div className="flex gap-3">
                {/* Add Subject Button */}
                <button
                    onClick={onAddSubjectClick}
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                    <BookOpen size={18} className="text-green-600" /> Add Subject
                </button>

                {/* Add Program Button */}
                <button
                    onClick={onAddClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={18} /> Add Program
                </button>
            </div>
        </header>
    );
};

export default ProgramsHeader;