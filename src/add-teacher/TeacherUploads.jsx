import { FileText, UploadCloud } from 'lucide-react';

const TeacherUploads = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="text-[#EB8A33]" size={18} /> Documents Upload
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. CV Upload */}
                <UploadBox
                    label="Curriculum Vitae (CV)"
                    name="cvFile"
                    onChange={handleChange}
                    selectedFile={formData.cvFile}
                />

                {/* 2. Qualification Certificate */}
                <UploadBox
                    label="Qualification Certificate"
                    name="qualification"
                    onChange={handleChange}
                    selectedFile={formData.qualification}
                />

                {/* 3. Birth Certificate */}
                <UploadBox
                    label="Birth Certificate"
                    name="birthCertificate"
                    onChange={handleChange}
                    selectedFile={formData.birthCertificate}
                />

                {/* 4. NIC Front Side */}
                <UploadBox
                    label="NIC Copy (Front Side)"
                    name="nicFront"
                    onChange={handleChange}
                    selectedFile={formData.nicFront}
                />

                {/* 5. NIC Back Side */}
                <UploadBox
                    label="NIC Copy (Back Side)"
                    name="nicBack"
                    onChange={handleChange}
                    selectedFile={formData.nicBack}
                />
            </div>
        </div>
    );
};

const UploadBox = ({ label, name, onChange, selectedFile }) => (
    <div className={`border border-dashed rounded-lg p-4 transition-all cursor-pointer group relative ${selectedFile ? 'border-green-500 bg-green-50/50' : 'border-gray-300 hover:bg-gray-50'}`}>
        <input
            type="file"
            name={name}
            onChange={onChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-[#EB8A33]'}`}>
                {selectedFile ? <FileText size={20} /> : <UploadCloud size={20} />}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate">
                    {selectedFile ? selectedFile.name || "File Selected" : label}
                </p>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">
                        {selectedFile ? (
                            <span className="text-green-600 font-medium">Ready to upload</span>
                        ) : 'PDF or JPG (Max 5MB)'}
                    </p>
                    {selectedFile && <span className="text-[10px] text-green-600 font-bold">100%</span>}
                </div>

                {/* Loader Line */}
                {selectedFile && (
                    <div className="w-full h-1.5 bg-green-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-green-500 w-full animate-pulse rounded-full" />
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default TeacherUploads;
