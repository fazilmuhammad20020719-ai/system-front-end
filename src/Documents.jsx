import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

// IMPORTING NEW COMPONENTS
import DocumentsHeader from './documents/DocumentsHeader';
import DocumentsSidebar from './documents/DocumentsSidebar';
import DocumentsFileList from './documents/DocumentsFileList';
import CreateFolderModal from './documents/CreateFolderModal';
import UploadModal from './documents/UploadModal';
import RenameModal from './documents/RenameModal';

const Documents = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolderId, setSelectedFolderId] = useState('root');
    const [expandedFolders, setExpandedFolders] = useState(['root']);
    const [showFilters, setShowFilters] = useState(false);
    const [fileTypeFilter, setFileTypeFilter] = useState('all');

    // -- SEARCH STATE --
    const [searchQuery, setSearchQuery] = useState("");

    // -- MODAL STATES --
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    // -- RENAME STATE --
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [fileToRename, setFileToRename] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    const [loading, setLoading] = useState(true);
    const [allFiles, setAllFiles] = useState([]);

    const [folderTree] = useState([
        {
            id: 'root',
            name: 'All Documents',
            subfolders: [
                {
                    id: 'students',
                    name: 'Student Documents',
                    subfolders: []
                },
                { id: 'teachers', name: 'Teacher Records', subfolders: [] },
                { id: 'finance', name: 'Finance & Accounts', subfolders: [] }
            ]
        }
    ]);

    // -- FETCH DATA --
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/documents`);
            if (res.ok) {
                const data = await res.json();
                // Map API data to UI structure
                // API: id, name, type, category, upload_date
                // UI expects: id, folderId, name, type, size, date, starred, pinned, trashed
                const mapped = data.map(d => ({
                    id: d.id,
                    folderId: d.category || 'root', // root if no category
                    name: d.name,
                    type: d.type || 'unknown',
                    size: '2 MB', // Mock size as DB doesn't store size yet
                    date: d.upload_date ? new Date(d.upload_date).toISOString().split('T')[0] : '2024-01-01',
                    starred: false,
                    pinned: false,
                    trashed: false
                }));
                setAllFiles(mapped);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // -- ACTIONS --
    const handleFileAction = async (id, action) => {
        if (action === 'delete') {
            if (window.confirm("Permanently delete this file?")) {
                try {
                    const res = await fetch(`${API_URL}/api/documents/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        setAllFiles(prev => prev.filter(f => f.id !== id));
                    }
                } catch (err) {
                    console.error("Delete error", err);
                }
            }
        } else {
            // Local Actions (Star, Pin, Trash-simulated)
            setAllFiles(prev => prev.map(file => {
                if (file.id !== id) return file;
                if (action === 'star') return { ...file, starred: !file.starred };
                if (action === 'pin') return { ...file, pinned: !file.pinned };
                if (action === 'trash') return { ...file, trashed: true, starred: false, pinned: false };
                if (action === 'restore') return { ...file, trashed: false };
                return file;
            }));
        }
    };

    // -- UPLOAD HANDLER --
    const handleUpload = async (fileData) => {
        try {
            const res = await fetch(`${API_URL}/api/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fileData)
            });
            if (res.ok) {
                fetchDocuments(); // Refresh list
                setShowUploadModal(false);
            }
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    // -- RENAME HANDLERS --
    const openRenameModal = (file) => {
        setFileToRename(file);
        setRenameValue(file.name);
        setShowRenameModal(true);
    };

    const handleSaveRename = () => {
        // Mock rename local for now as API doesn't support PUT rename yet
        if (!fileToRename) return;
        setAllFiles(prev => prev.map(f =>
            f.id === fileToRename.id ? { ...f, name: renameValue } : f
        ));
        setShowRenameModal(false);
        setFileToRename(null);
    };

    // -- HELPER FUNCTIONS --
    const getPageTitle = () => {
        if (selectedFolderId === 'trash') return 'Trash Bin';
        if (selectedFolderId === 'starred') return 'Starred Items';
        if (selectedFolderId === 'pinned') return 'Pinned Items';
        if (selectedFolderId === 'recent') return 'Recent Files';
        // Simple map
        const map = { 'root': 'All Documents', 'students': 'Student Documents', 'teachers': 'Teacher Records', 'finance': 'Finance & Accounts' };
        return map[selectedFolderId] || 'Documents';
    };

    // -- FILTER LOGIC --
    let filteredFiles = allFiles.filter(file => {
        if (selectedFolderId === 'trash') return file.trashed;
        if (file.trashed) return false;

        if (selectedFolderId === 'starred') return file.starred;
        if (selectedFolderId === 'pinned') return file.pinned;
        if (selectedFolderId === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(file.date) > thirtyDaysAgo;
        }

        if (selectedFolderId === 'root') return true; // Show all in root? Or just unassigned? Let's show all for simplicity or match folderId

        // Match specific folder (category)
        return file.folderId === selectedFolderId;
    });

    filteredFiles = filteredFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesType = true;
        if (fileTypeFilter !== 'all') {
            if (fileTypeFilter === 'image' && file.type !== 'image') matchesType = false;
            else if (fileTypeFilter === 'pdf' && file.type !== 'pdf') matchesType = false;
            else if (fileTypeFilter === 'doc' && !['doc', 'docx'].includes(file.type)) matchesType = false;
            else if (fileTypeFilter === 'xls' && !['xls', 'xlsx'].includes(file.type)) matchesType = false;
        }
        return matchesSearch && matchesType;
    });

    if (selectedFolderId !== 'trash' && selectedFolderId !== 'recent') {
        filteredFiles.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    }

    if (loading) return <div className="p-20 text-center">Loading Documents...</div>;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <DocumentsHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={getPageTitle()}
                    isTrash={selectedFolderId === 'trash'}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    fileTypeFilter={fileTypeFilter}
                    setFileTypeFilter={setFileTypeFilter}
                    onCreateFolder={() => setShowCreateFolderModal(true)}
                    onUpload={() => setShowUploadModal(true)}
                />

                <main className="flex-1 flex overflow-hidden">
                    {/* INNER SIDEBAR */}
                    <DocumentsSidebar
                        selectedFolderId={selectedFolderId}
                        setSelectedFolderId={setSelectedFolderId}
                        expandedFolders={expandedFolders}
                        setExpandedFolders={setExpandedFolders}
                        folderTree={folderTree}
                    />

                    {/* FILE CONTENT */}
                    <DocumentsFileList
                        files={filteredFiles}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        selectedFolderId={selectedFolderId}
                        fileTypeFilter={fileTypeFilter}
                        handleFileAction={handleFileAction}
                        openRenameModal={openRenameModal}
                        onUploadClick={() => setShowUploadModal(true)}
                        pageTitle={getPageTitle()}
                    />
                </main>
            </div>

            {/* MODALS */}
            <CreateFolderModal
                isOpen={showCreateFolderModal}
                onClose={() => setShowCreateFolderModal(false)}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
            />

            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={handleUpload}
            />

            <RenameModal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                renameValue={renameValue}
                setRenameValue={setRenameValue}
                onSave={handleSaveRename}
            />
        </div>
    );
};

export default Documents;