import { User, MapPin, Phone, BookOpen, Users, Calendar } from 'lucide-react';

const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        {Icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon size={18} /></div>}
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="font-medium text-gray-800">{value || '-'}</p>
        </div>
    </div>
);

const ViewStudentInfo = ({ student }) => {
    return (
        <div className="space-y-6">

            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="text-blue-600" size={20} />
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Full Name" value={student.name} />
                    <InfoItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : ''} icon={Calendar} />
                    <InfoItem label="Gender" value={student.gender} />
                    <InfoItem label="NIC Number" value={student.nic} />
                    <InfoItem label="Email" value={student.email} />
                    <InfoItem label="Mobile" value={student.contact_number} icon={Phone} />
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <MapPin className="text-red-600" size={20} />
                    Address & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <InfoItem label="Permanent Address" value={student.address} />
                    </div>
                    <InfoItem label="City" value={student.city} />
                    <InfoItem label="District" value={student.district} />
                    <InfoItem label="Province" value={student.province} />
                </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <BookOpen className="text-purple-600" size={20} />
                    Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FIX: student.program -> student.program_name */}
                    <InfoItem label="Program" value={student.program_name || student.program} />
                    <InfoItem label="Current Year" value={student.current_year} />
                    <InfoItem label="Session / Batch" value={student.session_year} />
                    <InfoItem label="Admission Date" value={student.admission_date ? new Date(student.admission_date).toLocaleDateString() : ''} />
                    <InfoItem label="Previous School" value={student.previous_school} />
                    <InfoItem label="Medium" value={student.medium_of_study} />
                </div>
            </div>

            {/* Guardian Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Users className="text-green-600" size={20} />
                    Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Guardian Name" value={student.guardian_name} />
                    <InfoItem label="Relationship" value={student.guardian_relation} />
                    <InfoItem label="Occupation" value={student.guardian_occupation} />
                    <InfoItem label="Phone" value={student.guardian_phone} icon={Phone} />
                </div>
            </div>

        </div>
    );
};

export default ViewStudentInfo;