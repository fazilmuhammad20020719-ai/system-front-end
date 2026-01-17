import { User, Calendar, Mail, Phone, Hash, CreditCard } from 'lucide-react';
import { InputField, SelectField, FileUploadField } from './FormComponents';

const StudentPersonalInfo = ({ formData, handleChange, handleStatusChange }) => {

    // --- PHOTO PREVIEW LOGIC (முக்கிய மாற்றம்) ---
    // 1. புதிதாக File தேர்வு செய்யப்பட்டிருந்தால் (New Upload), அதை காட்டவும்.
    // 2. இல்லையென்றால், Database-ல் உள்ள பழைய போட்டோவை (photoUrl) காட்டவும்.
    const previewImage = formData.studentPhoto instanceof File
        ? URL.createObjectURL(formData.studentPhoto)
        : formData.photoUrl;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="text-[#EB8A33]" size={18} /> Personal Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Photo Upload - Left Column */}
                <div className="lg:col-span-1">
                    <FileUploadField
                        label="Student Photo"
                        name="studentPhoto"
                        onChange={handleChange}
                        preview={previewImage} // இங்கே மாற்றப்பட்டுள்ளது
                    />
                </div>

                {/* Form Fields - Right Column */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Index Number"
                        name="indexNumber"
                        value={formData.indexNumber}
                        onChange={handleChange}
                        placeholder="ST-2024-001"
                        icon={Hash}
                        required // Index Number முக்கியம், ஆனால் Edit-ல் ReadOnly ஆக இருக்கும் (Parent Component பார்த்துக்கொள்ளும்)
                    />

                    {/* STATUS FIELD */}
                    <SelectField
                        label="Student Status"
                        name="status"
                        value={formData.status}
                        onChange={handleStatusChange}
                        options={['Active', 'Graduated', 'Suspended', 'Inactive']}
                        required
                    />

                    <InputField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Mohamed"
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Rifkan"
                    />

                    <InputField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        icon={Calendar}
                        required
                    />

                    <SelectField
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={['Male', 'Female']}
                    />

                    <InputField
                        label="NIC Number (Optional)"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="987654321V"
                        icon={CreditCard}
                    />

                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        icon={Mail}
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 77 123 4567"
                        icon={Phone}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentPersonalInfo;