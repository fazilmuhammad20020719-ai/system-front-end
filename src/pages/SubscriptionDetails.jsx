import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Calendar, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const SubscriptionDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Subscription');

    // MOCK DATA - Should fetch based on ID
    const client = {
        id: id,
        name: id === '1' ? "Faizanul Madeeba Arabic College" : "Oxford International School",
        domain: id === '1' ? "fmac.mathersa.com" : "oxford.mathersa.com",
        status: id === '1' ? "Active" : "Overdue"
    };

    const subscription = {
        plan: "Enterprise Annual",
        amount: "$499.00",
        billingCycle: "Yearly",
        startDate: "2024-01-15",
        nextBilling: "2025-01-15",
        status: client.status
    };

    const paymentHistory = [
        { id: 1, date: "2024-01-15", amount: "$499.00", status: "Paid", invoice: "INV-2024-001" },
        { id: 2, date: "2023-01-15", amount: "$450.00", status: "Paid", invoice: "INV-2023-001" },
    ];

    return (
        <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
            {/* Modular Sidebar */}
            <Sidebar client={client} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Modular Topbar */}
                <Topbar activeTab="Subscription Details" />

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Plan Overview Card */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">Current Plan</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${subscription.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-400">{subscription.plan} • {subscription.billingCycle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-white">{subscription.amount}</p>
                                    <p className="text-slate-500 text-sm">per year</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mt-8 border-t border-slate-700/50 pt-8 relative z-10">
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Billing Cycle Started</p>
                                    <div className="flex items-center gap-2 text-slate-200 font-medium">
                                        <Calendar size={16} className="text-indigo-400" />
                                        {subscription.startDate}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Next Payment Due</p>
                                    <div className="flex items-center gap-2 text-slate-200 font-medium">
                                        <RefreshCw size={16} className={subscription.status === 'Active' ? "text-green-400" : "text-red-400"} />
                                        {subscription.nextBilling}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20">
                                    Upgrade Plan
                                </button>
                                <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2.5 rounded-xl font-medium transition-colors border border-slate-600">
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>

                        {/* Recent Invoices */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="font-bold text-lg text-white">Billing History</h3>
                            </div>
                            <div className="p-2">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {paymentHistory.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="p-4 text-slate-300 text-sm font-medium">{inv.date}</td>
                                                <td className="p-4 text-slate-400 text-sm">{inv.invoice}</td>
                                                <td className="p-4 text-slate-300 text-sm">{inv.amount}</td>
                                                <td className="p-4">
                                                    <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-2 py-1 rounded text-xs font-bold w-fit border border-green-500/20">
                                                        <CheckCircle size={12} /> {inv.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline">Download</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubscriptionDetails;
