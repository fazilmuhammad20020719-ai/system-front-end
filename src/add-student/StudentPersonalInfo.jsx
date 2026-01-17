import { User, Calendar, Phone, Mail } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentPersonalInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="text-green-600" size={18} /> Personal Information
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo Upload - Compact Sidebar Style */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group hover:border-green-600 transition-colors">
                        {formData.studentPhoto ? (
                            <img src={URL.createObjectURL(formData.studentPhoto)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-2">
                                <User className="mx-auto text-gray-300 mb-1" size={30} />
                                <span className="text-[10px] text-gray-400 font-medium">Upload Photo</span>
                            </div>
                        )}
                        <input type="file" name="studentPhoto" onChange={handleChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* Form Fields - 3 Columns Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputField label="Index Number" name="indexNumber" placeholder="ST-2025-001" value={formData.indexNumber} onChange={handleChange} required />
                    <InputField label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} icon={Calendar} />
                    <InputField label="NIC / B-Form" name="nic" value={formData.nic} onChange={handleChange} />

                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} />

                    <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={Calendar} />
                    <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} />
                    <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} icon={Phone} />

                    <SelectField
                        label="Student Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={['Active', 'Inactive', 'Graduated', 'Suspended']}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentPersonalInfo;
