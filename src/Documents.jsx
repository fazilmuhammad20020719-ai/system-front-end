import { useState } from 'react';
import Sidebar from './Sidebar';

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

    const [folderTree, setFolderTree] = useState([
        {
            id: 'root',
            name: 'All Documents',
            subfolders: [
                {
                    id: 'students',
                    name: 'Student Documents',
                    subfolders: [
                        { id: 'students-2024', name: 'Batch 2024', subfolders: [] },
                        { id: 'students-2025', name: 'Batch 2025', subfolders: [] },
                    ]
                },
                { id: 'teachers', name: 'Teacher Records', subfolders: [] },
                { id: 'finance', name: 'Finance & Accounts', subfolders: [] }
            ]
        }
    ]);

    const [allFiles, setAllFiles] = useState([
        { id: 101, folderId: 'root', name: 'General_Policy.pdf', type: 'pdf', size: '2.4 MB', date: '2024-10-24', starred: true, pinned: true, trashed: false },
        { id: 1, folderId: 'students', name: 'Student_List.xlsx', type: 'xls', size: '1.2 MB', date: '2024-10-20', starred: false, pinned: false, trashed: false },
        { id: 2, folderId: 'students-2024', name: 'Ahmed_Report.pdf', type: 'pdf', size: '500 KB', date: '2024-09-15', starred: false, pinned: false, trashed: false },
        { id: 3, folderId: 'students-2025', name: 'Intake_Draft.docx', type: 'doc', size: '22 KB', date: '2025-12-25', starred: true, pinned: false, trashed: false },
        { id: 7, folderId: 'finance', name: 'Budget_2025.xlsx', type: 'xls', size: '4.2 MB', date: '2024-10-10', starred: true, pinned: true, trashed: false },
        { id: 99, folderId: 'root', name: 'Old_Logo.png', type: 'image', size: '5 MB', date: '2023-01-01', starred: false, pinned: false, trashed: true },
    ]);

    // -- ACTIONS --
    const handleFileAction = (id, action) => {
        setAllFiles(prev => prev.map(file => {
            if (file.id !== id) return file;
            if (action === 'star') return { ...file, starred: !file.starred };
            if (action === 'pin') return { ...file, pinned: !file.pinned };
            if (action === 'trash') return { ...file, trashed: true, starred: false, pinned: false };
            if (action === 'restore') return { ...file, trashed: false };
            return file;
        }));
        if (action === 'delete') {
            if (window.confirm("Permanently delete this file?")) {
                setAllFiles(prev => prev.filter(f => f.id !== id));
            }
        }
    };

    // -- RENAME HANDLERS --
    const openRenameModal = (file) => {
        setFileToRename(file);
        setRenameValue(file.name);
        setShowRenameModal(true);
    };

    const handleSaveRename = () => {
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

        const getFolderName = (id, tree) => {
            for (const node of tree) {
                if (node.id === id) return node.name;
                if (node.subfolders) {
                    const found = getFolderName(id, node.subfolders);
                    if (found) return found;
                }
            }
            return 'Unknown';
        };
        return getFolderName(selectedFolderId, folderTree);
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