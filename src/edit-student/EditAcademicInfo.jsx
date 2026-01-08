import { BookOpen, FileText, Activity } from 'lucide-react';
import { InputField, UploadField } from './FormComponents';

const EditAcademicInfo = ({ formData, handleChange, handleStatusChange }) => {
    return (
        <div className="space-y-6">

            {/* Academic Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-[#EB8A33]" size={20} />
                    Academic Info
                </h3>
                <div className="space-y-4">

                    {/* --- STATUS BUTTONS --- */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Student Status
                        </label>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                            {['Active', 'Inactive', 'Graduated'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${formData.status === status
                                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100 font-bold'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Admission Program</label>
                        <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>Hifzul Quran</option>
                            <option>Al-Alim Course</option>
                            <option>Al-Alimah (Girls)</option>
                            <option>Secondary (Gr 8-10)</option>
                            <option>G.C.E. O/L Prep</option>
                            <option>G.C.E. A/L</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Year / Level</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                            <option>5th Year</option>
                            <option>6th Year</option>
                            <option>7th Year</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Session / Batch</label>
                        <select
                            name="session"
                            value={formData.session}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>2025 - 2026</option>
                            <option>2024 - 2025</option>
                        </select>
                    </div>

                    <InputField label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
                </div>
            </div>

            {/* Document Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-[#EB8A33]" size={20} />
                    Existing Documents
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Birth_Certificate.pdf</span>
                        </div>
                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">ID_Card.jpg</span>
                        </div>
                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Upload New Documents</p>
                        <UploadField label="Upload Additional File" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAcademicInfo;
