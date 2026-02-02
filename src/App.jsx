import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientDetails from './pages/ClientDetails';
import DatabaseDetails from './pages/DatabaseDetails';
import SystemLogs from './pages/SystemLogs';
import SubscriptionDetails from './pages/SubscriptionDetails';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Login Page (Default) */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Dashboard & Client Details */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/client/:id" element={<ClientDetails />} />
                <Route path="/client/:id/database" element={<DatabaseDetails />} />
                <Route path="/client/:id/logs" element={<SystemLogs />} />
                <Route path="/client/:id/subscription" element={<SubscriptionDetails />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;