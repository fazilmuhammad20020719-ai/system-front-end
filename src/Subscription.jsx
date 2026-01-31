import React, { useState } from 'react';
import Sidebar from './Sidebar';
import {
    CreditCard, Clock, CheckCircle, AlertCircle, Calendar,
    Download, ChevronRight, History, Shield, Upload, FileText, Menu
} from 'lucide-react';

const Subscription = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // --- Mock Data ---
    const [currentPlan, setCurrentPlan] = useState({
        name: "College Management Pro",
        price: "LKR 5,000",
        status: "Overdue", // Payment நிலுவையில் உள்ளது என்று வைத்துக்கொள்வோம்
        activatedOn: "2025-12-01",
        expiresOn: "2026-01-01",
        daysLeft: 0,
        totalDays: 30
    });

    const [paymentMethod, setPaymentMethod] = useState('bank'); // Default to Bank Transfer
    const [uploading, setUploading] = useState(false);

    // Bank Payment Form State
    const [paymentForm, setPaymentForm] = useState({
        refNo: '',
        date: new Date().toISOString().split('T')[0],
        slip: null
    });

    const handleFileChange = (e) => {
        setPaymentForm({ ...paymentForm, slip: e.target.files[0] });
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        if (!paymentForm.refNo) return alert("Please enter the Reference Number");

        setUploading(true);

        // --- Backend Call Simulation ---
        setTimeout(() => {
            setUploading(false);
            alert("Payment Submitted! We will verify and activate your account shortly.");

            // Reset Form & Update Status (Simulated)
            setCurrentPlan(prev => ({ ...prev, status: 'Pending Verification' }));
            setPaymentForm({ refNo: '', date: '', slip: null });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <div className="p-6 max-w-5xl mx-auto space-y-8 w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Subscription & Billing</h1>
                                <p className="text-gray-500">Manual Payment Gateway (Bank Transfer)</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT: Plan Status */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status Card */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Current Plan</p>
                                        <h2 className="text-3xl font-bold">{currentPlan.name}</h2>
                                        <p className="text-2xl font-medium text-orange-400 mt-2">{currentPlan.price} <span className="text-sm text-slate-400">/ month</span></p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${currentPlan.status === 'Active' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                        currentPlan.status === 'Pending Verification' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                                            'bg-red-500/20 border-red-500 text-red-400'
                                        }`}>
                                        {currentPlan.status}
                                    </span>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-700/50 flex gap-8">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase">Expires On</p>
                                        <p className="font-mono">{currentPlan.expiresOn}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase">Days Left</p>
                                        <p className="font-mono">{currentPlan.daysLeft} Days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Instruction */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="text-[#ea8933]" /> How to Pay?
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-600 text-sm">
                                    <li>Transfer <strong>LKR 5,000</strong> to the bank account shown.</li>
                                    <li>Use your <strong>College Name</strong> as the reference.</li>
                                    <li>Take a <strong>screenshot</strong> or photo of the receipt.</li>
                                    <li>Fill the form on the right and submit.</li>
                                </ol>
                            </div>
                        </div>

                        {/* RIGHT: Payment Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg h-full">
                                <h3 className="font-bold text-gray-800 mb-4">Submit Payment Details</h3>

                                {/* 1. Bank Account Details */}
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
                                    <p className="text-xs text-orange-600 font-bold uppercase mb-2">Bank Details</p>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p><span className="font-medium">Bank:</span> Commercial Bank</p>
                                        <p><span className="font-medium">Branch:</span> Eravur</p>
                                        <p><span className="font-medium">Account Name:</span> S. Fazil Muhammad</p>
                                        <p><span className="font-medium font-mono text-lg text-gray-900">8002567890</span></p>
                                    </div>
                                </div>

                                {/* 2. Submission Form */}
                                {currentPlan.status === 'Pending Verification' ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <CheckCircle className="mx-auto text-green-500 mb-2" size={40} />
                                        <p className="text-gray-800 font-medium">Payment Submitted!</p>
                                        <p className="text-xs text-gray-500 mt-1">Waiting for admin approval.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitPayment} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Transfer Date</label>
                                            <input type="date" required
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#ea8933] outline-none"
                                                value={paymentForm.date} onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })} />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Reference No / Transaction ID</label>
                                            <input type="text" required placeholder="e.g. REF12345678"
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#ea8933] outline-none font-mono"
                                                value={paymentForm.refNo} onChange={e => setPaymentForm({ ...paymentForm, refNo: e.target.value })} />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Upload Receipt (Optional)</label>
                                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,application/pdf" />
                                                <Upload className="mx-auto text-gray-400 mb-2" size={20} />
                                                <span className="text-xs text-gray-500">{paymentForm.slip ? paymentForm.slip.name : "Click to upload slip"}</span>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={uploading}
                                            className="w-full py-3 bg-[#ea8933] hover:bg-[#d67b2b] text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex justify-center items-center gap-2">
                                            {uploading ? 'Submitting...' : 'Submit Payment'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;