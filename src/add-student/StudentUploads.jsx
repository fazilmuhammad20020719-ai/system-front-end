import { UploadCloud, FileText } from 'lucide-react';
import { FileUploadCard } from './FormComponents';

const StudentUploads = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <UploadCloud className="text-[#EB8A33]" size={18} /> Documents & Proofs
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Existing Uploads */}
                <FileUploadCard label="NIC Front" name="nicFront" file={formData.nicFront} onChange={handleChange} height="h-24" />
                <FileUploadCard label="NIC Back" name="nicBack" file={formData.nicBack} onChange={handleChange} height="h-24" />
                <FileUploadCard label="Signature" name="studentSignature" file={formData.studentSignature} onChange={handleChange} height="h-24" />
                <FileUploadCard label="Birth Cert." name="birthCertificate" file={formData.birthCertificate} onChange={handleChange} height="h-24" />

                {/* New Uploads */}
                <FileUploadCard label="Medical Report" name="medicalReport" file={formData.medicalReport} onChange={handleChange} height="h-24" />
                <FileUploadCard label="Guardian NIC" name="guardianNic" file={formData.guardianNic} onChange={handleChange} height="h-24" />
                <FileUploadCard label="Guardian Photo" name="guardianPhoto" file={formData.guardianPhoto} onChange={handleChange} height="h-24" />
                <FileUploadCard label="Leaving Cert." name="leavingCertificate" file={formData.leavingCertificate} onChange={handleChange} height="h-24" />
            </div>
        </div>
    );
};

export default StudentUploads;