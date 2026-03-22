import React from 'react';

const SystemConfirm = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-[fadeInUp_0.2s_ease] text-center">
                <h3 className="text-2xl font-black text-[#0f172a] mb-3 uppercase">
                    {title || 'DELETE STUDENT?'}
                </h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed text-sm uppercase">
                    {message}
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-4 px-6 rounded-2xl bg-[#f1f5f9] text-[#0f172a] font-bold text-lg hover:bg-[#e2e8f0] transition-all uppercase"
                    >
                        CANCEL
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-4 px-6 rounded-2xl bg-[#dc2626] text-white font-bold text-lg hover:bg-[#b91c1c] shadow-lg shadow-red-200 transition-all uppercase"
                    >
                        YES, DELETE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemConfirm;
