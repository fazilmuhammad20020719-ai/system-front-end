import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Server } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // --- HARDCODED SECURITY FOR NOW ---
        // You can change this to a real API call later
        if (credentials.username === 'admin' && credentials.password === '1234') {
            localStorage.setItem('saas_token', 'secure-token-123');
            navigate('/dashboard');
        } else {
            setError('Access Denied: Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900/50 p-8 text-center border-b border-slate-700">
                    <div className="inline-flex p-4 rounded-full bg-indigo-500/10 mb-4 ring-1 ring-indigo-500/50">
                        <Server size={32} className="text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">SaaS Command Center</h1>
                    <p className="text-slate-400 text-sm mt-2">Restricted Access • Authorized Personnel Only</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <ShieldCheck size={16} /> {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin ID</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Enter Admin ID"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secure Key</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    className="w-full bg-slate-900 border border-slate-600 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                            Authenticate
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-slate-900/30 p-4 text-center border-t border-slate-700">
                    <p className="text-xs text-slate-600">System v1.0.0 • Secure Connection</p>
                </div>
            </div>
        </div>
    );
};

export default Login;