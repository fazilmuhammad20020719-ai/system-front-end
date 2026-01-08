import { Users, UserCheck, UserX, GraduationCap } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg, border }) => (
    <div className={`bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300 ${border}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
            <Icon size={22} strokeWidth={2.5} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-2xl font-black text-gray-800">{value}</p>
        </div>
    </div>
);

const StudentStats = ({ students }) => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const inactive = students.filter(s => s.status === 'Inactive').length;
    const graduated = students.filter(s => s.status === 'Graduated').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Total Students"
                value={total}
                icon={Users}
                color="text-blue-600"
                bg="bg-blue-50"
                border="border-blue-100"
            />
            <StatCard
                label="Active Students"
                value={active}
                icon={UserCheck}
                color="text-green-600"
                bg="bg-green-50"
                border="border-green-100"
            />
            <StatCard
                label="Inactive"
                value={inactive}
                icon={UserX}
                color="text-red-500"
                bg="bg-red-50"
                border="border-red-100"
            />
            <StatCard
                label="Graduated"
                value={graduated}
                icon={GraduationCap}
                color="text-orange-500"
                bg="bg-orange-50"
                border="border-orange-100"
            />
        </div>
    );
};

export default StudentStats;