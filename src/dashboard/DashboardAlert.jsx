import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const DashboardAlert = ({ type = 'info', title, message, onClose }) => {
    // Define styles for different alert types to match your dashboard theme
    const styles = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'text-blue-600',
            Icon: Info
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'text-green-600',
            Icon: CheckCircle
        },
        warning: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-800',
            icon: 'text-orange-600',
            Icon: AlertTriangle
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'text-red-600',
            Icon: AlertCircle
        }
    };

    const currentStyle = styles[type] || styles.info;
    const IconComponent = currentStyle.Icon;

    return (
        <div className={`${currentStyle.bg} ${currentStyle.border} border px-4 py-3 rounded-xl shadow-sm flex items-start gap-3 transition-all animate-fade-in`}>
            <div className="mt-0.5">
                <IconComponent className={currentStyle.icon} size={20} />
            </div>
            <div className="flex-1">
                {title && <h3 className={`font-semibold text-sm mb-0.5 ${currentStyle.text}`}>{title}</h3>}
                <p className={`text-sm ${currentStyle.text} opacity-90`}>{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`p-1 hover:bg-black/5 rounded-lg transition-colors ${currentStyle.text} opacity-60 hover:opacity-100`}
                    aria-label="Close alert"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default DashboardAlert;