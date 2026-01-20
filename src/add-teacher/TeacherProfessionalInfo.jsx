import { useEffect, useState } from 'react';
import { Briefcase, GraduationCap, Building, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { InputField, SelectField, TextAreaField } from '../add-student/FormComponents';

const TeacherProfessionalInfo = ({ formData, handleChange, programs = [], subjects = [] }) => {

    // Checkbox-களுக்கான State
    const [selectedPrograms, setSelectedPrograms] = useState([]);

    // --- FIX: டேட்டா வந்ததும், அதை Array-ஆக மாற்றி State-ல் வைப்பது ---
    useEffect(() => {
        if (formData.assignedPrograms) {
            // String-ஆக இருந்தால் (,) வைத்துப் பிரிக்கவும்
            if (typeof formData.assignedPrograms === 'string') {
                const loadedPrograms = formData.assignedPrograms.split(',').map(item => item.trim());
                setSelectedPrograms(loadedPrograms);
            }
            // ஏற்கனவே Array-ஆக இருந்தால் அப்படியே பயன்படுத்தவும்
            else if (Array.isArray(formData.assignedPrograms)) {
                setSelectedPrograms(formData.assignedPrograms);
            }
        } else {
            setSelectedPrograms([]);
        }
    }, [formData.assignedPrograms]);

    // --- MERGE HARDCODED PROGRAMS ---
    // Ensure "Al Muballihah" is available for Sharia
    const processedPrograms = [...programs];
    if (!processedPrograms.some(p => p.name === 'Al Muballihah')) {
        processedPrograms.push({ id: 'auto-muballihah', name: 'Al Muballihah', category: 'Sharia' });
    }

    // --- 1. FILTERING LOGIC ---
    // டீச்சர் வகையைப் பொறுத்து ப்ரோக்ராம்களை வடிகட்டுதல்
    const filteredPrograms = processedPrograms.filter(prog => {
        // 'Both' அல்லது எதுவுமே தேர்ந்தெடுக்கப்படவில்லை என்றால் எல்லாவற்றையும் காட்டு
        if (!formData.teacherCategory || formData.teacherCategory === 'Both') return true;

        // இல்லையென்றால், அந்த வகையை மட்டும் காட்டு (Sharia or Academic) + Both இருப்பவற்றையும் காட்டு
        // Match 'School' selection to 'Academic' programs
        const targetCategory = formData.teacherCategory === 'School' ? 'Academic' : formData.teacherCategory;
        return prog.category === targetCategory || prog.category === 'Both';
    });

    // --- 2. CHECKBOX CHANGE HANDLER ---
    const handleProgramCheckboxChange = (e) => {
        const { value } = e.target; // checked is handled logic below using state

        let newSelection;
        if (selectedPrograms.includes(value)) {
            // ஏற்கனவே இருந்தால் நீக்கு (Uncheck)
            newSelection = selectedPrograms.filter(p => p !== value);
        } else {
            // இல்லையென்றால் சேர் (Check)
            newSelection = [...selectedPrograms, value];
        }

        setSelectedPrograms(newSelection);

        // Parent Component-க்கு அனுப்பவும் (Array -> String)
        handleChange({
            target: {
                name: 'assignedPrograms',
                value: newSelection.join(', ')
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
                        options={['Sharia', 'School', 'Both']}
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
                                            checked={selectedPrograms.includes(prog.name)}
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

                    {/* Status Dropdown */}
                    <SelectField
                        label="Status"
                        name="status"
                        value={formData.status || 'Active'}
                        onChange={handleChange}
                        options={['Active', 'Inactive']}
                    />

                    <div className="md:col-span-2 lg:col-span-3">
                        <TextAreaField label="Previous Experience / Colleges" name="previousExperience" value={formData.previousExperience} onChange={handleChange} rows={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfessionalInfo;
