import { Briefcase, GraduationCap, Building } from 'lucide-react';
import { InputField, SelectField, TextAreaField } from '../add-student/FormComponents';

const TeacherProfessionalInfo = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            {/* Education Details from Form */}
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
                    <SelectField label="Teaching Category" name="teachingCategory" value={formData.teachingCategory} onChange={handleChange} options={['Sharia', 'Academic/School', 'Both']} />
                    <SelectField label="Appointment Type" name="appointmentType" value={formData.appointmentType} onChange={handleChange} options={['Full Time', 'Part Time', 'Visiting']} />

                    <InputField label="Employee ID" name="employeeId" placeholder="EMP-001" value={formData.employeeId} onChange={handleChange} />
                    <InputField label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
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
