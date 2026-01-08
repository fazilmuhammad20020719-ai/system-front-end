import { Grid, List, FileText, File, Image as ImageIcon, Download, Printer, Eye, FilePenLine, Trash2, RotateCcw, X, Pin, UploadCloud, Folder } from 'lucide-react';

const DocumentsFileList = ({
    files,
    viewMode,
    setViewMode,
    selectedFolderId,
    fileTypeFilter,
    handleFileAction,
    openRenameModal,
    onUploadClick,
    pageTitle
}) => {

    const getFileIcon = (type, name) => {
        if (name.endsWith('pdf')) return <FileText size={24} className="text-red-500" />;
        if (name.endsWith('xls') || name.endsWith('xlsx')) return <FileText size={24} className="text-green-600" />;
        if (name.endsWith('doc') || name.endsWith('docx')) return <FileText size={24} className="text-blue-600" />;
        if (['jpg', 'png', 'image'].includes(type)) return <ImageIcon size={24} className="text-purple-500" />;
        return <File size={24} className="text-gray-400" />;
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    Showing {files.length} {fileTypeFilter !== 'all' ? fileTypeFilter : ''} files
                </p>
                <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#ea8933]' : 'text-gray-400'}`}><Grid size={16} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#ea8933]' : 'text-gray-400'}`}><List size={16} /></button>
                </div>
            </div>

            {files.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {files.map((file) => (
                            <div key={file.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group relative">
                                {file.pinned && !file.trashed && <div className="absolute top-2 right-2 text-purple-500 bg-purple-50 p-1 rounded-full"><Pin size={12} fill="currentColor" /></div>}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2.5 rounded-lg bg-gray-50">{getFileIcon(file.type, file.name)}</div>
                                </div>
                                <h3 className="font-bold text-gray-700 truncate text-sm mb-1">{file.name}</h3>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-3"><span>{file.size}</span><span>{file.date}</span></div>

                                <div className="flex gap-1 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity justify-between">
                                    {selectedFolderId === 'trash' ? (
                                        <>
                                            <button onClick={() => handleFileAction(file.id, 'restore')} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100">Restore</button>
                                            <button onClick={() => handleFileAction(file.id, 'delete')} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100">Delete</button>
                                        </>
                                    ) : (
                                        <>
                                            <button title="Download" className="p-1.5 rounded hover:bg-green-50 text-gray-400 hover:text-green-600"><Download size={14} /></button>
                                            <button title="Print" className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Printer size={14} /></button>
                                            <button title="View" className="p-1.5 rounded hover:bg-orange-50 text-gray-400 hover:text-orange-600"><Eye size={14} /></button>
                                            <button onClick={() => openRenameModal(file)} title="Rename" className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><FilePenLine size={14} /></button>
                                            <div className="w-px bg-gray-200 h-4 my-auto mx-1"></div>
                                            <button onClick={() => handleFileAction(file.id, 'trash')} title="Delete" className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
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
                                {files.map((file) => (
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
                                                        <button title="Download" className="p-1.5 text-gray-400 hover:text-green-600 rounded"><Download size={16} /></button>
                                                        <button title="Print" className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Printer size={16} /></button>
                                                        <button title="View" className="p-1.5 text-gray-400 hover:text-orange-600 rounded"><Eye size={16} /></button>
                                                        <button onClick={() => openRenameModal(file)} title="Rename" className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><FilePenLine size={16} /></button>
                                                        <div className="w-px bg-gray-200 h-4 my-auto mx-1"></div>
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
                    <p className="text-sm font-medium">No items found in {pageTitle}</p>
                    {selectedFolderId !== 'trash' && (
                        <button onClick={onUploadClick} className="mt-4 text-[#ea8933] text-xs font-bold hover:underline">Upload a file here</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentsFileList;
