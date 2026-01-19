import { useState, useRef } from 'react';
import { FileText, Download, Printer, Eye, Trash2, Plus, UploadCloud, X, FilePenLine } from 'lucide-react';
import { API_URL } from '../config';
import RenameModal from '../documents/RenameModal';

const TeacherDocuments = ({ documents = [], teacherId, refreshTeacher }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Rename Modal State
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [currentRenameDoc, setCurrentRenameDoc] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    // File Upload Handler
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', file.name); // Optional: Allow renaming before upload

        try {
            setIsUploading(true);
            const response = await fetch(`${API_URL}/api/teachers/${teacherId}/documents`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Success
                refreshTeacher(); // Refresh parent to get new list
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Upload error occurred');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Open Rename Modal
    const openRenameModal = (doc) => {
        setCurrentRenameDoc(doc);
        setRenameValue(doc.name);
        setIsRenameModalOpen(true);
    };

    // Save Rename
    const handleSaveRename = async () => {
        if (!renameValue || !currentRenameDoc || renameValue === currentRenameDoc.name) {
            setIsRenameModalOpen(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/teachers/${teacherId}/documents/${currentRenameDoc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: renameValue }),
            });

            if (response.ok) {
                refreshTeacher();
                setIsRenameModalOpen(false);
            } else {
                alert('Rename failed');
            }
        } catch (error) {
            console.error('Rename Error:', error);
        }
    };

    // Delete Handler
    const handleDelete = async (docId) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        try {
            const response = await fetch(`${API_URL}/api/teachers/${teacherId}/documents/${docId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                refreshTeacher();
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    // Helper: Open Document
    const openDocument = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Uploaded Documents</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-green-50 text-green-600 p-2.5 rounded-lg shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-700 truncate" title={doc.name}>{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openDocument(doc.url)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="View"><Eye size={18} /></button>
                            <a href={doc.url} download target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Download"><Download size={18} /></a>

                            {!doc.isProfileDoc && (
                                <>
                                    <button onClick={() => openRenameModal(doc)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Rename"><FilePenLine size={18} /></button>
                                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {/* Upload Button */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                    ) : (
                        <>
                            <div className="bg-gray-50 text-gray-400 p-3 rounded-full mb-3 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                <UploadCloud size={24} />
                            </div>
                            <span className="text-sm font-bold text-gray-500 group-hover:text-green-700">Click to Upload Document</span>
                            <span className="text-xs text-gray-400 mt-1">PDF, DOC, JPG (Max 5MB)</span>
                        </>
                    )}
                </div>
            </div>

            <RenameModal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                renameValue={renameValue}
                setRenameValue={setRenameValue}
                onSave={handleSaveRename}
            />
        </div>
    );
};

export default TeacherDocuments;