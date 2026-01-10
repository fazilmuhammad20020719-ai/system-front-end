import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, CalendarCheck, Folder, ArrowRight, Users } from 'lucide-react';

// Component: Individual Stat Card
const StatCard = ({ title, value, subText, icon: Icon, iconColor, iconBg, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition-all cursor-pointer group"
    >
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={iconColor} size={28} />
        </div>
        <div className="flex-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium group-hover:text-gray-600 transition-colors">
                {subText}
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
        </div>
    </div>
);

const DashboardStats = () => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Students"
                value="4"
                subText="View Directory"
                icon={GraduationCap}
                iconColor="text-indigo-600"
                iconBg="bg-indigo-100"
                onClick={() => navigate('/students')}
            />
            <StatCard
                title="Programs"
                value="6"
                subText="Manage Courses"
                icon={BookOpen}
                iconColor="text-orange-600"
                iconBg="bg-orange-100"
                onClick={() => navigate('/programs')}
            />
            <StatCard
                title="Student Attendance"
                value="50%"
                subText="2 / 4 Present"
                icon={CalendarCheck}
                iconColor="text-green-600"
                iconBg="bg-green-100"
                onClick={() => navigate('/attendance')}
            />
            <StatCard
                title="Teacher Attendance"
                value="85%"
                subText="6 / 7 Present"
                icon={Users}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
                onClick={() => navigate('/attendance')}
            />
            <StatCard
                title="Documents"
                value="15"
                subText="File Repository"
                icon={Folder}
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
                onClick={() => navigate('/documents')}
            />
        </div>
    );
};

export default DashboardStats;
