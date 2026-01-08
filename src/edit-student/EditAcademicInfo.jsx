import { BookOpen, FileText, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { InputField, UploadField } from './FormComponents';

const EditAcademicInfo = ({ formData, handleChange, handleStatusChange }) => {
    return (
        <div className="space-y-6">

            {/* Academic Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-[#EB8A33]" size={20} /> Academic Info
                </h3>
                <div className="space-y-4">
                    {/* Status Buttons */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Student Status</label>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                            {['Active', 'Inactive', 'Graduated'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${formData.status === status ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Program</label>
                        <select name="program" value={formData.program} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] outline-none">
                            <option>Hifzul Quran</option>
                            <option>Al-Alim (Boys)</option>
                            <option>Al-Alimah (Girls)</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Session / Batch</label>
                        <select name="session" value={formData.session} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] outline-none">
                            {Array.from({ length: 25 }, (_, i) => 2026 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Updated Documents Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-[#EB8A33]" size={20} /> Documents
                </h3>

                {/* NIC Front/Back Placeholders for Edit Mode */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1">NIC Front</span>
                    </div>
                    <div className="h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1">NIC Back</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Birth_Cert.pdf</span>
                        </div>
                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Upload New</p>
                        <UploadField label="Upload Additional File" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAcademicInfo;