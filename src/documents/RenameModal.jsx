import React from 'react';
import { PencilLine, X, Check } from 'lucide-react';

const RenameModal = ({ isOpen, onClose, renameValue, setRenameValue, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 z-[60] flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-sm border border-gray-100 animate-in zoom-in slide-in-from-bottom-8 duration-500 ease-out">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-orange-50 p-3 rounded-2xl text-[#ea8933] shadow-sm border border-orange-100">
                        <PencilLine size={24} />
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>
                
                <h3 className="text-xl font-black text-gray-800 mb-2 tracking-tight">Modify Name</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Edit record identification</p>
                
                <div className="space-y-4">
                    <input
                        type="text"
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSave()}
                        className="w-full px-5 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ea8933] focus:bg-white focus:ring-4 focus:ring-orange-100/50 transition-all shadow-sm"
                    />
                </div>

                <div className="flex gap-3 mt-8">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3.5 rounded-2xl border border-gray-100 font-black text-gray-400 text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={onSave} 
                        className="flex-1 py-3.5 rounded-2xl bg-gradient-to-br from-[#ea8933] to-[#d97c2a] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 hover:-translate-y-0.5 active:translate-y-0 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Check size={16} />
                        Apply Change
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameModal;
