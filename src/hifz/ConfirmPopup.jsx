import React from 'react';
import { BookOpen } from 'lucide-react';

const ConfirmPopup = ({ isOpen, num, name, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center animate-[fadeInUp_0.2s_ease] uppercase">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">START NEW JUZ?</h3>
                <p className="text-gray-600 mb-6 text-sm">
                    NEENGA PUTHUSA <strong>JUZ {num} ({name ? name.toUpperCase() : ''})</strong> START PANRINGALA?
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-bold shadow-md transition-colors"
                    >
                        YES, START
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
