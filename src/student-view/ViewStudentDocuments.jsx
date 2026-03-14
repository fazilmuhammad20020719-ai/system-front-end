import { useState, useRef, useEffect } from 'react';
import { FileText, Download, Eye, Trash2, Plus, FilePenLine, MoreVertical } from 'lucide-react';
import { API_URL } from '../config';
import RenameModal from '../documents/RenameModal';

const ViewStudentDocuments = ({ documents: staticDocs = [], studentId }) => {
    const [dynamicDocs, setDynamicDocs] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Combine static and dynamic
    const allDocs = [
        ...staticDocs.map(d => ({ ...d, isStatic: true })),
        ...dynamicDocs
    ];

    // Rename Modal State
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [currentRenameDoc, setCurrentRenameDoc] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    // Dropdown State
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Fetch Documents
    const fetchDocuments = async () => {
        if (!studentId) return;
        try {
            const response = await fetch(`${API_URL}/api/students/${studentId}/documents`);
            if (response.ok) {
                const data = await response.json();
                setDynamicDocs(data.map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    url: `${API_URL}${doc.file_url}`,
                    date: new Date(doc.created_at).toLocaleDateString(),
                    size: doc.file_size,
                    isStatic: false
                })));
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        if (studentId) {
            fetchDocuments();
        }
    }, [studentId]);

    // File Upload Handler
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', file.name);

        try {
            setIsUploading(true);
            const response = await fetch(`${API_URL}/api/students/${studentId}/documents`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchDocuments();
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
            const response = await fetch(`${API_URL}/api/students/${studentId}/documents/${currentRenameDoc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: renameValue }),
            });

            if (response.ok) {
                fetchDocuments();
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
            const response = await fetch(`${API_URL}/api/students/${studentId}/documents/${docId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchDocuments();
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-green-600" size={20} /> Attached Documents
                </h3>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || !studentId}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Plus size={16} />
                    )}
                    {isUploading ? 'Uploading...' : 'Add Document'}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {allDocs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                    No documents uploaded yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allDocs.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-green-200 transition-colors group">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600 shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                                </div>
                            </div>
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                                    className={`p-2 rounded-lg transition-colors ${openDropdownId === doc.id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {openDropdownId === doc.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                                        <button
                                            onClick={() => { window.open(doc.url || doc.path, '_blank'); setOpenDropdownId(null); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Eye size={16} className="text-blue-500" /> View Document
                                        </button>
                                        <a
                                            href={doc.url || doc.path}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => setOpenDropdownId(null)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Download size={16} className="text-green-600" /> Download Access
                                        </a>
                                        {!doc.isStatic && (
                                            <>
                                                <button
                                                    onClick={() => { openRenameModal(doc); setOpenDropdownId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <FilePenLine size={16} className="text-orange-500" /> Rename File
                                                </button>
                                                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                                <button
                                                    onClick={() => { handleDelete(doc.id); setOpenDropdownId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                                                >
                                                    <Trash2 size={16} className="text-red-500" /> Delete File
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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

export default ViewStudentDocuments;