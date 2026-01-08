import { User, Calendar, Phone, MapPin, Mail, Map } from 'lucide-react';
import { InputField, UsersIcon } from './FormComponents';

// SRI LANKA DATA (Ideally moved to a shared utils file)
const SRI_LANKA_LOCATIONS = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

const EditProfileInfo = ({ formData, handleChange, setFormData }) => {

    // Helper to change province and reset district
    const handleProvinceChange = (e) => {
        setFormData(prev => ({
            ...prev,
            province: e.target.value,
            district: '' // Reset district
        }));
    };

    const districts = formData.province ? (SRI_LANKA_LOCATIONS[formData.province] || []) : [];

    return (
        <div className="space-y-6">

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-[#EB8A33]" size={20} /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />

                    {/* Date of Birth with Calendar Icon */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none" />
                        </div>
                    </div>

                    <InputField label="NIC" name="nic" value={formData.nic} onChange={handleChange} />
                    <InputField label="Phone" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
                </div>
            </div>

            {/* Location & Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="text-[#EB8A33]" size={20} /> Location Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Province</label>
                        <select name="province" value={formData.province} onChange={handleProvinceChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] outline-none">
                            <option value="">Select Province</option>
                            {Object.keys(SRI_LANKA_LOCATIONS).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">District</label>
                        <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.province} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] outline-none disabled:opacity-50">
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <InputField label="Address" name="address" icon={MapPin} value={formData.address} onChange={handleChange} />

                {/* Map Link Display */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Map size={16} />
                            <span>Map Link: <span className="text-blue-600 truncate max-w-[200px] inline-block align-bottom">{formData.googleMapLink || 'Not set'}</span></span>
                        </div>
                        {formData.googleMapLink && (
                            <a href={formData.googleMapLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#EB8A33] border border-[#EB8A33] px-3 py-1 rounded hover:bg-orange-50">Show Map</a>
                        )}
                    </div>
                </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UsersIcon className="text-[#EB8A33]" size={20} /> Guardian Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                    <InputField label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} />
                    <InputField label="Relationship" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} />
                    <InputField label="Phone" name="guardianPhone" icon={Phone} value={formData.guardianPhone} onChange={handleChange} />
                </div>
            </div>
        </div>
    );
};

export default EditProfileInfo;