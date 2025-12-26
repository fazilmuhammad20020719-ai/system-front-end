import { useState } from 'react';
import {
    Folder,
    FileText,
    Search,
    UploadCloud,
    Menu,
    ChevronRight,
    ChevronDown,
    Grid,
    List,
    Trash2,
    MoreVertical,
    File,
    Image as ImageIcon,
    FolderPlus,
    X,
    Star,
    Pin,
    Clock,
    RotateCcw,
    Filter,
    Check
} from 'lucide-react';
import Sidebar from './Sidebar';

const Documents = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // -- VIEW & NAVIGATION STATE --
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolderId, setSelectedFolderId] = useState('root'); // 'root', 'starred', 'pinned', 'trash', 'recent' or folder ID
    const [expandedFolders, setExpandedFolders] = useState(['root']);

    // -- FILTERS STATE --
    const [showFilters, setShowFilters] = useState(false);
    const [fileTypeFilter, setFileTypeFilter] = useState('all'); // all, pdf, doc, xls, image
    const [dateFilter, setDateFilter] = useState('all'); // all, 7days, 30days

    // -- MODAL STATES --
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    // -- DATA: FOLDER TREE --
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
                {
                    id: 'teachers',
                    name: 'Teacher Records',
                    subfolders: []
                },
                {
                    id: 'finance',
                    name: 'Finance & Accounts',
                    subfolders: []
                }
            ]
        }
    ]);

    // -- DATA: FILES --
    const [allFiles, setAllFiles] = useState([
        { id: 101, folderId: 'root', name: 'General_Policy.pdf', type: 'pdf', size: '2.4 MB', date: '2024-10-24', starred: true, pinned: true, trashed: false },
        { id: 1, folderId: 'students', name: 'Student_List.xlsx', type: 'xls', size: '1.2 MB', date: '2024-10-20', starred: false, pinned: false, trashed: false },
        { id: 2, folderId: 'students-2024', name: 'Ahmed_Report.pdf', type: 'pdf', size: '500 KB', date: '2024-09-15', starred: false, pinned: false, trashed: false },
        { id: 3, folderId: 'students-2025', name: 'Intake_Draft.docx', type: 'doc', size: '22 KB', date: '2025-12-25', starred: true, pinned: false, trashed: false },
        { id: 7, folderId: 'finance', name: 'Budget_2025.xlsx', type: 'xls', size: '4.2 MB', date: '2024-10-10', starred: true, pinned: true, trashed: false },
        { id: 99, folderId: 'root', name: 'Old_Logo.png', type: 'image', size: '5 MB', date: '2023-01-01', starred: false, pinned: false, trashed: true }, // In Trash
    ]);

    // -- HELPER: RECURSIVE FOLDER ADDITION --
    const addFolderToTree = (tree, targetId, newFolder) => {
        return tree.map(node => {
            if (node.id === targetId) return { ...node, subfolders: [...node.subfolders, newFolder] };
            if (node.subfolders) return { ...node, subfolders: addFolderToTree(node.subfolders, targetId, newFolder) };
            return node;
        });
    };

    // -- ACTION HANDLERS --
    const handleFileAction = (id, action) => {
        setAllFiles(prev => prev.map(file => {
            if (file.id !== id) return file;
            if (action === 'star') return { ...file, starred: !file.starred };
            if (action === 'pin') return { ...file, pinned: !file.pinned };
            if (action === 'trash') return { ...file, trashed: true, starred: false, pinned: false }; // Unstar/Unpin when trashing
            if (action === 'restore') return { ...file, trashed: false };
            return file;
        }));

        if (action === 'delete') {
            if (window.confirm("Permanently delete this file?")) {
                setAllFiles(prev => prev.filter(f => f.id !== id));
            }
        }
    };

    // -- COMPUTED: FILTERING LOGIC --
    let filteredFiles = allFiles.filter(file => {
        // 1. Primary View Filter
        if (selectedFolderId === 'trash') return file.trashed;
        if (file.trashed) return false; // Hide trash from other views

        if (selectedFolderId === 'starred') return file.starred;
        if (selectedFolderId === 'pinned') return file.pinned;
        if (selectedFolderId === 'recent') {
            // Mock recent logic: files modified in last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(file.date) > thirtyDaysAgo;
        }

        // Default: Show files in selected folder
        return file.folderId === selectedFolderId;
    });

    // 2. Secondary dropdown filters (Type & Date)
    filteredFiles = filteredFiles.filter(file => {
        if (fileTypeFilter !== 'all') {
            if (fileTypeFilter === 'image' && file.type !== 'image') return false;
            if (fileTypeFilter === 'pdf' && file.type !== 'pdf') return false;
            if (fileTypeFilter === 'doc' && !['doc', 'docx'].includes(file.type)) return false;
            if (fileTypeFilter === 'xls' && !['xls', 'xlsx'].includes(file.type)) return false;
        }
        // Date filter implementation omitted for brevity but follows similar logic
        return true;
    });

    // 3. Sorting (Pinned first, unless in Trash/Recent)
    if (selectedFolderId !== 'trash' && selectedFolderId !== 'recent') {
        filteredFiles.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    }

    // -- HELPER: Get Current View Name --
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

    // -- RENDER HELPERS --
    const getFileIcon = (type, name) => {
        if (name.endsWith('pdf')) return <FileText size={24} className="text-red-500" />;
        if (name.endsWith('xls') || name.endsWith('xlsx')) return <FileText size={24} className="text-green-600" />;
        if (name.endsWith('doc') || name.endsWith('docx')) return <FileText size={24} className="text-blue-600" />;
        if (['jpg', 'png', 'image'].includes(type)) return <ImageIcon size={24} className="text-purple-500" />;
        return <File size={24} className="text-gray-400" />;
    };

    const renderFolderTree = (nodes, depth = 0) => {
        return nodes.map(node => {
            const isExpanded = expandedFolders.includes(node.id);
            const isSelected = selectedFolderId === node.id;
            const hasChildren = node.subfolders && node.subfolders.length > 0;

            return (
                <div key={node.id} className="select-none">
                    <div
                        onClick={() => { setSelectedFolderId(node.id); if (!isExpanded) setExpandedFolders([...expandedFolders, node.id]); }}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm rounded-lg mb-0.5 ${isSelected ? "bg-orange-100 text-[#ea8933] font-bold" : "text-gray-600 hover:bg-gray-100"}`}
                        style={{ paddingLeft: `${depth * 16 + 12}px` }}
                    >
                        <div onClick={(e) => { e.stopPropagation(); setExpandedFolders(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]); }} className={`p-0.5 rounded hover:bg-black/5 ${!hasChildren && "opacity-0"}`}>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        <Folder size={16} className={isSelected ? "fill-[#ea8933] text-[#ea8933]" : "fill-gray-300 text-gray-400"} />
                        <span className="truncate">{node.name}</span>
                    </div>
                    {isExpanded && node.subfolders && <div>{renderFolderTree(node.subfolders, depth + 1)}</div>}
                </div>
            );
        });
    };

    // Sidebar Special Link Component
    const SpecialLink = ({ id, icon: Icon, label, colorClass }) => (
        <div
            onClick={() => setSelectedFolderId(id)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm rounded-lg mb-0.5 transition-colors ${selectedFolderId === id ? "bg-gray-100 font-bold text-gray-800" : "text-gray-600 hover:bg-gray-50"}`}
        >
            <Icon size={18} className={selectedFolderId === id ? colorClass : "text-gray-400"} />
            <span>{label}</span>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* --- HEADER --- */}
                <header className="px-6 py-4 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-600"><Menu /></button>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {getPageTitle()}
                            {selectedFolderId === 'trash' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Empty Trash</span>}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ea8933]" />
                        </div>

                        {/* Filter Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 border rounded-lg hover:bg-gray-50 ${showFilters ? 'bg-orange-50 border-orange-200 text-[#ea8933]' : 'border-gray-300 text-gray-600'}`}
                            >
                                <Filter size={18} />
                            </button>
                            {/* Filter Dropdown */}
                            {showFilters && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-30 animate-in fade-in zoom-in duration-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase px-2 py-1">File Type</p>
                                    {['all', 'pdf', 'doc', 'xls', 'image'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFileTypeFilter(type)}
                                            className={`w-full text-left px-2 py-1.5 text-sm rounded-lg flex justify-between items-center ${fileTypeFilter === type ? 'bg-orange-50 text-[#ea8933] font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            <span className="capitalize">{type}</span>
                                            {fileTypeFilter === type && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="h-8 w-px bg-gray-300 mx-1 hidden md:block"></div>

                        <button onClick={() => setShowCreateFolderModal(true)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600" title="New Folder">
                            <FolderPlus size={18} />
                        </button>
                        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#ea8933] text-white rounded-lg text-sm font-bold hover:bg-[#d97c2a] shadow-sm">
                            <UploadCloud size={18} /> <span className="hidden sm:inline">Upload</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    {/* --- LEFT SIDEBAR --- */}
                    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">

                        {/* Special Views */}
                        <div className="p-4 border-b border-gray-100 space-y-1">
                            <SpecialLink id="recent" icon={Clock} label="Recent" colorClass="text-blue-500" />
                            <SpecialLink id="starred" icon={Star} label="Starred" colorClass="text-yellow-500" />
                            <SpecialLink id="pinned" icon={Pin} label="Pinned" colorClass="text-purple-500" />
                            <SpecialLink id="trash" icon={Trash2} label="Trash Bin" colorClass="text-red-500" />
                        </div>

                        {/* Folder Tree */}
                        <div className="p-4 pb-2">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Folders</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                            {renderFolderTree(folderTree)}
                        </div>

                        {/* Storage */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Storage</span>
                                <span className="text-[10px] font-bold text-[#ea8933]">75%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <div className="bg-[#ea8933] h-1 rounded-full w-[75%]"></div>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                        {/* View Toggles */}
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">
                                Showing {filteredFiles.length} {fileTypeFilter !== 'all' ? fileTypeFilter : ''} files
                            </p>
                            <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#ea8933]' : 'text-gray-400'}`}><Grid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#ea8933]' : 'text-gray-400'}`}><List size={16} /></button>
                            </div>
                        </div>

                        {filteredFiles.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredFiles.map((file) => (
                                        <div key={file.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group relative">

                                            {/* Pin Indicator */}
                                            {file.pinned && !file.trashed && <div className="absolute top-2 right-2 text-purple-500 bg-purple-50 p-1 rounded-full"><Pin size={12} fill="currentColor" /></div>}

                                            <div className="flex justify-between items-start mb-3">
                                                <div className="p-2.5 rounded-lg bg-gray-50">{getFileIcon(file.type, file.name)}</div>
                                            </div>

                                            <h3 className="font-bold text-gray-700 truncate text-sm mb-1">{file.name}</h3>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400 mb-3"><span>{file.size}</span><span>{file.date}</span></div>

                                            {/* Action Buttons (Hover) */}
                                            <div className="flex gap-1 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {selectedFolderId === 'trash' ? (
                                                    <>
                                                        <button onClick={() => handleFileAction(file.id, 'restore')} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100">Restore</button>
                                                        <button onClick={() => handleFileAction(file.id, 'delete')} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100">Delete</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleFileAction(file.id, 'star')} className={`p-1.5 rounded hover:bg-gray-100 ${file.starred ? "text-yellow-400" : "text-gray-400"}`}><Star size={14} fill={file.starred ? "currentColor" : "none"} /></button>
                                                        <button onClick={() => handleFileAction(file.id, 'pin')} className={`p-1.5 rounded hover:bg-gray-100 ${file.pinned ? "text-purple-500" : "text-gray-400"}`}><Pin size={14} fill={file.pinned ? "currentColor" : "none"} /></button>
                                                        <button onClick={() => handleFileAction(file.id, 'trash')} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 ml-auto"><Trash2 size={14} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                            <tr>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3 hidden sm:table-cell">Date</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredFiles.map((file) => (
                                                <tr key={file.id} className={`hover:bg-gray-50 group ${file.pinned ? "bg-purple-50/30" : ""}`}>
                                                    <td className="px-6 py-3 flex items-center gap-3">
                                                        {getFileIcon(file.type, file.name)}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                {file.name}
                                                                {file.pinned && <Pin size={12} className="text-purple-500" fill="currentColor" />}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-500 hidden sm:table-cell">{file.date}</td>
                                                    <td className="px-6 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {selectedFolderId === 'trash' ? (
                                                                <>
                                                                    <button onClick={() => handleFileAction(file.id, 'restore')} title="Restore" className="p-1.5 bg-blue-50 text-blue-600 rounded"><RotateCcw size={14} /></button>
                                                                    <button onClick={() => handleFileAction(file.id, 'delete')} title="Delete Forever" className="p-1.5 bg-red-50 text-red-600 rounded"><X size={14} /></button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleFileAction(file.id, 'star')} className={`p-1.5 rounded ${file.starred ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}><Star size={16} fill={file.starred ? "currentColor" : "none"} /></button>
                                                                    <button onClick={() => handleFileAction(file.id, 'pin')} className={`p-1.5 rounded ${file.pinned ? "text-purple-500" : "text-gray-300 hover:text-purple-500"}`}><Pin size={16} fill={file.pinned ? "currentColor" : "none"} /></button>
                                                                    <button onClick={() => handleFileAction(file.id, 'trash')} className="p-1.5 text-gray-300 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                    {selectedFolderId === 'trash' ? <Trash2 size={32} className="text-red-300" /> : <Folder size={32} className="text-gray-300" />}
                                </div>
                                <p className="text-sm font-medium">No items found in {getPageTitle()}</p>
                                {selectedFolderId !== 'trash' && (
                                    <button onClick={() => setShowUploadModal(true)} className="mt-4 text-[#ea8933] text-xs font-bold hover:underline">Upload a file here</button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODALS (Create Folder & Upload) --- */}
            {/* Same as previous version, kept for completeness */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Folder</h3>
                        <input type="text" autoFocus placeholder="Folder Name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-[#ea8933]" />
                        <div className="flex gap-3">
                            <button onClick={() => setShowCreateFolderModal(false)} className="flex-1 py-2 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 text-sm">Cancel</button>
                            <button onClick={() => { /* Logic to add folder */ setShowCreateFolderModal(false); }} className="flex-1 py-2 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a] text-sm">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4">Upload File</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-[#ea8933] cursor-pointer">
                            <UploadCloud size={40} className="mb-2" />
                            <p className="font-medium">Click to Browse</p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowUploadModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600">Cancel</button>
                            <button onClick={() => setShowUploadModal(false)} className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold">Upload</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;