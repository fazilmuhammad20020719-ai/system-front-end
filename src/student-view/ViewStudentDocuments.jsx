import { useState } from 'react';
import { FileText, Download, Printer, Eye, FilePenLine, Plus } from 'lucide-react';
import UploadModal from '../documents/UploadModal';

const ViewStudentDocuments = ({ documents }) => {
    const [docs, setDocs] = useState(documents);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleRename = (index) => {
        const currentName = docs[index].name;
        const newName = window.prompt("Rename file:", currentName);
        if (newName && newName !== currentName) {
            const updatedDocs = [...docs];
            updatedDocs[index] = { ...updatedDocs[index], name: newName };
            setDocs(updatedDocs);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-green-600" size={20} /> Attached Documents
                    </h3>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EB8A33] hover:bg-[#d67b28] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Add Document
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docs.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(doc.path, '_blank')}
                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                    title="View"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => window.open(doc.path, '_blank')} // Printing triggers browser print usually
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Print"
                                >
                                    <Printer size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = doc.path;
                                        link.download = doc.name;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                    title="Download"
                                >
                                    <Download size={16} />
                                </button>
                                <button onClick={() => handleRename(index)} className="text-gray-400 hover:text-gray-800 transition-colors" title="Rename">
                                    <FilePenLine size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Modal Integration */}
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </>
    );
};

export default ViewStudentDocuments;