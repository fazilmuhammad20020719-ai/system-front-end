import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, DollarSign, AlertTriangle, CheckCircle, Clock,
    Search, Server, Power, LogOut, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // --- MOCK DATABASE ---
    const [clients, setClients] = useState([
        { id: 1, name: "Faizanul Madeeba Arabic College", plan: "Premium", status: "Active", daysLeft: 12, pending: 0, revenue: 5000 },
        { id: 2, name: "Oxford International School", plan: "Basic", status: "Overdue", daysLeft: -5, pending: 3000, revenue: 3000 },
        { id: 3, name: "Royal Institute", plan: "Enterprise", status: "Active", daysLeft: 28, pending: 0, revenue: 10000 },
    ]);

    // --- LOGIC ---
    const handleLogout = () => {
        // localStorage.removeItem('saas_token'); // If you had auth
        navigate('/login');
    };

    const handlePayment = (e, id) => {
        e.stopPropagation(); // Prevent row click
        const amount = prompt("Enter Amount Received (LKR):");
        if (amount) {
            setClients(clients.map(c => c.id === id ? { ...c, status: 'Active', daysLeft: 30, pending: 0 } : c));
        }
    };

    const handleBlock = (e, id) => {
        e.stopPropagation(); // Prevent row click
        if (window.confirm("BLOCK this client? They will lose access immediately.")) {
            setClients(clients.map(c => c.id === id ? { ...c, status: 'Blocked' } : c));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">

            {/* --- TOP BAR --- */}
            <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
                        <Server size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide">SaaS Admin</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Master Control</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-7xl mx-auto space-y-8">

                {/* --- STATS ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Clients" value={clients.length} icon={Users} color="text-blue-400" />
                    <StatCard title="Active Systems" value={clients.filter(c => c.status === 'Active').length} icon={CheckCircle} color="text-green-400" />
                    <StatCard title="Monthly Revenue" value={`LKR ${clients.reduce((a, c) => a + c.revenue, 0)}`} icon={DollarSign} color="text-indigo-400" />
                    <StatCard title="Pending Dues" value={`LKR ${clients.reduce((a, c) => a + c.pending, 0)}`} icon={AlertTriangle} color="text-red-400" />
                </div>

                {/* --- CLIENT TABLE --- */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="font-bold text-white">Client Database</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text" placeholder="Search..."
                                className="bg-slate-900 border border-slate-600 text-sm rounded-lg pl-9 pr-4 py-2 text-white focus:border-indigo-500 outline-none"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-slate-400 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Subscription</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                                    <tr
                                        key={client.id}
                                        onClick={() => navigate('/client/' + client.id)}
                                        className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white text-base">{client.name}</p>
                                            <p className="text-slate-400 text-xs">{client.plan} Plan</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${client.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                client.status === 'Blocked' ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
                                                    'bg-red-500/10 border-red-500/20 text-red-400'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${client.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="font-medium">{client.status}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                                                <Clock size={12} /> {client.daysLeft} Days
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-300">
                                            {client.pending > 0 ? (
                                                <span className="text-red-400">Due: {client.pending}</span>
                                            ) : (
                                                <span className="text-green-400">Paid</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={(e) => handlePayment(e, client.id)} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors" title="Add Payment">
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button onClick={(e) => handleBlock(e, client.id)} className="p-2 bg-slate-700 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 border border-slate-600 transition-all" title="Block">
                                                    <Power size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-slate-900 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase">{title}</p>
            <h4 className="text-2xl font-bold text-white">{value}</h4>
        </div>
    </div>
);

export default Dashboard;