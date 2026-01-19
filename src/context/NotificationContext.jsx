import React, { createContext, useContext, useState, useCallback } from 'react';
import DashboardAlert from '../dashboard/DashboardAlert';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Notification Function
    const notify = useCallback((type, message, title = '') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message, title }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {/* Notification Display Area (Top Right) */}
            <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-5 fade-in duration-300">
                        <DashboardAlert
                            type={n.type}
                            title={n.title}
                            message={n.message}
                            onClose={() => removeNotification(n.id)}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
