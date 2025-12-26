import { useState } from 'react';
import {
    Layers,
    Plus,
    Search,
    MoreVertical,
    BookOpen,
    Users,
    Clock,
    GraduationCap,
    Edit,
    Trash2,
    X,
    Filter,
    Menu
} from 'lucide-react';
import Sidebar from './Sidebar';

const Programs = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Inactive

    // -- MODAL STATE --
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);

    // -- FORM STATE --
    const [formData, setFormData] = useState({
        name: "",
        head: "",
        duration: "",
        fee: "",
        status: "Active"
    });

    // -- MOCK DATA --
    const [programs, setPrograms] = useState([
        { id: 1, name: "Hifz Class", head: "Sheikh Abdullah", duration: "3 Years", students: 120, fees: "Free", status: "Active", color: "bg-emerald-100 text-emerald-600" },
        { id: 2, name: "Al-Alim Course", head: "Mufti Rahman", duration: "7 Years", students: 85, fees: "Monthly", status: "Active", color: "bg-blue-100 text-blue-600" },
        { id: 3, name: "Al-Alimah Course", head: "Ustadha Fatima", duration: "5 Years", students: 60, fees: "Monthly", status: "Active", color: "bg-purple-100 text-purple-600" },
        { id: 4, name: "Qiraat Special", head: "Qari Yaseen", duration: "2 Years", students: 25, fees: "One-time", status: "Inactive", color: "bg-orange-100 text-orange-600" },
        { id: 5, name: "Arabic Language", head: "Dr. Kareem", duration: "1 Year", students: 40, fees: "Monthly", status: "Active", color: "bg-teal-100 text-teal-600" },
    ]);

    // -- HANDLERS --
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.head.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || program.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (program = null) => {
        if (program) {
            setIsEditing(true);
            setCurrentProgram(program);
            setFormData({
                name: program.name,
                head: program.head,
                duration: program.duration,
                fee: program.fees,
                status: program.status
            });
        } else {
            setIsEditing(false);
            setCurrentProgram(null);
            setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setPrograms(prev => prev.map(p => p.id === currentProgram.id ? {
                ...p,
                name: formData.name,
                head: formData.head,
                duration: formData.duration,
                fees: formData.fee,
                status: formData.status
            } : p));
        } else {
            const newProgram = {
                id: Date.now(),
                name: formData.name,
                head: formData.head,
                duration: formData.duration,
                students: 0,
                fees: formData.fee,
                status: formData.status,
                color: "bg-gray-100 text-gray-600" // Default color
            };
            setPrograms([...programs, newProgram]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this program?")) {
            setPrograms(programs.filter(p => p.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* --- HEADER --- */}
                <header className="px-6 py-5 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Academic Programs</h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Manage courses, departments, and curriculum details.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-[#ea8933] hover:bg-[#d97c2a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} /> Add Program
                        </button>
                    </div>
                </header>

                <main className="p-4 md:p-6 lg:p-8">

                    {/* --- FILTERS --- */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search programs or heads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#ea8933] transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full md:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#ea8933]"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* --- PROGRAMS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredPrograms.map((program) => (
                            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${program.color}`}>
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="dropdown relative">
                                            <button className="text-gray-300 hover:text-gray-600 p-1">
                                                <MoreVertical size={20} />
                                            </button>
                                            {/* Action Buttons Overlay (Hidden by default, shown on hover group) */}
                                            <div className="absolute right-0 top-0 flex flex-col gap-1 bg-white shadow-lg border border-gray-100 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button onClick={() => handleOpenModal(program)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(program.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{program.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <span className="font-medium text-gray-400">Head:</span> {program.head}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Clock size={14} /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Duration</p>
                                                <p className="text-sm font-semibold text-gray-700">{program.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><Users size={14} /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Students</p>
                                                <p className="text-sm font-semibold text-gray-700">{program.students}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {program.status}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                            Fees: {program.fees}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPrograms.length === 0 && (
                        <div className="text-center py-12">
                            <Layers size={48} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400">No programs found matching your search.</p>
                        </div>
                    )}

                </main>
            </div>

            {/* --- ADD/EDIT MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Program' : 'Add New Program'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Program Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                    placeholder="e.g. Hifz Class"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Head of Dept</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.head}
                                        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        placeholder="Teacher Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933]"
                                        placeholder="e.g. 3 Years"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Fee Structure</label>
                                    <select
                                        value={formData.fee}
                                        onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                    >
                                        <option value="">Select Fees</option>
                                        <option value="Free">Free</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="One-time">One-time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea8933] bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#ea8933] text-white font-bold hover:bg-[#d97c2a]">Save Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Programs;