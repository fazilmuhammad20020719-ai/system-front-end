import { User, Mail, Phone, Calendar, MapPin, Briefcase, BadgeCheck, GraduationCap } from 'lucide-react';
import { InputField } from './TeacherFormComponents';

const EditTeacherPersonal = ({ formData, handleChange, handleStatusChange }) => {
    return (
        <div className="space-y-6">

            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-[#EB8A33]" size={20} />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="firstName" placeholder="e.g. Sarah" value={formData.firstName} onChange={handleChange} />
                    <InputField label="Last Name" name="lastName" placeholder="e.g. Wilson" value={formData.lastName} onChange={handleChange} />

                    <InputField label="Email Address" name="email" type="email" placeholder="sarah@college.edu" icon={Mail} value={formData.email} onChange={handleChange} />
                    <InputField label="Phone Number" name="phone" placeholder="+94 77 123 4567" icon={Phone} value={formData.phone} onChange={handleChange} />

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <InputField label="NIC Number" name="nic" placeholder="Identity Number" value={formData.nic} onChange={handleChange} />
                </div>
                <div className="mt-6">
                    <InputField label="Residential Address" name="address" placeholder="Full Home Address" icon={MapPin} value={formData.address} onChange={handleChange} />
                </div>
            </div>

            {/* Professional Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="text-[#EB8A33]" size={20} />
                    Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- NEW STATUS BUTTONS --- */}
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Teacher Status
                        </label>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 sm:w-fit">
                            {['Active', 'On Leave', 'Resigned'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${formData.status === status
                                            ? 'bg-white text-gray-800 shadow-sm border border-gray-100 font-bold'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* ------------------------- */}

                    <InputField label="Employee ID" name="employeeId" placeholder="EMP-001" icon={BadgeCheck} value={formData.employeeId} onChange={handleChange} />

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option value="">Select Department</option>
                            <option>Islamic Studies</option>
                            <option>Arabic Language</option>
                            <option>English Unit</option>
                            <option>Information Tech</option>
                            <option>Science</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Designation / Role</label>
                        <select
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                        >
                            <option>Lecturer</option>
                            <option>Senior Lecturer</option>
                            <option>Head of Dept</option>
                            <option>Instructor</option>
                            <option>Visiting Lecturer</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Joining Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <InputField label="Qualification" name="qualification" placeholder="e.g. PhD, MA" icon={GraduationCap} value={formData.qualification} onChange={handleChange} />
                    <InputField label="Experience (Years)" name="experience" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleChange} />

                </div>
            </div>
        </div>
    );
};

export default EditTeacherPersonal;
