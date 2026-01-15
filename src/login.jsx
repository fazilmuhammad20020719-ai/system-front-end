import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token in localStorage (or context)
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid username or password");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

                {/* HEADER */}
                <div className="bg-[#EB8A33] py-10 flex flex-col items-center justify-center text-white relative">
                    <div className="bg-white rounded-full p-1 mb-4 shadow-sm">
                        <img
                            src="/logo.png"
                            alt="College Logo"
                            className="h-20 w-20 object-contain rounded-full"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-center tracking-wide">
                        Faizanul Madeena Arabic College
                    </h2>
                    <p className="text-sm text-white/90 mt-1 font-light">
                        Office Admin Portal
                    </p>
                </div>

                {/* FORM SECTION */}
                <div className="p-8 pt-10">

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm rounded" role="alert">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EB8A33] focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EB8A33] focus:border-transparent transition-all pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-gray-500 hover:text-[#EB8A33] transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#EB8A33] hover:bg-[#d67b2b] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                            Access Dashboard
                            <span>&rarr;</span>
                        </button>
                    </form>

                    {/* CREATE ADMIN LINK */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/create-admin"
                            className="text-sm text-gray-500 hover:text-[#EB8A33] font-medium transition-colors duration-200"
                        >
                            Don't have an account? <span className="underline">Create Admin</span>
                        </Link>
                    </div>

                    {/* Footer Text */}
                    <div className="mt-8 text-center border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-400 font-medium tracking-wide">
                            Authorized Personnel Only • v2.5.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;