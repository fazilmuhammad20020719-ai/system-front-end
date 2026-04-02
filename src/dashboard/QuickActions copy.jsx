import { useNavigate } from 'react-router-dom';
import { UserPlus, Book } from 'lucide-react';

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                <p className="text-gray-500 text-sm mt-1">Manage students, admissions, and personal notes efficiently.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                    onClick={() => navigate('/notebook')}
                    className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    <Book size={18} />
                    Note Book
                </button>
                <button
                    onClick={() => navigate('/add-student')}
                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    <UserPlus size={18} />
                    Add Student
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
