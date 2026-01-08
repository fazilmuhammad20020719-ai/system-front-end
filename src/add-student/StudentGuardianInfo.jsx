import { Users, Phone, Briefcase, Mail, User } from 'lucide-react'; // Added User, Mail icons
import { InputField, SelectField } from './FormComponents';

const StudentGuardianInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Users className="text-[#EB8A33]" size={18} /> Guardian Information
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Guardian Photo Upload */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group hover:border-[#EB8A33] transition-colors">
                        {formData.guardianPhoto ? (
                            <img src={URL.createObjectURL(formData.guardianPhoto)} alt="Guardian" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-2">
                                <User className="mx-auto text-gray-300 mb-1" size={30} />
                                <span className="text-[10px] text-gray-400 font-medium">Guardian Photo</span>
                            </div>
                        )}
                        <input type="file" name="guardianPhoto" onChange={handleChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                    </div>

                    <SelectField
                        label="Relationship"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleChange}
                        options={['Father', 'Mother', 'Brother', 'Uncle', 'Other']}
                    />

                    <InputField label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} icon={Briefcase} />
                    <InputField label="Phone Number" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} icon={Phone} />
                    <InputField label="Guardian Email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} icon={Mail} />
                </div>
            </div>
        </div>
    );
};

export default StudentGuardianInfo;