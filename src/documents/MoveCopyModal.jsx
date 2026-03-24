import React, { useState } from 'react';
import { FolderInput, Copy, X, Folder } from 'lucide-react';

const MoveCopyModal = ({ isOpen, onClose, file, action, folderTree, onSubmit }) => {
    const [selectedDestination, setSelectedDestination] = useState("");

    if (!isOpen || !file) return null;

    // Flatten tree for easy dropdown mapping (Root only has 1 level of subfolders currently)
    const renderOptions = (nodes, depth = 0) => {
        let options = [];
        nodes.forEach(node => {
            options.push(
                <option key={node.id} value={node.id}>
                    {'\u00A0'.repeat(depth * 4)} - {node.name}
                </option>
            );
            if (node.subfolders && node.subfolders.length > 0) {
                options = options.concat(renderOptions(node.subfolders, depth + 1));
            }
        });
        return options;
    };

    const handleSubmit = () => {
        if (!selectedDestination) return;
        onSubmit(selectedDestination);
        setSelectedDestination("");
    };

    const isMove = action === 'move';

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {isMove ? <FolderInput className="text-[#ea8933]" size={20} /> : <Copy className="text-[#ea8933]" size={20} />}
                        {isMove ? 'Move File' : 'Copy File'}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Select a destination folder to {isMove ? 'move' : 'copy'} <strong>"{file.name}"</strong> to.
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Destination Folder</label>
                    <div className="relative">
                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea8933]/20 focus:border-[#ea8933]"
                        >
                            <option value="" disabled>Select a folder...</option>
                            {renderOptions(folderTree)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 text-sm">Cancel</button>
                    <button onClick={handleSubmit} disabled={!selectedDestination} className={`flex-1 py-2 rounded-lg text-white font-bold text-sm transition-colors ${selectedDestination ? 'bg-[#ea8933] hover:bg-[#d97c2a]' : 'bg-[#f3b57e] cursor-not-allowed'}`}>
                        {isMove ? 'Move Here' : 'Copy Here'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveCopyModal;
