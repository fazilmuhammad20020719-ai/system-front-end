import { Users, Briefcase, User } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TeachersStats = ({ teachers }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                icon={Users}
                label="Total Teachers"
                value={teachers.length}
                color="bg-blue-50 text-blue-600"
            />
            <StatCard
                icon={Briefcase}
                label="Active Teachers"
                value={teachers.filter(t => t.status === 'Active').length}
                color="bg-green-50 text-green-600"
            />
            <StatCard
                icon={User}
                label="On Leave"
                value={teachers.filter(t => t.status === 'On Leave').length}
                color="bg-orange-50 text-orange-600"
            />
        </div>
    );
};

export default TeachersStats;
