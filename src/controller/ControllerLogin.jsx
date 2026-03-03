import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Eye, EyeOff, Lock, User } from 'lucide-react';
import { API_URL } from '../config';

const ControllerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/controller/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Login failed'); return; }
            localStorage.setItem('dev_token', data.token);
            navigate('/controller/dashboard');
        } catch {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

            {/* Background grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4 mx-auto">
                        <Terminal size={30} className="text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Developer Console</h1>
                    <p className="text-gray-500 text-sm mt-1 font-mono">FMAC System — Authorized Personnel Only</p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Developer ID</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="username"
                                    required
                                    className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Access Key</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-9 pr-11 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-200 text-sm font-mono tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            <Terminal size={16} />
                            {loading ? 'Authenticating…' : 'Access Console'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-700 text-xs font-mono mt-6">
                    v1.0.0 — For authorized developers only
                </p>
            </div>
        </div>
    );
};

export default ControllerLogin;
