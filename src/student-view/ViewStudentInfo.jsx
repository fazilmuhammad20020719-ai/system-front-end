import { User, GraduationCap, Users, MapPin, School, Phone, MessageCircle, Mail, Calendar } from 'lucide-react';

const ViewStudentInfo = ({ student }) => {

    // Helper: Date Formatter
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Helper: Age Calculator
    const getAge = (dateString) => {
        if (!dateString) return "";
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} Years`;
    };

    // Helper: Open WhatsApp
    const openWhatsApp = (number) => {
        if (!number) return;
        window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Personal Details */}
            <SectionCard title="Personal Details" icon={User} color="text-blue-600" bg="bg-blue-50">
                <div className="space-y-0.5">
                    <DetailRow label="Full Name" value={`${student.firstName} ${student.lastName}`} highlight />

                    {/* Date of Birth with Age */}
                    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500 font-medium">Date of Birth</span>
                        <div className="text-right">
                            <span className="text-sm font-semibold text-gray-700 block">{formatDate(student.dob)}</span>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{getAge(student.dob)}</span>
                        </div>
                    </div>

                    <DetailRow label="Gender" value={student.gender} />
                    <DetailRow label="NIC / B-Form" value={student.nic} />
                    <DetailRow label="Email" value={student.email} />
                    <DetailRow label="Phone" value={student.phone} />
                </div>

                {/* Student Actions (ADDED EMAIL BUTTON HERE) */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <ActionButton icon={Phone} label="Call" onClick={() => window.open(`tel:${student.phone}`)} color="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" />
                    <ActionButton icon={MessageCircle} label="WhatsApp" onClick={() => openWhatsApp(student.phone)} color="text-green-600 bg-green-50 hover:bg-green-100 border-green-200" />

                    {/* New Email Button for Student */}
                    {student.email && (
                        <ActionButton
                            icon={Mail}
                            label="Email"
                            onClick={() => window.open(`mailto:${student.email}`)}
                            color="text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200"
                        />
                    )}
                </div>
            </SectionCard>

            {/* 2. Guardian Information */}
            <SectionCard title="Guardian Information" icon={Users} color="text-purple-600" bg="bg-purple-50">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 text-gray-400">
                        {student.guardianPhoto ? (
                            <img src={student.guardianPhoto} alt="Guardian" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                        <DetailRow label="Guardian Name" value={student.guardianName} highlight />
                        <DetailRow label="Relationship" value={student.guardianRelation} />
                        <DetailRow label="Occupation" value={student.guardianOccupation || "—"} />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <DetailRow label="Contact Number" value={student.guardianPhone} />
                    <DetailRow label="Email Address" value={student.guardianEmail || "—"} />
                </div>

                {/* Guardian Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <ActionButton icon={Phone} label="Call" onClick={() => window.open(`tel:${student.guardianPhone}`)} color="text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200" />
                    <ActionButton icon={MessageCircle} label="WhatsApp" onClick={() => openWhatsApp(student.guardianPhone)} color="text-green-600 bg-green-50 hover:bg-green-100 border-green-200" />
                    {student.guardianEmail && (
                        <ActionButton icon={Mail} label="Email" onClick={() => window.open(`mailto:${student.guardianEmail}`)} color="text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200" />
                    )}
                </div>
            </SectionCard>

            {/* 3. Address & Location */}
            <SectionCard title="Address & Location" icon={MapPin} color="text-green-600" bg="bg-green-50">
                <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Home Address</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">{student.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mb-2">
                    <DetailRow label="Province" value={student.province} />
                    <DetailRow label="District" value={student.district} />
                    <DetailRow label="DS Division" value={student.dsDivision} />
                    <DetailRow label="GN Division" value={student.gnDivision} />
                </div>

                {student.googleMapLink && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => window.open(student.googleMapLink, '_blank')} className="w-full flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 border border-green-200 transition-colors">
                            <MapPin size={14} /> Open Location in Google Maps
                        </button>
                    </div>
                )}
            </SectionCard>

            {/* 4. Academic History */}
            <SectionCard title="Academic History" icon={GraduationCap} color="text-orange-600" bg="bg-orange-50">
                {/* Status & Index */}
                <div className="pb-4 border-b border-gray-100 mb-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Program</p>
                            <p className="font-bold text-gray-800 text-base">{student.program}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {student.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Index Number</p>
                            <p className="font-bold text-gray-800">{student.indexNumber || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Admission Date</p>
                            <p className="font-bold text-gray-800">{formatDate(student.admissionDate)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Batch / Session</p>
                            <p className="text-sm font-semibold text-gray-700">{student.session}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Current Grade</p>
                            <p className="text-sm font-semibold text-gray-700">{student.year}</p>
                        </div>
                    </div>
                </div>

                {/* Previous Education */}
                <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase mb-3">
                        <School size={14} className="text-gray-400" /> Previous Education
                    </h4>
                    <div className="space-y-0.5">
                        <DetailRow label="Prev. School" value={student.previousSchool} />
                        <DetailRow label="Last Grade" value={student.lastStudiedGrade} />
                        <DetailRow label="Prev. Madrasa" value={student.previousCollegeName} />
                        <DetailRow label="Medium" value={student.mediumOfStudy} />
                    </div>
                </div>
            </SectionCard>

        </div>
    );
};

// --- Styled Components ---

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
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${color}`}>
        <Icon size={14} /> {label}
    </button>
);

export default ViewStudentInfo;