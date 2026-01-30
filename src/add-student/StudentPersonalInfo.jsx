import { User, Calendar, Mail, Phone, Hash, CreditCard, MessageCircle } from 'lucide-react';
import { InputField, SelectField, FileUploadField } from './FormComponents';
import { API_URL } from '../config'; // <--- முக்கியம்

const StudentPersonalInfo = ({ formData, handleChange, handleStatusChange }) => {

    // --- PHOTO PREVIEW LOGIC ---
    const getPreviewImage = () => {
        // 1. புதிதாக Upload செய்தால் அதை காட்டு
        if (formData.studentPhoto instanceof File) {
            return URL.createObjectURL(formData.studentPhoto);
        }
        // 2. ஏற்கனவே Database-ல் இருந்தால் அதை காட்டு
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Photo Upload */}
                <div className="lg:col-span-1">
                    <FileUploadField
                        label="Student Photo"
                        name="studentPhoto"
                        onChange={handleChange}
                        preview={getPreviewImage()} // Preview Function Call
                    />
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Index Number" name="indexNumber" value={formData.indexNumber} onChange={handleChange} placeholder="ST-2024-001" icon={Hash} required />

                    <SelectField label="Student Status" name="status" value={formData.status} onChange={handleStatusChange} options={['Active', 'Graduated', 'Suspended', 'Inactive']} required />

                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Mohamed" required />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Rifkan" />
                    <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={Calendar} required />
                    <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} />
                    <InputField label="NIC Number (Optional)" name="nic" value={formData.nic} onChange={handleChange} placeholder="987654321V" icon={CreditCard} />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" icon={Mail} />
                    <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77 123 4567" icon={Phone} />
                    <InputField label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+94 77 123 4567" icon={MessageCircle} />
                </div>
            </div>
        </div>
    );
};

export default StudentPersonalInfo;