import { Users, Phone, Briefcase } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentGuardianInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Users className="text-[#EB8A33]" size={18} /> Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                </div>
                <SelectField label="Relationship" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} options={['Father', 'Mother', 'Brother', 'Uncle', 'Other']} />
                <InputField label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} icon={Briefcase} />
                <div className="lg:col-span-1">
                    <InputField label="Phone Number" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} icon={Phone} />
                </div>
            </div>
        </div>
    );
};

export default StudentGuardianInfo;
