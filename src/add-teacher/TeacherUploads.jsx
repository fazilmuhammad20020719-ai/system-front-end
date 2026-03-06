import { UploadCloud, FileText } from 'lucide-react';
import { FileUploadField } from '../add-student/FormComponents';

const TeacherUploads = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <UploadCloud className="text-[#EB8A33]" size={18} /> Documents &amp; Proofs
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <FileUploadField label="CV" name="cvFile" file={formData.cvFile} onChange={handleChange} height="h-24" accept="image/*,application/pdf" />
                <FileUploadField label="Qualification" name="qualification" file={formData.qualification} onChange={handleChange} height="h-24" accept="image/*,application/pdf" />
                <FileUploadField label="Birth Cert." name="birthCertificate" file={formData.birthCertificate} onChange={handleChange} height="h-24" accept="image/*,application/pdf" />
                <FileUploadField label="NIC Front" name="nicFront" file={formData.nicFront} onChange={handleChange} height="h-24" accept="image/*,application/pdf" />
                <FileUploadField label="NIC Back" name="nicBack" file={formData.nicBack} onChange={handleChange} height="h-24" accept="image/*,application/pdf" />
            </div>
        </div>
    );
};

export default TeacherUploads;
