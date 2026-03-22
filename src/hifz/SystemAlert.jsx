import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

const SystemAlert = ({ isOpen, title, message, onConfirm, type = 'success' }) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: <CheckCircle2 size={48} className="text-emerald-500" />,
            buttonBg: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200',
            titleColor: 'text-emerald-600',
        },
        error: {
            icon: <XCircle size={48} className="text-rose-500" />,
            buttonBg: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',
            titleColor: 'text-rose-600',
        },
        warning: {
            icon: <AlertCircle size={48} className="text-amber-500" />,
            buttonBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
            titleColor: 'text-amber-600',
        },
        info: {
            icon: <Info size={48} className="text-blue-500" />,
            buttonBg: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200',
            titleColor: 'text-blue-600',
        }
    };

    const current = config[type] || config.success;

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-300 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gray-50 rounded-3xl">
                        {current.icon}
                    </div>
                </div>
                
                <h3 className={`text-2xl font-black mb-3 uppercase tracking-tight ${current.titleColor}`}>
                    {title || 'SUCCESS!'}
                </h3>
                
                <p className="text-gray-500 font-bold mb-10 leading-relaxed text-sm uppercase px-2">
                    {message}
                </p>
                
                <button 
                    onClick={onConfirm}
                    className={`w-full py-4.5 px-6 rounded-2xl text-white font-black text-lg shadow-lg transition-all active:scale-95 uppercase tracking-widest ${current.buttonBg}`}
                >
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default SystemAlert;
