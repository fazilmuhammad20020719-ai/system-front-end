import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Filter,
    Mail,
    Phone,
    Pencil,
    Trash2,
    Briefcase,
    ShieldCheck,
    Menu,
    Eye,
    LayoutGrid,
    List
} from 'lucide-react';
import Sidebar from './Sidebar';

const ManagementTeam = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    // -- VIEW MODE STATE (Default: Grid) --
    const [viewMode, setViewMode] = useState('grid');

    // Mock Data for Management Team
    const [members, setMembers] = useState([
        { id: 1, name: "Sheikh Al-Fazil", adminId: "ADM-001", position: "Principal", department: "Administration", email: "principal@college.edu", phone: "+94 77 111 2222", status: "Active", joinDate: "Jan 2015" },
        { id: 2, name: "Mr. Abdul Raheem", adminId: "ADM-002", position: "Vice Principal", department: "Academics", email: "raheem@college.edu", phone: "+94 77 333 4444", status: "Active", joinDate: "Mar 2016" },
        { id: 3, name: "Ms. Zainab Ali", adminId: "ADM-003", position: "Registrar", department: "Admissions", email: "registrar@college.edu", phone: "+94 71 555 6666", status: "On Leave", joinDate: "Jun 2018" },
        { id: 4, name: "Mr. Farook Hasan", adminId: "ADM-004", position: "Bursar", department: "Accounts & Finance", email: "accounts@college.edu", phone: "+94 75 999 8888", status: "Active", joinDate: "Feb 2019" },
    ]);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.adminId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || member.department === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"><Menu size={20} /></button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Management Team</h1>
                            <p className="text-sm text-gray-500">Administration & Staff Directory</p>
                        </div>
                    </div>
                    <button className="bg-[#EB8A33] hover:bg-[#d67b2b] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95">
                        <Plus size={20} /> Add Member
                    </button>
                </header>

                <main className="p-8">

                    {/* SEARCH & FILTER TOOLBAR */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] transition-all" />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto items-center">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 mr-2">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`} title="List View"><List size={18} /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`} title="Grid View"><LayoutGrid size={18} /></button>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white">
                                <Filter size={18} className="text-gray-500" />
                                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="text-gray-600 focus:outline-none cursor-pointer bg-white text-sm">
                                    <option value="All">All Departments</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Academics">Academics</option>
                                    <option value="Admissions">Admissions</option>
                                    <option value="Accounts & Finance">Accounts & Finance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TEAM CONTENT */}
                    {viewMode === 'list' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Member Profile</th>
                                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Position & Dept</th>
                                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{member.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{member.adminId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700"><Briefcase size={14} className="text-[#EB8A33]" /> {member.position}</div>
                                                    <span className="text-xs text-gray-500 ml-5.5">{member.department}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={12} className="text-gray-400" /> {member.email}</div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600"><Phone size={12} className="text-gray-400" /> {member.phone}</div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${member.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${member.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-all duration-200">
                                                    <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="View Details"><Eye size={16} /></button>
                                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit"><Pencil size={16} /></button>
                                                    <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Remove"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* --- GRID VIEW (Updated to 4 columns on XL) --- */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{member.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono">{member.adminId}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {member.status}
                                        </span>
                                    </div>
                                    <div className="space-y-3 mb-5 flex-1">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Position</p>
                                            <p className="text-sm font-medium text-gray-800">{member.position}</p>
                                            <p className="text-xs text-[#EB8A33] font-medium">{member.department}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" /> <span className="truncate" title={member.email}>{member.email}</span></div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" /> <span>{member.phone}</span></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 mt-auto">
                                        <button className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"><Eye size={14} /> View</button>
                                        <button className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"><Pencil size={14} /> Edit</button>
                                        <button onClick={() => handleDelete(member.id)} className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"><Trash2 size={14} /> Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ManagementTeam;