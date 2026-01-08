const CreateFolderModal = ({ isOpen, onClose, newFolderName, setNewFolderName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Folder</h3>
                <input
                    type="text"
                    autoFocus
                    placeholder="Folder Name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-[#ea8933]"
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 text-sm">Cancel</button>
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a] text-sm">Create</button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolderModal;
