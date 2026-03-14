import { User, Calendar, Mail, Phone, Hash, CreditCard, MessageCircle } from 'lucide-react';
import { InputField, SelectField, FileUploadField } from './FormComponents';
import { ProfilePhotoUpload } from '../components/ProfilePhotoUpload';
import { API_URL } from '../config';

// Today's date in YYYY-MM-DD for DOB max= attribute
const todayDate = new Date().toISOString().split('T')[0];

// Sri Lankan NIC: 9 digits + V/X  OR  12 digits
const NIC_PATTERN = "^([0-9]{9}[VvXx]|[0-9]{12})$";

const StudentPersonalInfo = ({ formData, handleChange, handleStatusChange }) => {

    // --- PHOTO PREVIEW LOGIC ---
    const getPreviewImage = () => {
        // 1. If newly uploaded, show object URL
        if (formData.studentPhoto instanceof File) {
            return URL.createObjectURL(formData.studentPhoto);
        }
        // 2. If already in database, show it
        if (formData.photoUrl) {
            return formData.photoUrl.startsWith('http')
                ? formData.photoUrl
                : `${API_URL}${formData.photoUrl}`;
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="text-[#EB8A33]" size={18} /> Personal Information
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo Upload */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <ProfilePhotoUpload
                        name="studentPhoto"
                        onChange={handleChange}
                        preview={getPreviewImage()}
                    />
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputField label="Index Number" name="indexNumber" value={formData.indexNumber} onChange={handleChange} placeholder="ST-2024-001" icon={Hash} required />

                    <SelectField label="Student Status" name="status" value={formData.status} onChange={handleStatusChange} options={['Active', 'Graduated', 'Suspended', 'Inactive']} required />

                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Mohamed" required />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Rifkan" />

                    {/* DOB: max=today prevents future dates */}
                    <InputField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        icon={Calendar}
                        required
                        max={todayDate}
                    />

                    <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} />

                    {/* NIC: old (9 digits + V/X) or new (12 digits) */}
                    <InputField
                        label="NIC Number (Optional)"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="987654321V or 200012345678"
                        icon={CreditCard}
                        pattern={NIC_PATTERN}
                        title="Enter old NIC (9 digits + V/X) or new NIC (12 digits)"
                    />

                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" icon={Mail} />

                    {/* Phone: exactly 10 digits */}
                    <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0771234567"
                        icon={Phone}
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        title="Phone number must be exactly 10 digits"
                    />

                    {/* WhatsApp: exactly 10 digits */}
                    <InputField
                        label="WhatsApp Number"
                        name="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="0771234567"
                        icon={MessageCircle}
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        title="WhatsApp number must be exactly 10 digits"
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentPersonalInfo;
