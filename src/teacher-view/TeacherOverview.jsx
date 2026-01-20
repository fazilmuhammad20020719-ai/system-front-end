import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Layout, MessageCircle } from 'lucide-react';

const TeacherOverview = ({ teacher, stats }) => {

    // Helper: Date Formatter (Same as Student)
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Helper: Open WhatsApp
    const openWhatsApp = (number) => {
        if (!number) return;
        window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Top Actions */}
            <div className="flex flex-wrap gap-2">
                <ActionButton
                    icon={Phone}
                    label="Call"
                    onClick={() => window.open(`tel:${teacher.phone}`)}
                    color="text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600"
                />
                <ActionButton
                    icon={MessageCircle}
                    label="WhatsApp"
                    onClick={() => openWhatsApp(teacher.phone)}
                    color="text-gray-600 bg-gray-50 hover:bg-green-50 hover:text-green-600"
                />
                {teacher.email && (
                    <ActionButton
                        icon={Mail}
                        label="Email"
                        onClick={() => window.open(`mailto:${teacher.email}`)}
                        color="text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600"
                    />
                )}
                {teacher.googleMapLink && (
                    <ActionButton
                        icon={MapPin}
                        label="Location"
                        onClick={() => window.open(teacher.googleMapLink, '_blank')}
                        color="text-gray-600 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Contact Info */}
                <SectionCard title="Contact Information" icon={User} color="text-blue-600" bg="bg-blue-50">
                    <div className="space-y-0.5">
                        <DetailRow label="Full Name" value={`${teacher.firstName} ${teacher.lastName}`} highlight />
                        <DetailRow label="Email" value={teacher.email} />
                        <DetailRow label="Phone" value={teacher.phone} />
                        <DetailRow label="Address" value={teacher.address} />
                        <DetailRow label="Date of Birth" value={formatDate(teacher.dob)} />
                        <DetailRow label="Gender" value={teacher.gender} />
                        <DetailRow label="NIC No" value={teacher.nic} />
                    </div>

                </SectionCard>

                {/* 2. Professional Details */}
                <SectionCard title="Professional Details" icon={Briefcase} color="text-purple-600" bg="bg-purple-50">
                    <div className="space-y-0.5">
                        <DetailRow label="Employee ID" value={teacher.employeeId} highlight />
                        <DetailRow label="Designation" value={teacher.designation} />
                        <DetailRow label="Department" value={teacher.department} />
                        <DetailRow label="Qualification" value={teacher.qualification} />
                        <DetailRow label="Experience" value={teacher.experience} />
                        <DetailRow label="Joining Date" value={formatDate(teacher.joiningDate)} />
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-500 font-medium">Status</span>
                            <div className="text-right">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {teacher.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* 3. Teaching Stats */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard label="Classes Assigned" value={stats?.classesAssigned || 0} color="text-indigo-600" />
                        <StatCard label="Total Students" value={stats?.totalStudents || 0} color="text-pink-600" />
                        <StatCard label="Avg Attendance" value={stats?.avgAttendance || "0%"} color="text-green-600" />
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Styled Components (Reused from Student View) ---

const SectionCard = ({ title, icon: Icon, color, bg, children }) => (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden flex flex-col h-full hover:border-gray-200 transition-colors">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bg} ${color}`}>
                <Icon size={18} />
            </div>
            <h3 className="font-bold text-gray-800 text-[15px]">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            {children}
        </div>
    </div>
);

const DetailRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`text-sm text-right max-w-[60%] truncate ${highlight ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
            {value || "—"}
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, label, onClick, color }) => (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${color}`}>
        <Icon size={16} /> {label}
    </button>
);

const StatCard = ({ label, value, color = "text-gray-800" }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] text-center hover:border-blue-200 transition-all group">
        <p className="text-xs text-gray-400 font-bold uppercase mb-2 group-hover:text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

export default TeacherOverview;