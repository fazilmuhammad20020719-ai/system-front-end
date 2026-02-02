import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Activity, BookOpen, Server, Settings, Database, UploadCloud, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ClientDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Overview');

    // MOCK DATA - In a real app, fetch based on ID
    const client = {
        id: id,
        name: id === '1' ? "Faizanul Madeeba Arabic College" : "Oxford International School",
        domain: id === '1' ? "fmac.mathersa.com" : "oxford.mathersa.com",
        status: id === '1' ? "Active" : "Overdue"
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

                            {/* RECENT ACTIVITY */}
                            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                                <h3 className="font-bold text-lg text-white mb-4">Live System Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-700/50 rounded-xl transition-colors border-b border-slate-700/50 last:border-0">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                LOG
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-200">New exam results published for Grade {10 + i}</p>
                                                <p className="text-xs text-slate-500">User: Admin • {i * 15} mins ago</p>
                                            </div>
                                            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">Audit</span>
                                        </div>
                                    ))}
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
