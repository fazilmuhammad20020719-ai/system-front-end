import { UploadCloud } from 'lucide-react';

const UploadModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                <h3 className="text-lg font-bold mb-4">Upload File</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-[#ea8933] cursor-pointer">
                    <UploadCloud size={40} className="mb-2" />
                    <p className="font-medium">Click to Browse</p>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600">Cancel</button>
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold">Upload</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
