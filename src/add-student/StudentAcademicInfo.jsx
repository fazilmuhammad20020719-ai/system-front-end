import { BookOpen, GraduationCap } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentAcademicInfo = ({ formData, handleChange }) => {
    const years = Array.from({ length: 25 }, (_, i) => 2026 - i);

    return (
        <div className="space-y-4">
            {/* Current Admission */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="text-[#EB8A33]" size={18} /> Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="Program" name="program" value={formData.program} onChange={handleChange} options={['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)']} />
                    <SelectField label="Session / Batch" name="session" value={formData.session} onChange={handleChange} options={years} />
                    <InputField label="Admission No (System)" name="admissionNo" value="Auto-Generated" disabled />
                </div>
            </div>

            {/* Previous School */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <GraduationCap className="text-[#EB8A33]" size={18} /> Previous Education
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <InputField label="Previous School" name="previousSchoolName" value={formData.previousSchoolName} onChange={handleChange} />
                    </div>
                    <InputField label="Last Grade" name="lastStudiedGrade" value={formData.lastStudiedGrade} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <InputField label="Previous College/Madrasa" name="previousCollegeName" value={formData.previousCollegeName} onChange={handleChange} />
                    </div>
                    <SelectField label="Medium" name="mediumOfStudy" value={formData.mediumOfStudy} onChange={handleChange} options={['Tamil', 'Arabic', 'English', 'Sinhala']} />
                </div>
            </div>
        </div>
    );
};

export default StudentAcademicInfo;
