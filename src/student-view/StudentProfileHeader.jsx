import { GraduationCap, Edit, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfileHeader = ({ student }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-orange-50 overflow-hidden">
                        {/* Student Image Placeholder */}
                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-[#EB8A33] text-3xl font-bold">
                            {student.firstName?.charAt(0)}
                        </div>
                    </div>
                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{student.firstName} {student.lastName}</h1>
                    <div className="flex items-center gap-3 text-gray-500 mt-1">
                        <span className="flex items-center gap-1.5 text-sm"><GraduationCap size={16} /> {student.program}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm">#{student.id}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                {/* EDIT BUTTON CHECK */}
                <button
                    onClick={() => navigate(`/edit-student/${student.id}`)}
                    className="flex-1 md:flex-none px-4 py-2 border border-gray-200 hover:border-[#EB8A33] hover:text-[#EB8A33] text-gray-700 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 bg-white"
                >
                    <Edit size={16} /> Edit Profile
                </button>

                <button className="flex-1 md:flex-none px-4 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2">
                    <Printer size={16} /> Print
                </button>
            </div>
        </div>
    );
};

export default StudentProfileHeader;