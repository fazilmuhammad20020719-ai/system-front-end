import { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Crown, Server, Globe, HardDrive, Settings, ShieldCheck, Check, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

const AdminProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Profile state
    const [profile, setProfile] = useState({ full_name: '', username: '', role: '' });
    const [loading, setLoading] = useState(true);

    // Form state
    const [fullName, setFullName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setFullName(data.full_name || '');
                    setNewUsername(data.username || '');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Validate passwords match
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword && newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    newUsername: newUsername !== profile.username ? newUsername : undefined,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile.' });
                return;
            }

            // If a new token is returned (username changed), update it
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            setProfile({ ...profile, full_name: fullName, username: newUsername });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

        } catch (err) {
            setMessage({ type: 'error', text: 'Server error. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* Sticky Header */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 md:px-8 h-20 flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Shield size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">Account Settings</h1>
                        <p className="text-gray-400 text-xs hidden md:block">Manage your credentials &amp; subscription</p>
                    </div>
                </header>

                <main className="p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Status Message */}
                        {message && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                                }`}>
                                {message.type === 'success'
                                    ? <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                    : <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                                }
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        {loading ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                                Loading profile…
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-5">

                                {/* Account Info */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User size={18} className="text-green-600" />
                                        <h2 className="text-base font-semibold text-gray-800">Account Information</h2>
                                    </div>

                                    {/* Role badge */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase">
                                            {profile.role || 'Admin'}
                                        </span>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all bg-gray-50"
                                        />
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={e => setNewUsername(e.target.value)}
                                            placeholder="Enter new username"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Change Password */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lock size={18} className="text-green-600" />
                                        <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
                                    </div>
                                    <p className="text-xs text-gray-400 -mt-3">Leave blank to keep your current password</p>

                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrent ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={e => setCurrentPassword(e.target.value)}
                                                placeholder="Enter current password"
                                                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-gray-50"
                                            />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-gray-50"
                                            />
                                            <button type="button" onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter new password"
                                                className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-gray-50 ${confirmPassword && confirmPassword !== newPassword
                                                    ? 'border-red-300' : 'border-gray-200'
                                                    }`}
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {confirmPassword && confirmPassword !== newPassword && (
                                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </form>
                        )}

                        {/* Subscription Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Crown size={18} className="text-yellow-500" />
                                    <h2 className="text-base font-semibold text-gray-800">Subscription Plan</h2>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Your current active plan details</p>
                            </div>

                            <div className="p-6 grid md:grid-cols-2 gap-6 items-center">
                                {/* Features */}
                                <div className="space-y-4">
                                    {[
                                        { icon: Server, text: 'High-Performance Server' },
                                        { icon: Globe, text: 'Domain Name Management' },
                                        { icon: HardDrive, text: 'Secure Cloud Storage' },
                                        { icon: Settings, text: 'System Fees & Maintenance' },
                                        { icon: ShieldCheck, text: 'Premium Service & Support' },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-700">
                                            <div className="p-2 rounded-lg bg-gray-50 text-blue-600 flex-shrink-0">
                                                <f.icon size={16} />
                                            </div>
                                            <span className="text-sm font-medium">{f.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Card */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
                                    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                            <Crown size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Subscription</p>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-lg font-bold text-gray-500">LKR</span>
                                            <span className="text-4xl font-black text-gray-900 tracking-tight">9,000</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-5">Billed monthly • Cancel anytime</p>
                                        <ul className="space-y-2 w-full text-left mb-6 border-t border-b border-gray-100 py-4">
                                            {['Dedicated Server Hosting', 'Premium Domain Name', 'Daily Cloud Backups', '24/7 Priority Support'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Check size={14} className="text-green-500 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
                                            Subscribe Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminProfile;
