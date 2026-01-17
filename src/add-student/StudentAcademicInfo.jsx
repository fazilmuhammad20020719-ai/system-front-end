import { BookOpen, GraduationCap, School, MapPin } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentAcademicInfo = ({ formData, handleChange, programs = [] }) => {

    // 1. Program Names மட்டும் பிரித்து Dropdown-க்கு அனுப்புகிறோம்
    const programNames = programs.map(p => p.name);

    // 2. தேர்ந்தெடுக்கப்பட்ட Program-ஐக் கண்டுபிடித்து Duration எடுக்கிறோம்
    const selectedProgram = programs.find(p => p.name === formData.program);

    // 3. Duration-க்கு ஏற்ப Grade லிஸ்ட் தயார் செய்தல்
    let yearOptions = ['Select Program First']; // Default Message

    if (selectedProgram) {
        // "7 Years" -> 7 என மாற்றுகிறது. இல்லையெனில் Default 5.
        const durationNum = parseInt(selectedProgram.duration) || 5;
        yearOptions = Array.from({ length: durationNum }, (_, i) => `Grade ${i + 1}`);
    }

    // Generate years dynamically (2026 down to 2002)
    const sessionYears = Array.from({ length: 25 }, (_, i) => 2026 - i);

    return (
        <div className="space-y-6">

            {/* Current Admission Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="text-[#EB8A33]" size={18} /> Academic Admission
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Program Dropdown (பெயர்கள் மட்டும் வரும்) */}
                    <SelectField
                        label="Admission Program"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        options={programNames.length > 0 ? programNames : ['Loading...']}
                        required
                    />

                    {/* Session Dropdown */}
                    <SelectField
                        label="Session / Batch Year"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        options={sessionYears}
                        required
                    />

                    {/* DYNAMIC GRADE DROPDOWN (இப்போது Program-க்கு ஏற்ப மாறும்!) */}
                    <SelectField
                        label="Current Grade / Year"
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleChange}
                        options={yearOptions} // Dynamic List Here
                        required
                    />
                </div>
            </div>

            {/* Previous Education History (எந்த மாற்றமும் இல்லை) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <GraduationCap className="text-[#EB8A33]" size={18} /> Previous Education
                </h3>

                <div className="mb-6 border-b border-gray-50 pb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                        Previous School Details
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField label="School Name" name="previousSchoolName" value={formData.previousSchoolName} onChange={handleChange} icon={School} />
                        <InputField label="School Location" name="previousSchoolLocation" value={formData.previousSchoolLocation || ''} onChange={handleChange} placeholder="City / Town" icon={MapPin} />
                        <InputField label="Last Grade / Class" name="lastStudiedGrade" value={formData.lastStudiedGrade} onChange={handleChange} placeholder="e.g. Grade 5" />
                        <InputField label="Reason for Leaving School" name="reasonForLeaving" value={formData.reasonForLeaving || ''} onChange={handleChange} placeholder="e.g. Transfer" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                        Previous Madrasa Details
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Madrasa Name" name="previousCollegeName" value={formData.previousCollegeName} onChange={handleChange} />
                        <InputField label="Madrasa Location" name="previousCollegeLocation" value={formData.previousCollegeLocation || ''} onChange={handleChange} placeholder="City / Town" icon={MapPin} />
                        <SelectField label="Medium of Study" name="mediumOfStudy" value={formData.mediumOfStudy} onChange={handleChange} options={['Tamil', 'Arabic', 'English', 'Sinhala']} />
                        <InputField label="Reason for Leaving Madrasa" name="reasonForLeavingMadrasa" value={formData.reasonForLeavingMadrasa || ''} onChange={handleChange} placeholder="e.g. Completed Hifz" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAcademicInfo;