import { BookOpen, GraduationCap, School, MapPin, Plus, Trash2 } from 'lucide-react';
import { InputField, SelectField } from './FormComponents';

const StudentAcademicInfo = ({ formData, handleChange, programs = [], setFormData }) => {

    // Safety check for programs
    const safePrograms = programs || [];

    const programOptions = safePrograms.map(p => ({
        value: p.id,
        label: p.name
    }));

    const sessionYears = Array.from({ length: 25 }, (_, i) => 2026 - i);

    // Safety check for enrollments: Default to [] if missing to avoid crash
    const enrollments = formData?.enrollments || [];

    // --- Enrollment Handlers ---
    const handleEnrollmentChange = (index, name, value) => {
        const currentEnrollments = formData.enrollments || [];
        if (index >= currentEnrollments.length) return; // Should not happen

        const updatedEnrollments = [...currentEnrollments];
        updatedEnrollments[index] = { ...updatedEnrollments[index], [name]: value };
        setFormData(prev => ({ ...prev, enrollments: updatedEnrollments }));
    };

    const addEnrollment = () => {
        setFormData(prev => ({
            ...prev,
            enrollments: [
                ...(prev.enrollments || []), // Safety check
                { programId: '', session: '2025', currentYear: '', status: 'Active', admissionDate: '' }
            ]
        }));
    };

    const removeEnrollment = (index) => {
        if (formData.enrollments.length === 1) return; // Prevent removing the last one
        setFormData(prev => ({
            ...prev,
            enrollments: prev.enrollments.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-6">

            {/* --- ADMISSION DETAILS (Multi-Row) --- */}
            {enrollments.map((enrollment, index) => {
                // Determine options dynamically for this specific enrollment
                const selectedProgram = programs.find(p => String(p.id) === String(enrollment.programId));
                let yearOptions = [];
                let isGradeDisabled = false;

                if (enrollment.status && enrollment.status !== 'Active') {
                    yearOptions = [enrollment.status];
                    isGradeDisabled = true;
                } else {
                    if (selectedProgram) {
                        const durationNum = parseInt(selectedProgram.duration) || 5;
                        yearOptions = Array.from({ length: durationNum }, (_, i) => `Grade ${i + 1}`);
                    } else {
                        yearOptions = ['Select Program First'];
                    }
                }

                return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
                            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen className="text-[#EB8A33]" size={18} />
                                {index === 0 ? "Academic Admission (Primary)" : `Program #${index + 1}`}
                            </h3>
                            {formData.enrollments.length > 1 && (
                                <button
                                    onClick={() => removeEnrollment(index)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                    title="Remove Program"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Program */}
                            <SelectField
                                label="Admission Program"
                                name="programId"
                                value={enrollment.programId || ''}
                                onChange={(e) => handleEnrollmentChange(index, "programId", e.target.value)}
                                options={programOptions.length > 0 ? programOptions : [{ value: '', label: 'Loading...' }]}
                                required
                            />

                            {/* Session */}
                            <SelectField
                                label="Session / Batch Year"
                                name="session"
                                value={enrollment.session}
                                onChange={(e) => handleEnrollmentChange(index, "session", e.target.value)}
                                options={sessionYears}
                                required
                            />

                            {/* Admission Date */}
                            <InputField
                                label="Admission Date"
                                name="admissionDate"
                                type="date"
                                value={enrollment.admissionDate}
                                onChange={(e) => handleEnrollmentChange(index, "admissionDate", e.target.value)}
                                required
                            />

                            {/* Dynamic Grade Field */}
                            <SelectField
                                label="Current Grade / Year"
                                name="currentYear"
                                value={enrollment.status !== 'Active' ? enrollment.status : enrollment.currentYear}
                                onChange={(e) => handleEnrollmentChange(index, "currentYear", e.target.value)}
                                options={yearOptions}
                                disabled={isGradeDisabled}
                                required
                            />

                            {/* Status Explicitly Here for Enrollments? Or assume Active? 
                                 Ideally we should allow setting status per enrollment. 
                                 Let's add it if space permits, or assume inherited from top? 
                                 Actually AddStudent has 'status' in top level state, but multi-program implies per-program status.
                                 Let's add a Status selector.
                             */}
                            <SelectField
                                label="Status"
                                name="status"
                                value={enrollment.status}
                                onChange={(e) => handleEnrollmentChange(index, "status", e.target.value)}
                                options={['Active', 'Graduated', 'Dropped', 'Suspended']}
                                required
                            />

                        </div>
                    </div>
                );
            })}

            {/* Add Program Button */}
            <div className="flex justify-end">
                <button
                    onClick={addEnrollment}
                    type="button" // Important preventing submit
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm transition-colors"
                >
                    <Plus size={16} /> Add Another Program
                </button>
            </div>


            {/* Previous Education History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-8">
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