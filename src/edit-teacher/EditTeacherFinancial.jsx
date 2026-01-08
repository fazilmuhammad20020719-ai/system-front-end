import { DollarSign, FileText } from 'lucide-react';
import { InputField, UploadField } from './TeacherFormComponents';

const EditTeacherFinancial = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">

            {/* Salary Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign className="text-[#EB8A33]" size={20} />
                    Financial Info
                </h3>
                <div className="space-y-4">
                    <InputField label="Basic Salary" name="salary" placeholder="0.00" value={formData.salary} onChange={handleChange} />
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-700">
                        <strong>Note:</strong> Salary information is confidential and only visible to authorized admins.
                    </div>
                </div>
            </div>

            {/* Document Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-[#EB8A33]" size={20} />
                    Documents
                </h3>
                <div className="space-y-3">
                    <UploadField label="Curriculum Vitae (CV)" />
                    <UploadField label="Educational Certificates" />
                    <UploadField label="National ID Copy" />
                    <UploadField label="Appointment Letter" />
                </div>
            </div>

        </div>
    );
};

export default EditTeacherFinancial;
