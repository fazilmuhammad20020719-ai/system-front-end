import { User, GraduationCap, Users } from 'lucide-react';

const ViewStudentInfo = ({ student }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* 1. Basic Information */}
            <SectionCard title="Basic Information" icon={User} color="text-blue-500">
                <DetailRow label="Date of Birth" value={student.dob} />
                <DetailRow label="Gender" value={student.gender} />
                <DetailRow label="NIC / B-Form" value={student.nic} />
                <DetailRow label="Email" value={student.email} />
                <DetailRow label="Phone" value={student.phone} />
                <DetailRow label="Address" value={student.address} />
            </SectionCard>

            {/* 2. Academic Information (Moved for better balance) */}
            <SectionCard title="Academic Information" icon={GraduationCap} color="text-orange-500">
                <DetailRow label="Program" value={student.program} />
                <DetailRow label="Batch / Session" value={student.session} />
                <DetailRow label="Current Year" value={student.year} />
                <DetailRow label="Student ID" value={student.id} />
                <DetailRow label="Admission Date" value={student.admissionDate || "—"} />
                <DetailRow label="Status" value={
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {student.status || "Active"}
                    </span>
                } />
            </SectionCard>

            {/* 3. Guardian Information */}
            <SectionCard title="Guardian Information" icon={Users} color="text-purple-500">
                <DetailRow label="Guardian Name" value={student.guardianName} />
                <DetailRow label="Relationship" value={student.guardianRelation} />
                <DetailRow label="Phone" value={student.guardianPhone} />
                <DetailRow label="Email" value={student.guardianEmail} />
                <DetailRow label="Occupation" value={student.guardianOccupation || "—"} />
                <DetailRow label="Emergency Contact" value={student.emergencyContact || student.guardianPhone} />
            </SectionCard>

        </div>
    );
};

// --- Reusable Components with Enhanced Styling ---

const SectionCard = ({ title, icon: Icon, color, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
            <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100 ${color}`}>
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-center space-y-1">
            {children}
        </div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-md">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className="text-sm text-gray-800 font-semibold text-right max-w-[60%] truncate">
            {value}
        </div>
    </div>
);

export default ViewStudentInfo;