import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Users, Activity, BookOpen, Server, Settings, Database, UploadCloud, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ClientDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Overview');

    // Update state if location state changes (for internal navigation consistency)
    React.useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // MOCK DATA - In a real app, fetch based on ID
    const client = {
        id: id,
        name: id === '1' ? "Faizanul Madeeba Arabic College" : "Oxford International School",
        domain: id === '1' ? "fmac.mathersa.com" : "oxford.mathersa.com",
        status: id === '1' ? "Active" : "Overdue"
    };

    const usageData = [
        { name: 'Mon', storage: 1.2, bandwidth: 2.4 },
        { name: 'Tue', storage: 1.5, bandwidth: 3.1 },
        { name: 'Wed', storage: 1.8, bandwidth: 2.8 },
        { name: 'Thu', storage: 2.1, bandwidth: 3.5 },
        { name: 'Fri', storage: 2.4, bandwidth: 4.2 },
        { name: 'Sat', storage: 2.2, bandwidth: 3.8 },
        { name: 'Sun', storage: 2.5, bandwidth: 4.0 },
    ];

    const activityData = [
        { time: '00:00', users: 12 },
        { time: '04:00', users: 5 },
        { time: '08:00', users: 150 },
        { time: '12:00', users: 320 },
        { time: '16:00', users: 280 },
        { time: '20:00', users: 90 },
        { time: '23:59', users: 45 },
    ];

    const subscriptionDetails = {
        plan: "Enterprise Scale",
        fees: "$499.00/mo",
        nextBill: "Apr 15, 2024",
        status: "Paid"
    };

    return (
        <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">

            {/* Modular Sidebar */}
            <Sidebar client={client} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Modular Topbar */}
                <Topbar activeTab={activeTab} />

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'Overview' && (
                        <div className="space-y-6">
                            {/* STAT CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatsCard title="Total Database Tables" value="45" icon={<Database />} color="blue" />
                                <StatsCard title="Total Uploads" value="850 Files (15 GB)" icon={<UploadCloud />} color="purple" />
                                <StatsCard title="Subscription Days" value="12 Days Left" icon={<Calendar />} color="green" />
                                <StatsCard title="3.8 GB Free Space" value="1.2 GB / 5.0 GB" icon={<Server />} color="orange" />
                            </div>

                            {/* ANALYTICS SECTION */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Subscription & Usage Summary */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-1">
                                    <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                                        <DollarSign className="text-emerald-400" size={20} /> Subscription
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Current Plan</p>
                                            <p className="text-lg font-bold text-white">{subscriptionDetails.plan}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fee</p>
                                                <p className="text-lg font-bold text-emerald-400">{subscriptionDetails.fees}</p>
                                            </div>
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Next Bill</p>
                                                <p className="text-sm font-bold text-slate-200">{subscriptionDetails.nextBill}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-slate-700/50">
                                            <p className="text-xs text-slate-400 mb-2">Resource Usage Limit</p>
                                            <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>65% Used</span>
                                                <span>100 GB Limit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CLIENT RESOURCE USAGE BAR CHART */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
                                    <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                        <Activity className="text-indigo-400" size={20} /> Resource Usage (Daily)
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                    itemStyle={{ color: '#e2e8f0' }}
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                                <Bar dataKey="bandwidth" name="Bandwidth (GB)" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                <Bar dataKey="storage" name="Storage (GB)" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* RECENT ACTIVITY & LINE CHART */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                                    <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="text-orange-400" size={20} /> Active Users (Today)
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                    itemStyle={{ color: '#e2e8f0' }}
                                                />
                                                <Line type="monotone" dataKey="users" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24' }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                                    <h3 className="font-bold text-lg text-white mb-4">Live System Activity</h3>
                                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-700/50 rounded-xl transition-colors border-b border-slate-700/50 last:border-0">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                                                    LOG
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 truncate">New exam results published for Grade {10 + i}</p>
                                                    <p className="text-xs text-slate-500">User: Admin • {i * 15} mins ago</p>
                                                </div>
                                                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 shrink-0">Audit</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'Overview' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                            <Settings size={64} className="mb-4" />
                            <p className="text-xl font-medium">Coming Soon</p>
                            <p className="text-sm">This module is under development.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

const StatsCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green: "text-green-400 bg-green-500/10 border-green-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    };

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
            </div>
            <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
        </div>
    );
};

export default ClientDetails;
