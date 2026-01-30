import { User, MapPin, Phone, BookOpen, Users, Calendar, Mail, MessageCircle, Briefcase } from 'lucide-react';

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
                    onClick={() => window.open(`tel:${student.phone}`)}
                    color="text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600"
                />
                <ActionButton
                    icon={MessageCircle}
                    label="WhatsApp"
                    onClick={() => openWhatsApp(student.whatsapp)}
                    color="text-gray-600 bg-gray-50 hover:bg-green-50 hover:text-green-600"
                />
                {student.email && (
                    <ActionButton
                        icon={Mail}
                        label="Email"
                        onClick={() => window.open(`mailto:${student.email}`)}
                        color="text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Personal Details */}
                <SectionCard title="Personal Details" icon={User} color="text-blue-600" bg="bg-blue-50">
                    <div className="space-y-0.5">
                        <DetailRow label="Full Name" value={student.name} highlight />
                        <DetailRow label="Date of Birth" value={formatDate(student.dob)} />
                        <DetailRow label="Gender" value={student.gender} />
                        <DetailRow label="NIC Number" value={student.nic} />
                        <DetailRow label="Email" value={student.email} />
                        <DetailRow label="Mobile" value={student.phone} />
                        <DetailRow label="Last Studied Grade" value={student.lastStudiedGrade || student.last_studied_grade} />
                    </div>
                </SectionCard>

                {/* 2. Address & Location */}
                <SectionCard title="Address & Location" icon={MapPin} color="text-red-600" bg="bg-red-50">
                    <div className="space-y-0.5">
                        <DetailRow label="Permanent Address" value={student.address} />
                        <DetailRow label="City" value={student.city} />
                        <DetailRow label="District" value={student.district} />
                        <DetailRow label="DS Division" value={student.dsDivision} />
                        <DetailRow label="GN Division" value={student.gnDivision} />
                        <DetailRow label="Province" value={student.province} />
                    </div>
                </SectionCard>

                {/* 3. Academic Information */}
                <SectionCard title="Academic Information" icon={BookOpen} color="text-purple-600" bg="bg-purple-50">
                    <div className="space-y-0.5">
                        <DetailRow label="Program" value={student.program_name || student.program} highlight />
                        <DetailRow label="Current Year" value={student.year || student.current_year} />
                        <DetailRow label="Session / Batch" value={student.session || student.session_year} />
                        <DetailRow label="Admission Date" value={(student.admissionDate && student.admissionDate !== 'N/A') ? formatDate(student.admissionDate) : (student.admission_date ? formatDate(student.admission_date) : '—')} />
                        <DetailRow label="Previous School" value={student.previousSchool || student.previous_school} />
                        <DetailRow label="Previous School" value={student.previousSchool || student.previous_school} />

                        <DetailRow label="Medium" value={student.mediumOfStudy || student.medium_of_study} />
                    </div>
                </SectionCard>

                {/* 4. Guardian Information */}
                <SectionCard title="Guardian Information" icon={Users} color="text-green-600" bg="bg-green-50">
                    <div className="flex flex-col gap-4">
                        {/* Guardian Photo & Actions */}
                        <div className="flex items-center gap-4">
                            {student.guardianPhoto ? (
                                <img
                                    src={student.guardianPhoto}
                                    alt="Guardian"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-300">
                                    <Users size={32} />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {(student.guardianPhone || student.guardian_phone) && (
                                    <>
                                        <ActionButton
                                            icon={Phone}
                                            label="Call"
                                            onClick={() => window.open(`tel:${student.guardianPhone || student.guardian_phone}`)}
                                            color="text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600"
                                        />
                                        <ActionButton
                                            icon={MessageCircle}
                                            label="WhatsApp"
                                            onClick={() => openWhatsApp(student.guardianPhone || student.guardian_phone)}
                                            color="text-gray-600 bg-gray-50 hover:bg-green-50 hover:text-green-600"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <DetailRow label="Guardian Name" value={student.guardianName || student.guardian_name} highlight />
                            <DetailRow label="Relationship" value={student.guardianRelation || student.guardian_relation} />
                            <DetailRow label="Occupation" value={student.guardianOccupation || student.guardian_occupation} />
                            <DetailRow label="Phone" value={student.guardianPhone || student.guardian_phone} />
                            <DetailRow label="Email" value={student.guardianEmail || student.guardian_email} />
                        </div>
                    </div>
                </SectionCard>

            </div>
        </div>
    );
};

// --- Styled Components (Reused from Teacher View) ---

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

export default ViewStudentInfo;