import { FileText, UploadCloud } from 'lucide-react';

const TeacherUploads = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="text-[#EB8A33]" size={18} /> Documents Upload
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadBox label="Curriculum Vitae (CV)" name="cvFile" onChange={handleChange} />
                <UploadBox label="Educational Certificates" name="certificates" onChange={handleChange} />
                <UploadBox label="NIC Copy (Front/Back)" name="nicCopy" onChange={handleChange} />
            </div>
        </div>
    );
};

const UploadBox = ({ label, name, onChange }) => (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative">
        <input type="file" name={name} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#EB8A33]">
                <UploadCloud size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">PDF or JPG (Max 5MB)</p>
            </div>
        </div>
    </div>
);

export default TeacherUploads;
