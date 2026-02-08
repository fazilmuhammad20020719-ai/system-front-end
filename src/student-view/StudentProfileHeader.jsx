import React from 'react';
import { BookOpen, Edit, Calendar, GraduationCap, Clock, CheckCircle, Download, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfileHeader = ({ student }) => {
    const navigate = useNavigate();

    // 1. பெயர் மற்றும் போட்டோ கையாளுதல்
    const fullName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const photoUrl = student.photo || student.image;

    // Helper: Status Color (Matches StudentGrid.jsx)
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Graduated': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Inactive': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-500';
            case 'Graduated': return 'bg-blue-500';
            case 'Inactive': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // 2. Enrollments Logic (எல்லா பாடங்களையும் எடுக்கும் முறை)
    // Backend-ல் 'enrollments' பட்டியல் இருந்தால் அதை எடுக்கும்.
    // இல்லையென்றால், தற்போதைய 'program_name' வைத்து ஒரு பட்டியலை உருவாக்கும்.
    const enrollments = (student.enrollments && student.enrollments.length > 0)
        ? student.enrollments
        : [
            {
                program: student.program_name || student.program || 'Unassigned',
                year: student.current_year || student.currentYear || 'N/A',
                status: student.status || 'Active',
                session: student.session || student.batch || 'Current Batch'
            }
        ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Left Side: Photo & Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">

                {/* Profile Picture */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-gray-100 border-4 border-orange-50 overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-400">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{fullName.charAt(0)}</span>
                        )}
                    </div>
                    {/* Overall Status Indicator */}
                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${getStatusDotColor(student.status)}`} title={student.status}></span>
                </div>

                {/* Student Details */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-800 truncate">{fullName}</h1>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-mono rounded border border-gray-200">
                            {student.reg_no || student.id}
                        </span>
                    </div>

                    {/* --- ENROLLMENTS LIST (Multiple Programs) --- */}
                    <div className="flex flex-col gap-2 w-full">
                        {enrollments.map((enr, idx) => (
                            <div key={idx} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">

                                {/* Program Name */}
                                <div className="flex items-center gap-1.5 min-w-[150px]">
                                    <BookOpen size={16} className="text-[#ea8933]" />
                                    <span className="font-semibold text-gray-700">{enr.program}</span>
                                </div>

                                {/* Divider */}
                                <span className="hidden sm:block text-gray-300">|</span>

                                {/* Batch / Session */}
                                <div className="flex items-center gap-1.5 text-gray-500" title="Batch / Session">
                                    <Layers size={14} className="text-purple-500" />
                                    <span className="text-xs font-medium bg-white px-1.5 py-0.5 rounded border">
                                        {enr.session || 'Batch N/A'}
                                    </span>
                                </div>

                                {/* Grade / Year - Hide if Graduated/Completed */}
                                {enr.status !== 'Graduated' && enr.status !== 'Completed' && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <GraduationCap size={14} className="text-blue-500" />
                                        <span className="text-xs font-medium">{enr.year}</span>
                                    </div>
                                )}

                                {/* Status Badge (Auto Color) */}
                                <span className={`ml-auto sm:ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border flex items-center gap-1 ${getStatusColor(enr.status)}`}>
                                    {enr.status === 'Completed' || enr.status === 'Graduated' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                    {enr.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 self-start md:self-center">
                <button
                    onClick={() => navigate(`/edit-student/${student.id}`)}
                    className="flex-1 md:flex-none px-4 py-2 border border-gray-300 hover:border-[#ea8933] hover:text-[#ea8933] text-gray-600 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white shadow-sm"
                >
                    <Edit size={16} /> Edit
                </button>
                <button
                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-200"
                >
                    <Download size={16} /> Download
                </button>
            </div>
        </div>
    );
};

export default StudentProfileHeader;