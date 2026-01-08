import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Layout } from 'lucide-react';

const TeacherOverview = ({ teacher }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Contact Info */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><User size={16} /> Personal Info</h3>
                    <div className="space-y-4">
                        <InfoRow icon={Mail} label="Email" value={teacher.email} />
                        <InfoRow icon={Phone} label="Phone" value={teacher.phone} />
                        <InfoRow icon={MapPin} label="Address" value={teacher.address} />
                        <InfoRow icon={Calendar} label="Join Date" value={teacher.joiningDate} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Briefcase size={16} /> Work Info</h3>
                    <div className="space-y-4">
                        <InfoRow icon={Briefcase} label="Department" value={teacher.department} />
                        <InfoRow icon={GraduationCap} label="Role" value={teacher.role} />
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-bold text-gray-500">Status</span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">{teacher.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Stats & Activity */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Classes" value="5" />
                    <StatCard label="Students" value="120" />
                    <StatCard label="Attendance" value="98%" color="text-green-600" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 flex items-center justify-center text-gray-400">
                    <span className="flex items-center gap-2"><Layout size={20} /> Activity Log / Timeline Placeholder</span>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-2 text-gray-500">
            <Icon size={14} />
            <span className="text-xs font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-700">{value}</span>
    </div>
);

const StatCard = ({ label, value, color = "text-gray-800" }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
        <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

export default TeacherOverview;