import { ChevronRight, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditTeacherHeader = ({ toggleSidebar, onSave }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-gray-200 px-8 h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm transition-all">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Edit Teacher</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="cursor-pointer hover:text-[#EB8A33]" onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <ChevronRight size={14} />
                    <span className="cursor-pointer hover:text-[#EB8A33]" onClick={() => navigate('/teachers')}>Teachers</span>
                    <ChevronRight size={14} />
                    <span className="text-[#EB8A33] font-medium">Edit Teacher</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <X size={18} /> Cancel
                </button>
                <button
                    onClick={onSave}
                    className="px-6 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <Save size={18} /> Update Record
                </button>
            </div>
        </header>
    );
};

export default EditTeacherHeader;
