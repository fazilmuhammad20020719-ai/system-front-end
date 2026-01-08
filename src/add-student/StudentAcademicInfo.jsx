import { BookOpen, GraduationCap, School, MapPin } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentAcademicInfo = ({ formData, handleChange }) => {
    // Generate years dynamically (2026 down to 2002)
    const years = Array.from({ length: 25 }, (_, i) => 2026 - i);

    return (
        <div className="space-y-6">

            {/* Current Admission Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="text-[#EB8A33]" size={18} /> Academic Admission
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                        label="Admission Program"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        options={['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)']}
                        required
                    />
                    <SelectField
                        label="Session / Batch Year"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        options={years}
                        required
                    />
                </div>
            </div>

            {/* Previous Education History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <GraduationCap className="text-[#EB8A33]" size={18} /> Previous Education
                </h3>

                {/* --- School Details --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                        label="Previous School Name"
                        name="previousSchoolName"
                        value={formData.previousSchoolName}
                        onChange={handleChange}
                        icon={School}
                    />
                    <InputField
                        label="School Location"
                        name="previousSchoolLocation"
                        value={formData.previousSchoolLocation || ''}
                        onChange={handleChange}
                        placeholder="City / Town"
                        icon={MapPin}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <InputField
                        label="Last Grade / Class"
                        name="lastStudiedGrade"
                        value={formData.lastStudiedGrade}
                        onChange={handleChange}
                        placeholder="e.g. Grade 5"
                    />
                    <InputField
                        label="Reason for Leaving School"
                        name="reasonForLeaving"
                        value={formData.reasonForLeaving || ''}
                        onChange={handleChange}
                        placeholder="e.g. Transfer"
                    />
                </div>

                {/* --- Madrasa / Religious Education Details --- */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                        Religious Education History
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Previous Madrasa Name"
                            name="previousCollegeName"
                            value={formData.previousCollegeName}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Madrasa Location"
                            name="previousCollegeLocation"
                            value={formData.previousCollegeLocation || ''}
                            onChange={handleChange}
                            placeholder="City / Town"
                            icon={MapPin}
                        />
                        <div className="md:col-span-2">
                            <SelectField
                                label="Medium of Study"
                                name="mediumOfStudy"
                                value={formData.mediumOfStudy}
                                onChange={handleChange}
                                options={['Tamil', 'Arabic', 'English', 'Sinhala']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAcademicInfo;