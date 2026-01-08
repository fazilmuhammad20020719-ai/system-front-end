import { Menu, Search, Filter, FolderPlus, UploadCloud, Check } from 'lucide-react';

const DocumentsHeader = ({
    toggleSidebar,
    title,
    isTrash,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    fileTypeFilter,
    setFileTypeFilter,
    onCreateFolder,
    onUpload
}) => {
    return (
        <header className="px-6 py-4 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm transition-all">
            <div className="flex items-center gap-3">
                <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600">
                    <Menu />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {title}
                    {isTrash && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Empty Trash</span>}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ea8933]"
                    />
                </div>

                {/* Filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 border rounded-lg hover:bg-gray-50 ${showFilters ? 'bg-orange-50 border-orange-200 text-[#ea8933]' : 'border-gray-300 text-gray-600'}`}
                    >
                        <Filter size={18} />
                    </button>
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

                <div className="h-8 w-px bg-gray-300 mx-1 hidden md:block"></div>

                {/* Actions */}
                <button onClick={onCreateFolder} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600" title="New Folder">
                    <FolderPlus size={18} />
                </button>
                <button onClick={onUpload} className="flex items-center gap-2 px-4 py-2 bg-[#ea8933] text-white rounded-lg text-sm font-bold hover:bg-[#d97c2a] shadow-sm">
                    <UploadCloud size={18} /> <span className="hidden sm:inline">Upload</span>
                </button>
            </div>
        </header>
    );
};

export default DocumentsHeader;
