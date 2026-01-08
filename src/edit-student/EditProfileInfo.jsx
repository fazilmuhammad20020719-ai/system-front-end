import { User, Calendar, Phone, MapPin, Mail } from 'lucide-react';
import { InputField, UsersIcon } from './FormComponents';

const EditProfileInfo = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">

            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-[#EB8A33]" size={20} />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <InputField label="NIC / B-Form No" name="nic" value={formData.nic} onChange={handleChange} />
                    <InputField label="Contact Number" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
                </div>
                <div className="mt-6">
                    <InputField label="Residential Address" name="address" icon={MapPin} value={formData.address} onChange={handleChange} />
                </div>
            </div>

            {/* Guardian Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UsersIcon className="text-[#EB8A33]" size={20} />
                    Guardian Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Relationship</label>
                        <select
                            name="guardianRelation"
                            value={formData.guardianRelation}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>Father</option>
                            <option>Mother</option>
                            <option>Brother</option>
                            <option>Uncle</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <InputField label="Guardian Phone" name="guardianPhone" icon={Phone} value={formData.guardianPhone} onChange={handleChange} />
                    <InputField label="Guardian Email" name="email" icon={Mail} value={formData.email} onChange={handleChange} />
                </div>
            </div>
        </div>
    );
};

export default EditProfileInfo;
