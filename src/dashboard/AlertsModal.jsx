import { X } from 'lucide-react';
import UpcomingAlerts from './UpcomingAlerts';

const AlertsModal = ({ onClose }) => {
    return (
        // BACKDROP WITH BLUR
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-28 px-4 bg-gray-900/30 backdrop-blur-sm transition-all animate-fade-in">

            {/* CLICK OUTSIDE TO CLOSE */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* MODAL CONTENT */}
            <div className="relative w-full max-w-lg z-10 animate-slide-up">

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:-right-12 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                >
                    <X size={24} />
                </button>

                {/* ALERTS COMPONENT */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                    {/* Reuse your existing UpcomingAlerts component */}
                    <UpcomingAlerts />
                </div>
            </div>
        </div>
    );
};

export default AlertsModal;