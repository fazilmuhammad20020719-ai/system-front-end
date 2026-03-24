import { useEffect } from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'OK', cancelLabel = 'Cancel', danger = false }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="relative rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4 animate-fadeIn"
                style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                }}
            >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {danger ? (
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                                    stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" />
                                <path d="M12 8v4m0 4h.01" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Title */}
                {title && (
                    <h3 className="text-center font-semibold text-slate-800 mb-1" style={{ fontSize: '1.1rem', letterSpacing: 0.2 }}>
                        {title}
                    </h3>
                )}

                {/* Message */}
                <p className="text-center text-sm mb-6" style={{ color: '#4b5563', lineHeight: 1.6 }}>
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-full font-medium text-sm transition-all duration-200 hover:bg-gray-50 bg-white border border-gray-200 text-gray-700"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 text-white shadow-md hover:opacity-90 active:scale-95"
                        style={{
                            background: danger ? '#ef4444' : '#22c55e',
                            boxShadow: danger ? '0 4px 12px rgba(239,68,68,0.25)' : '0 4px 12px rgba(34,197,94,0.25)',
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.94); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.18s ease; }
            `}</style>
        </div>
    );
};

export default ConfirmDialog;
