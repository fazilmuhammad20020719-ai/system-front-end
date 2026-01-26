import { BookOpen, GraduationCap, School, MapPin } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentAcademicInfo = ({ formData, handleChange, programs = [] }) => {

    // 1. Program Options for Dropdown (ID as Value, Name as Label)
    // programs prop is expected to be array of { id, name, duration }
    const programOptions = programs.map(p => ({
        value: p.id,
        label: p.name
    }));

    // 2. Find Selected Program Data using ID
    // formData.programId is expected to hold the ID
    const selectedProgram = programs.find(p => String(p.id) === String(formData.programId));

    // 3. Grade Options Logic (Status-ஐப் பொறுத்து மாறுதல்)
    let yearOptions = [];
    let isGradeDisabled = false;

    // Active ஆக இல்லையென்றால் (எ.கா: Graduated), Grade Dropdown-ஐ நிறுத்தவும்
    if (formData.status && formData.status !== 'Active') {
        yearOptions = [formData.status]; // Dropdown-ல் Status மட்டுமே தெரியும்
        isGradeDisabled = true; // Dropdown வேலை செய்யாது (Disabled)
    } else {
        // Active என்றால், Program Duration படி Grades வரும்
        if (selectedProgram) {
            const durationNum = parseInt(selectedProgram.duration) || 5;
            yearOptions = Array.from({ length: durationNum }, (_, i) => `Grade ${i + 1}`);
        } else {
            yearOptions = ['Select Program First'];
        }
    }

    // Generate Batch years (2026 to 2002)
    const sessionYears = Array.from({ length: 25 }, (_, i) => 2026 - i);

    return (
        <div className="space-y-6">

            {/* Current Admission Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="text-[#EB8A33]" size={18} /> Academic Admission
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Program */}
                    <SelectField
                        label="Admission Program"
                        name="programId" // Changed from 'program' to 'programId'
                        value={formData.programId || ''}
                        onChange={handleChange}
                        options={programOptions.length > 0 ? programOptions : [{ value: '', label: 'Loading...' }]}
                        required
                    />

                    {/* Session */}
                    <SelectField
                        label="Session / Batch Year"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        options={sessionYears}
                        required
                    />

                    {/* STATUS SELECT இங்கே இல்லை - Personal Info-ல் உள்ளது */}

                    {/* Dynamic Grade Field (Status-ஐப் பொறுத்து மாறும்) */}
                    <SelectField
                        label="Current Grade / Year"
                        name="currentYear"
                        // Active இல்லையென்றால் Status-ஐயே Value-ஆகக் காட்டும்
                        value={formData.status !== 'Active' ? formData.status : formData.currentYear}
                        onChange={handleChange}
                        options={yearOptions}
                        disabled={isGradeDisabled} // Lock if not Active
                        required
                    />
                </div>
            </div>

            {/* Previous Education History (UI அப்படியே உள்ளது) */}
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