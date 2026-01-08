import { Clock, Star, Pin, Trash2, Folder, ChevronDown, ChevronRight } from 'lucide-react';

const DocumentsSidebar = ({
    selectedFolderId,
    setSelectedFolderId,
    expandedFolders,
    setExpandedFolders,
    folderTree
}) => {

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
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-4 border-b border-gray-100 space-y-1">
                <SpecialLink id="recent" icon={Clock} label="Recent" colorClass="text-blue-500" />
                <SpecialLink id="starred" icon={Star} label="Starred" colorClass="text-yellow-500" />
                <SpecialLink id="pinned" icon={Pin} label="Pinned" colorClass="text-purple-500" />
                <SpecialLink id="trash" icon={Trash2} label="Trash Bin" colorClass="text-red-500" />
            </div>
            <div className="p-4 pb-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Folders</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                {renderFolderTree(folderTree)}
            </div>
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
    );
};

export default DocumentsSidebar;
