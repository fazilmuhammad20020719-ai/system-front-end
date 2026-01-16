import React, { useState } from 'react';
import { UploadCloud, FileText, Image, X, Check } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("pdf");
    const [category, setCategory] = useState("general");

    const handleUpload = () => {
        if (!fileName) return; // Simple validation

        onUpload({
            name: fileName,
            type: fileType,
            category: category
        });

        // Reset
        setFileName("");
        setFileType("pdf");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Upload File</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                {/* Simulated File Drop */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 hover:border-[#ea8933] cursor-pointer bg-gray-50 mb-4 transition-colors">
                    <UploadCloud size={32} className="mb-2" />
                    <p className="font-medium text-sm">Click to Browse (Simulated)</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">File Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            placeholder="e.g. Student_List_2024.pdf"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                            <select
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            >
                                <option value="pdf">PDF</option>
                                <option value="doc">Word (DOC)</option>
                                <option value="xls">Excel (XLS)</option>
                                <option value="image">Image (JPG/PNG)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                            >
                                <option value="general">General</option>
                                <option value="students">Students</option>
                                <option value="teachers">Teachers</option>
                                <option value="finance">Finance</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleUpload} className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a] transition-colors flex items-center justify-center gap-2">
                        <Check size={16} /> Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
