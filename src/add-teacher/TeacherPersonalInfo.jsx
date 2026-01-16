import { User, Calendar, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { InputField, SelectField } from '../add-student/FormComponents'; // Reusing your existing FormComponents

const TeacherPersonalInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="text-green-600" size={18} /> Personal Details
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo Upload Area */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group hover:border-green-600 transition-colors">
                        {formData.profilePhoto ? (
                            <img src={URL.createObjectURL(formData.profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-2">
                                <User className="mx-auto text-gray-300 mb-1" size={30} />
                                <span className="text-[10px] text-gray-400 font-medium">Upload Photo</span>
                            </div>
                        )}
                        <input type="file" name="profilePhoto" onChange={handleChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* Fields Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    <InputField label="NIC Number" name="nic" value={formData.nic} onChange={handleChange} icon={CreditCard} />
                    <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={Calendar} />

                    <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} />
                    <SelectField label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={['Single', 'Married']} />

                    <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={Phone} />
                    <InputField label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} icon={Phone} />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} />

                    <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Postal Address" name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                        <InputField label="Google Map Link" name="mapLink" value={formData.mapLink} onChange={handleChange} icon={MapPin} placeholder="https://maps.google.com/..." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherPersonalInfo;
