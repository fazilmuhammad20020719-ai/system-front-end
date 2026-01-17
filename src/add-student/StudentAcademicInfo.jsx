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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <SelectField
                        label="Current Grade / Year"
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleChange}
                        options={['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8']}
                        required
                    />
                </div>
            </div>

            {/* Previous Education History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <GraduationCap className="text-[#EB8A33]" size={18} /> Previous Education
                </h3>

                {/* --- 1. Previous School Section --- */}
                <div className="mb-6 border-b border-gray-50 pb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                        Previous School Details
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField
                            label="School Name"
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
                </div>

                {/* --- 2. Previous Madrasa Section --- */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                        Previous Madrasa Details
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Madrasa Name"
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
                        <SelectField
                            label="Medium of Study"
                            name="mediumOfStudy"
                            value={formData.mediumOfStudy}
                            onChange={handleChange}
                            options={['Tamil', 'Arabic', 'English', 'Sinhala']}
                        />
                        <InputField
                            label="Reason for Leaving Madrasa"
                            name="reasonForLeavingMadrasa"
                            value={formData.reasonForLeavingMadrasa || ''}
                            onChange={handleChange}
                            placeholder="e.g. Completed Hifz"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentAcademicInfo;