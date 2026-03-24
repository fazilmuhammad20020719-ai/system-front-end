import { Clock, Star, Pin, Trash2, Folder, ChevronDown, ChevronRight, FilePenLine } from 'lucide-react';

const DocumentsSidebar = ({
    selectedFolderId,
    setSelectedFolderId,
    expandedFolders,
    setExpandedFolders,
    folderTree,
    onDeleteFolder,
    onEditFolder
}) => {

    const renderFolderTree = (nodes, depth = 0) => {
        return nodes.map(node => {
            const isExpanded = expandedFolders.includes(node.id);
            const isSelected = selectedFolderId === node.id;
            const hasChildren = node.subfolders && node.subfolders.length > 0;
            const isUserFolder = node.id !== 'root'; // Only show actions on user-created folders

            return (
                <div key={node.id} className="select-none group/folder">
                    <div
                        onClick={() => { setSelectedFolderId(node.id); if (!isExpanded) setExpandedFolders([...expandedFolders, node.id]); }}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-all text-sm rounded-lg mb-0.5 ${isSelected ? "bg-orange-50 text-[#ea8933] font-bold shadow-sm" : "text-gray-600 hover:bg-orange-50/50 hover:text-[#ea8933]"}`}
                        style={{ paddingLeft: `${depth * 16 + 12}px` }}
                    >
                        <div onClick={(e) => { e.stopPropagation(); setExpandedFolders(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]); }} className={`p-0.5 rounded hover:bg-black/5 ${!hasChildren && "opacity-0"}`}>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        <Folder size={16} className={isSelected ? "fill-[#ea8933] text-[#ea8933]" : "fill-gray-300 text-gray-400 group-hover/folder:text-[#ea8933]/70"} />
                        <span className="truncate flex-1">{node.name}</span>

                        {/* Edit / Delete actions — only on user folders, show on hover */}
                        {isUserFolder && (
                            <div className="flex items-center gap-0.5 opacity-0 group-hover/folder:opacity-100 transition-opacity shrink-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEditFolder(node); }}
                                    title="Rename folder"
                                    className="p-1.5 rounded-md hover:bg-orange-100/80 hover:text-[#ea8933] text-gray-400 transition-colors"
                                >
                                    <FilePenLine size={13} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(node); }}
                                    title="Delete folder"
                                    className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )}
                    </div>
                    {isExpanded && node.subfolders && <div>{renderFolderTree(node.subfolders, depth + 1)}</div>}
                </div>
            );
        });
    };

    const SpecialLink = ({ id, icon: Icon, label, colorClass, activeBg }) => (
        <div
            onClick={() => setSelectedFolderId(id)}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer text-sm rounded-xl mb-1 transition-all duration-200 ${selectedFolderId === id ? `${activeBg} font-bold shadow-sm border border-black/5` : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}
        >
            <div className={`p-1.5 rounded-lg ${selectedFolderId === id ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                <Icon size={18} className={selectedFolderId === id ? colorClass : "text-gray-400"} />
            </div>
            <span>{label}</span>
        </div>
    );

    return (
        <aside className="w-72 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
            <div className="p-6 border-b border-gray-50 space-y-1">
                <SpecialLink id="recent" icon={Clock} label="Recent Files" colorClass="text-blue-500" activeBg="bg-blue-50/50 text-blue-700" />
                <SpecialLink id="starred" icon={Star} label="Starred" colorClass="text-amber-500" activeBg="bg-amber-50/50 text-amber-700" />
                <SpecialLink id="pinned" icon={Pin} label="Pinned" colorClass="text-purple-500" activeBg="bg-purple-50/50 text-purple-700" />
                <SpecialLink id="trash" icon={Trash2} label="Trash Bin" colorClass="text-red-500" activeBg="bg-red-50/50 text-red-700" />
            </div>
            <div className="p-6 pb-2">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3">Workspace Folders</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
                {renderFolderTree(folderTree)}
            </div>

        </aside>
    );
};

export default DocumentsSidebar;
