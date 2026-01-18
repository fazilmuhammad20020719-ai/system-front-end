import { Briefcase, GraduationCap, Building, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { InputField, SelectField, TextAreaField } from '../add-student/FormComponents';

const TeacherProfessionalInfo = ({ formData, handleChange, programs = [], subjects = [] }) => {

    // --- 1. FILTERING LOGIC ---
    // டீச்சர் வகையைப் பொறுத்து ப்ரோக்ராம்களை வடிகட்டுதல்
    const filteredPrograms = programs.filter(prog => {
        // 'Both' அல்லது எதுவுமே தேர்ந்தெடுக்கப்படவில்லை என்றால் எல்லாவற்றையும் காட்டு
        if (!formData.teacherCategory || formData.teacherCategory === 'Both') return true;

        // இல்லையென்றால், அந்த வகையை மட்டும் காட்டு (Sharia or Academic)
        return prog.category === formData.teacherCategory;
    });

    // --- 2. CHECKBOX CHANGE HANDLER ---
    const handleProgramCheckboxChange = (e) => {
        const { value, checked } = e.target;

        // ஏற்கனவே உள்ள லிஸ்ட்டை எடுக்கவும் (அல்லது புதிய லிஸ்ட்)
        let currentPrograms = formData.assignedPrograms ? [...formData.assignedPrograms] : [];

        if (checked) {
            // டிக் செய்தால் சேர்க்கவும்
            currentPrograms.push(value);
        } else {
            // டிக் எடுத்தால் நீக்கவும்
            currentPrograms = currentPrograms.filter(item => item !== value);
        }

        // Parent Component-க்கு அனுப்பவும்
        handleChange({
            target: {
                name: 'assignedPrograms',
                value: currentPrograms
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Education Details - (No Change) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <GraduationCap className="text-[#EB8A33]" size={18} /> Educational Qualification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <InputField label="Educational Qualification Details" name="eduQualification" placeholder="Eg: Al-Alim, B.A in Arabic..." value={formData.eduQualification} onChange={handleChange} />
                    </div>
                    <InputField label="Name of Arabic College" name="degreeInstitute" value={formData.degreeInstitute} onChange={handleChange} icon={Building} />
                    <InputField label="Year of Graduation" name="gradYear" type="number" placeholder="20XX" value={formData.gradYear} onChange={handleChange} />
                </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Briefcase className="text-[#EB8A33]" size={18} /> Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Category Selection */}
                    <SelectField
                        label="Teaching Category"
                        name="teacherCategory"
                        value={formData.teacherCategory}
                        onChange={handleChange}
                        options={['Sharia', 'Academic', 'Both']}
                    />

                    {/* --- NEW: CHECKBOXES FOR PROGRAMS --- */}
                    <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Layers size={16} className="text-[#EB8A33]" /> Assigned Programs (Select Multiple)
                        </label>

                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                            {filteredPrograms.length > 0 ? (
                                filteredPrograms.map((prog) => (
                                    <label key={prog.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                                        <input
                                            type="checkbox"
                                            value={prog.name}
                                            checked={formData.assignedPrograms?.includes(prog.name)}
                                            onChange={handleProgramCheckboxChange}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">{prog.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 col-span-2">Select a category to see programs.</p>
                            )}
                        </div>
                    </div>

                    <SelectField label="Appointment Type" name="appointmentType" value={formData.appointmentType} onChange={handleChange} options={['Full Time', 'Part Time', 'Visiting']} />

                    {/* ... Other Fields (Designation, Dept, etc.) ... */}
                    <InputField label="Employee ID" name="employeeId" placeholder="EMP-001" value={formData.employeeId} onChange={handleChange} />
                    <InputField label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                    <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
                    <InputField label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />

                    <div className="md:col-span-2 lg:col-span-3">
                        <TextAreaField label="Previous Experience / Colleges" name="previousExperience" value={formData.previousExperience} onChange={handleChange} rows={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfessionalInfo;
