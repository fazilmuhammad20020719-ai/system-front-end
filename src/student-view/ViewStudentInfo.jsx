import { User, GraduationCap } from 'lucide-react';

const ViewStudentInfo = ({ student }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <SectionCard title="Basic Information" icon={User}>
                    <DetailRow label="Date of Birth" value={student.dob} />
                    <DetailRow label="Gender" value={student.gender} />
                    <DetailRow label="NIC / B-Form" value={student.nic} />
                    <DetailRow label="Email" value={student.email} />
                    <DetailRow label="Phone" value={student.phone} />
                    <DetailRow label="Address" value={student.address} />
                </SectionCard>

                <SectionCard title="Guardian Information" icon={User}>
                    <DetailRow label="Guardian Name" value={student.guardianName} />
                    <DetailRow label="Relationship" value={student.guardianRelation} />
                    <DetailRow label="Phone" value={student.guardianPhone} />
                    <DetailRow label="Email" value={student.guardianEmail} />
                </SectionCard>
            </div>

            {/* Right Column: ID Card Preview */}
            <div className="lg:col-span-1 space-y-6">
                <SectionCard title="Academic Info" icon={GraduationCap}>
                    <DetailRow label="Program" value={student.program} />
                    <DetailRow label="Batch" value={student.session} />
                    <DetailRow label="Year" value={student.year} />
                </SectionCard>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Digital ID Card</h3>
                    <div className="w-full aspect-[1.6] bg-gradient-to-r from-[#EB8A33] to-[#F57D1F] rounded-xl shadow-lg relative overflow-hidden text-white p-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#EB8A33] font-bold text-xs">FM</div>
                            <div>
                                <p className="text-[10px] font-medium opacity-90">FMAC Central</p>
                                <p className="text-[8px] opacity-75">Student Identity Card</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            <img src={student.image} className="w-16 h-20 bg-white rounded-md object-cover border border-white/30" alt="Student" />
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-sm leading-tight">{student.firstName} <br /> {student.lastName}</h4>
                                <p className="text-[10px] opacity-90">{student.program}</p>
                                <p className="text-[9px] opacity-80 mt-1">ID: {student.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Icon className="text-[#EB8A33]" size={20} />
            <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span className="text-sm text-gray-800 font-semibold text-right">{value || "—"}</span>
    </div>
);

export default ViewStudentInfo;