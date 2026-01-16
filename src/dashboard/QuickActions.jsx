import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                <p className="text-gray-500 text-sm mt-1">Manage students and admissions efficiently.</p>
            </div>
            <button
                onClick={() => navigate('/add-student')}
                className="bg-[#E88931] hover:bg-[#d67b28] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
                <UserPlus size={18} />
                Add Student
            </button>
        </div>
    );
};

export default QuickActions;
