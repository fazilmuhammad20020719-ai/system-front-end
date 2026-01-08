import { MapPin, Map, Navigation, X } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';
import { useState } from 'react';

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

const StudentLocationInfo = ({ formData, handleChange, setFormData }) => {
    const [showMapModal, setShowMapModal] = useState(false);

    const handleMapSave = (link, lat, lng) => {
        setFormData(prev => ({
            ...prev,
            googleMapLink: link,
            latitude: lat,
            longitude: lng
        }));
        setShowMapModal(false);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MapPin className="text-[#EB8A33]" size={18} /> Address & Location
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

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <InputField label="Home Address" name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                </div>
            </div>

            {/* Compact Map Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#EB8A33]">
                        <Map size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">Google Map Location</h4>
                        <p className="text-xs text-gray-500">
                            {formData.googleMapLink ? "Location Saved ✅" : "Pin the student's home on the map"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors flex items-center gap-2"
                    >
                        <MapPin size={14} /> {formData.googleMapLink ? 'Edit Location' : 'Add Location'}
                    </button>
                    {formData.googleMapLink && (
                        <a href={formData.googleMapLink} target="_blank" rel="noreferrer" className="px-4 py-2 border border-[#EB8A33] text-[#EB8A33] text-xs font-bold rounded-lg hover:bg-orange-50 flex items-center gap-2">
                            <Navigation size={14} /> View Map
                        </a>
                    )}
                </div>
            </div>

            {/* Inline Map Modal */}
            {showMapModal && <MapModal onClose={() => setShowMapModal(false)} onSave={handleMapSave} data={formData} />}
        </div>
    );
};

const MapModal = ({ onClose, onSave, data }) => {
    const [link, setLink] = useState(data.googleMapLink || '');
    const [lat, setLat] = useState(data.latitude || '');
    const [lng, setLng] = useState(data.longitude || '');

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm"><MapPin size={16} /> Set Home Location</h3>
                    <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                <div className="p-5 space-y-4">
                    <InputField label="Google Map Link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste link here..." />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="6.9271" />
                        <InputField label="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="79.8612" />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-bold text-xs hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={() => onSave(link, lat, lng)} className="px-4 py-2 bg-[#EB8A33] text-white font-bold text-xs hover:bg-[#d67b28] rounded-lg">Save</button>
                </div>
            </div>
        </div>
    );
}

export default StudentLocationInfo;