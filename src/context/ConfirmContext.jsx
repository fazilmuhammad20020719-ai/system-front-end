import React, { createContext, useContext, useState, useRef } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [options, setOptions] = useState(null);
    const resolveRef = useRef(null);

    const confirm = ({ title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' } = {}) => {
        return new Promise((resolve) => {
            setOptions({ title, message, confirmText, cancelText, type });
            resolveRef.current = resolve;
        });
    };

    const handleConfirm = () => {
        if (resolveRef.current) resolveRef.current(true);
        setOptions(null);
    };

    const handleCancel = () => {
        if (resolveRef.current) resolveRef.current(false);
        setOptions(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {options && (
                <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{options.title}</h3>
                            <p className="text-gray-600 mb-6">{options.message}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    {options.cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 px-4 py-2 rounded-lg text-white font-bold transition-colors ${options.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#ea8933] hover:bg-[#d97c2a]'
                                        }`}
                                >
                                    {options.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
