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
import MoveCopyModal from './documents/MoveCopyModal';
import Loader from './components/Loader';

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

    // -- MOVE & COPY STATE --
    const [showMoveCopyModal, setShowMoveCopyModal] = useState(false);
    const [fileToMoveCopy, setFileToMoveCopy] = useState(null);
    const [moveCopyAction, setMoveCopyAction] = useState('move');

    // -- FOLDER EDIT STATE --
    const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
    const [folderToEdit, setFolderToEdit] = useState(null);
    const [editFolderValue, setEditFolderValue] = useState('');

    const [loading, setLoading] = useState(true);
    const [allFiles, setAllFiles] = useState([]);

    const [folderTree, setFolderTree] = useState([
        {
            id: 'root',
            name: 'All Documents',
            subfolders: [] // Will be populated dynamically
        }
    ]);

    // -- FETCH FOLDERS (Dynamic) --
    const fetchFolders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/documents/folders/all`);
            if (res.ok) {
                const data = await res.json();

                let baseTree = {
                    id: 'root',
                    name: 'All Documents',
                    subfolders: []
                };

                const buildTree = (parentId) => {
                    return data
                        .filter(f => f.parent_id === parentId)
                        .map(f => ({
                            id: f.id,
                            name: f.name,
                            subfolders: buildTree(f.id)
                        }));
                };

                baseTree.subfolders = buildTree('root');

                setFolderTree([baseTree]);
            }
        } catch (err) {
            console.error("Error fetching folders:", err);
        }
    };

    // -- FETCH DATA (Now fully dynamic) --
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/documents`);
            if (res.ok) {
                const data = await res.json();

                // Map the exact columns from your database to the UI
                const mapped = data.map(d => ({
                    id: d.id,
                    folderId: d.category || 'root',
                    name: d.name,
                    file_url: d.file_url,
                    type: d.type || 'unknown',
                    size: d.size || 'Unknown', // Pulled from your new DB column
                    date: d.upload_date ? new Date(d.upload_date).toISOString().split('T')[0] : '2024-01-01',
                    starred: d.starred || false,
                    pinned: d.pinned || false,
                    trashed: d.trashed || false
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
        fetchFolders();
        fetchDocuments();
    }, []);

    // -- ACTIONS (Now syncs with DB) --
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
            // Find current file to figure out what we are toggling
            const file = allFiles.find(f => f.id === id);
            if (!file) return;

            // Prepare the dynamic update payload
            let updates = {};
            if (action === 'star') updates = { starred: !file.starred };
            if (action === 'pin') updates = { pinned: !file.pinned };
            if (action === 'trash') updates = { trashed: true, starred: false, pinned: false };
            if (action === 'restore') updates = { trashed: false };

            // Optimistic UI Update (feels faster for the user)
            setAllFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

            try {
                // Send actual update to Database
                await fetch(`${API_URL}/api/documents/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
            } catch (err) {
                console.error("Update error", err);
                fetchDocuments(); // Revert UI if DB fails
            }
        }
    };

    // -- UPLOAD HANDLER --
    const handleUpload = async (fileData) => {
        try {
            const res = await fetch(`${API_URL}/api/documents`, {
                method: 'POST',
                // Removing Content-Type header so the browser sets multipart boundary automatically
                body: fileData
            });
            if (res.ok) {
                fetchDocuments(); // Refresh list
                setShowUploadModal(false);
            }
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    // -- FOLDER CREATION --
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        const isSystemFolder = ['recent', 'starred', 'pinned', 'trash'].includes(selectedFolderId);
        const actualParentId = (selectedFolderId && !isSystemFolder) ? selectedFolderId : 'root';

        const tempId = `folder_${Date.now()}`;
        const newFolder = { id: tempId, name: newFolderName.trim(), subfolders: [] };

        const addNode = (nodes, parentId, newNode) => {
            return nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, subfolders: [...(node.subfolders || []), newNode] };
                }
                if (node.subfolders && node.subfolders.length > 0) {
                    return { ...node, subfolders: addNode(node.subfolders, parentId, newNode) };
                }
                return node;
            });
        };

        const removeNode = (nodes, nodeId) => {
            return nodes.map(node => {
                if (node.subfolders) {
                    return { ...node, subfolders: removeNode(node.subfolders.filter(f => f.id !== nodeId), nodeId) };
                }
                return node;
            });
        };

        // Optimistic update — show folder immediately in sidebar
        setFolderTree(prev => addNode(prev, actualParentId, newFolder));

        // Expand the parent so the new folder is visible
        if (actualParentId !== 'root' && !expandedFolders.includes(actualParentId)) {
            setExpandedFolders(prev => [...prev, actualParentId]);
        }

        setNewFolderName("");
        setShowCreateFolderModal(false);

        try {
            const res = await fetch(`${API_URL}/api/documents/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFolderName.trim(), parent_id: actualParentId })
            });

            if (res.ok) {
                fetchFolders(); // Sync real ID from DB
            } else {
                // Revert optimistic update on failure
                setFolderTree(prev => removeNode(prev, tempId));
                const errData = await res.json().catch(() => ({}));
                alert(errData.message || 'Error creating folder');
            }
        } catch (err) {
            console.error("Create folder error", err);
            // Revert optimistic update on network error
            setFolderTree(prev => removeNode(prev, tempId));
            alert('Failed to connect to server');
        }
    };

    // -- VIEW & DOWNLOAD HANDLERS --
    const handleDownloadClick = (file) => {
        if (!file.file_url) return;
        const url = `${API_URL}${file.file_url}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleViewClick = (file) => {
        if (!file.file_url) return;
        window.open(`${API_URL}${file.file_url}`, '_blank');
    };

    // -- MOVE & COPY HANDLERS --
    const handleMoveCopyOpen = (file, action) => {
        setFileToMoveCopy(file);
        setMoveCopyAction(action);
        setShowMoveCopyModal(true);
    };

    const handleMoveCopySubmit = async (targetFolderId) => {
        if (!fileToMoveCopy || !targetFolderId) return;

        try {
            if (moveCopyAction === 'move') {
                const res = await fetch(`${API_URL}/api/documents/${fileToMoveCopy.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category: targetFolderId })
                });
                if (res.ok) fetchDocuments();
            } else if (moveCopyAction === 'copy') {
                const res = await fetch(`${API_URL}/api/documents/${fileToMoveCopy.id}/copy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category: targetFolderId })
                });
                if (res.ok) fetchDocuments();
            }
            setShowMoveCopyModal(false);
            setFileToMoveCopy(null);
        } catch (err) {
            console.error("Move/Copy error", err);
        }
    };

    // -- FOLDER DELETE & EDIT HANDLERS --
    const handleDeleteFolder = async (folder) => {
        if (!window.confirm(`Delete folder "${folder.name}"? Files and subfolders inside will be moved to All Documents.`)) return;

        const removeNode = (nodes, nodeId) => {
            return nodes.map(node => {
                if (node.subfolders) {
                    return { ...node, subfolders: removeNode(node.subfolders.filter(f => f.id !== nodeId), nodeId) };
                }
                return node;
            });
        };

        // Optimistic UI update
        setFolderTree(prev => removeNode(prev, folder.id));
        if (selectedFolderId === folder.id) setSelectedFolderId('root');

        try {
            const res = await fetch(`${API_URL}/api/documents/folders/${folder.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchFolders();
                fetchDocuments(); // Refresh files — deleted folder's files move to root
            } else {
                fetchFolders(); // Revert
            }
        } catch (err) {
            console.error('Delete folder error', err);
            fetchFolders(); // Revert
        }
    };

    const handleEditFolder = (folder) => {
        setFolderToEdit(folder);
        setEditFolderValue(folder.name);
        setShowRenameFolderModal(true);
    };

    const handleSaveFolderRename = async () => {
        if (!folderToEdit || !editFolderValue.trim()) return;

        const updateNodeName = (nodes, nodeId, newName) => {
            return nodes.map(node => {
                if (node.id === nodeId) {
                    return { ...node, name: newName };
                }
                if (node.subfolders) {
                    return { ...node, subfolders: updateNodeName(node.subfolders, nodeId, newName) };
                }
                return node;
            });
        };

        // Optimistic update
        setFolderTree(prev => updateNodeName(prev, folderToEdit.id, editFolderValue.trim()));
        setShowRenameFolderModal(false);

        try {
            const res = await fetch(`${API_URL}/api/documents/folders/${folderToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editFolderValue.trim() })
            });
            if (!res.ok) fetchFolders(); // Revert on failure
        } catch (err) {
            console.error('Rename folder error', err);
            fetchFolders(); // Revert
        } finally {
            setFolderToEdit(null);
        }
    };

    // -- RENAME HANDLERS (Now saves to DB) --
    const openRenameModal = (file) => {
        setFileToRename(file);
        setRenameValue(file.name);
        setShowRenameModal(true);
    };

    const handleSaveRename = async () => {
        if (!fileToRename) return;

        try {
            // Send dynamic rename to Backend Database
            const res = await fetch(`${API_URL}/api/documents/${fileToRename.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: renameValue })
            });

            if (res.ok) {
                // Update UI on success
                setAllFiles(prev => prev.map(f =>
                    f.id === fileToRename.id ? { ...f, name: renameValue } : f
                ));
                setShowRenameModal(false);
                setFileToRename(null);
            }
        } catch (err) {
            console.error("Rename error", err);
        }
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

    if (loading) return <Loader />;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-900 selection:bg-orange-100 selection:text-[#ea8933]">
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
                        onDeleteFolder={handleDeleteFolder}
                        onEditFolder={handleEditFolder}
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
                        onViewClick={handleViewClick}
                        onDownloadClick={handleDownloadClick}
                        onMoveCopyOpen={handleMoveCopyOpen}
                    />
                </main>
            </div>

            {/* MODALS */}
            <CreateFolderModal
                isOpen={showCreateFolderModal}
                onClose={() => setShowCreateFolderModal(false)}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
                onCreate={handleCreateFolder}
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

            <MoveCopyModal
                isOpen={showMoveCopyModal}
                onClose={() => setShowMoveCopyModal(false)}
                file={fileToMoveCopy}
                action={moveCopyAction}
                folderTree={folderTree}
                onSubmit={handleMoveCopySubmit}
            />

            {/* Folder Rename Modal — reuses RenameModal */}
            <RenameModal
                isOpen={showRenameFolderModal}
                onClose={() => setShowRenameFolderModal(false)}
                renameValue={editFolderValue}
                setRenameValue={setEditFolderValue}
                onSave={handleSaveFolderRename}
            />
        </div>
    );
};

export default Documents;