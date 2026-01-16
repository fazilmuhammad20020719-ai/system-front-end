import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the reset link to the backend
        console.log("Reset link sent directly to:", email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">

                {/* Decoration */}
                <div className="absolute top-0 w-full h-2 bg-green-600"></div>

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            {submitted ? <CheckCircle size={32} /> : <Mail size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {submitted ? 'Check your email' : 'Forgot Password?'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {submitted
                                ? `We’ve sent a password reset link to ${email}. Please check your inbox.`
                                : 'No worries! Enter your email address below and we will send you a link to reset your password.'}
                        </p>
                    </div>

                    {/* Form */}
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="admin@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setSubmitted(false)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition duration-200"
                        >
                            Try another email
                        </button>
                    )}

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 font-medium transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
