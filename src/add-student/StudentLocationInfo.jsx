import { MapPin } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

// UPDATED LIST (District + Province)
const SRI_LANKA_DISTRICTS = [
    "Colombo (Western Province)",
    "Gampaha (Western Province)",
    "Kalutara (Western Province)",
    "Kandy (Central Province)",
    "Matale (Central Province)",
    "Nuwara Eliya (Central Province)",
    "Galle (Southern Province)",
    "Matara (Southern Province)",
    "Hambantota (Southern Province)",
    "Jaffna (Northern Province)",
    "Kilinochchi (Northern Province)",
    "Mannar (Northern Province)",
    "Vavuniya (Northern Province)",
    "Mullaitivu (Northern Province)",
    "Batticaloa (Eastern Province)",
    "Ampara (Eastern Province)",
    "Trincomalee (Eastern Province)",
    "Kurunegala (North Western Province)",
    "Puttalam (North Western Province)",
    "Anuradhapura (North Central Province)",
    "Polonnaruwa (North Central Province)",
    "Badulla (Uva Province)",
    "Moneragala (Uva Province)",
    "Ratnapura (Sabaragamuwa Province)",
    "Kegalle (Sabaragamuwa Province)"
];

const StudentLocationInfo = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MapPin className="text-green-600" size={18} /> Address & Location
                </h3>

                {/* Updated Grid - Removed Province Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                        <SelectField
                            label="District / Region"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            options={SRI_LANKA_DISTRICTS}
                            placeholder="Select District"
                        />
                    </div>
                    <InputField label="DS Division" name="dsDivision" value={formData.dsDivision} onChange={handleChange} />
                    <InputField label="GN Division" name="gnDivision" value={formData.gnDivision} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Home Address" name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                    <InputField label="Google Map Link" name="googleMapLink" value={formData.googleMapLink} onChange={handleChange} icon={MapPin} placeholder="https://maps.google.com/..." />
                </div>
            </div>

        </div>
    );
};

export default StudentLocationInfo;