import { useState } from 'react';
import { FileText, Download, Printer, Eye, FilePenLine } from 'lucide-react';

const TeacherDocuments = ({ documents }) => {
    // Local state to allow rename for demo purposes
    const [docs, setDocs] = useState(documents);

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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-50 text-[#EB8A33] p-2 rounded"><FileText size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-orange-600" title="View"><Eye size={18} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-blue-600" title="Print"><Printer size={18} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-green-600" title="Download"><Download size={18} /></button>
                            <button onClick={() => handleRename(i)} className="p-1.5 text-gray-400 hover:text-gray-800" title="Rename"><FilePenLine size={18} /></button>
                        </div>
                    </div>
                ))}

                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-gray-400 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <PlusIcon size={24} className="mb-2" />
                    <span className="text-xs font-bold">Upload New Document</span>
                </div>
            </div>
        </div>
    );
};

// Helper SVG Icon
const PlusIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default TeacherDocuments;