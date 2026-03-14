import { Users, Phone, Briefcase, Mail, User } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';
import { ProfilePhotoUpload } from '../components/ProfilePhotoUpload';

const StudentGuardianInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Users className="text-[#EB8A33]" size={18} /> Guardian Information
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Guardian Photo Upload */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <ProfilePhotoUpload
                        name="guardianPhoto"
                        onChange={handleChange}
                        preview={
                            formData.guardianPhoto instanceof File 
                                ? URL.createObjectURL(formData.guardianPhoto) 
                                : formData.guardianPhotoUrl
                        }
                    />
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        {/* Guardian Name — required for emergency contact */}
                        <InputField
                            label="Guardian Name"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleChange}
                            icon={User}
                            required
                        />
                    </div>

                    {/* Guardian Relation — required */}
                    <SelectField
                        label="Relationship"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleChange}
                        options={['Father', 'Mother', 'Brother', 'Uncle', 'Other']}
                        required
                    />

                    <InputField label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} icon={Briefcase} />

                    {/* Guardian Phone — required, 10 digits */}
                    <InputField
                        label="Phone Number"
                        name="guardianPhone"
                        type="tel"
                        value={formData.guardianPhone}
                        onChange={handleChange}
                        icon={Phone}
                        required
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        title="Guardian phone must be exactly 10 digits"
                    />

                    <InputField label="Guardian Email" name="guardianEmail" type="email" value={formData.guardianEmail} onChange={handleChange} icon={Mail} />
                </div>
            </div>
        </div>
    );
};

export default StudentGuardianInfo;