import { Users, UserCheck, UserX, GraduationCap } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
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
            />
            <StatCard
                label="Active"
                value={active}
                icon={UserCheck}
                color="text-green-600"
                bg="bg-green-50"
            />
            <StatCard
                label="Non-Active"
                value={inactive}
                icon={UserX}
                color="text-red-400"  // Lighter Red text
                bg="bg-red-50"
            />
            <StatCard
                label="Graduated"
                value={graduated}
                icon={GraduationCap}
                color="text-yellow-600" // Gold Text
                bg="bg-yellow-100"      // Gold Background
            />
        </div>
    );
};

export default StudentStats;