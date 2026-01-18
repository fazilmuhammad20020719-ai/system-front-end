import { Search, Filter, X, List, LayoutGrid } from 'lucide-react';

const TeachersFilters = ({
    searchTerm, setSearchTerm,
    selectedProgram, setSelectedProgram, programs = [],
    selectedSubject, setSelectedSubject, subjects = [],
    selectedCategory, setSelectedCategory,
    selectedStatus, setSelectedStatus,
    viewMode, setViewMode,
    clearFilters
}) => {
    // Dynamic Filter Logic (இதை Return-க்கு மேலே சேர்க்கவும்)
    const filteredSubjects = selectedProgram === "All"
        ? subjects
        : subjects.filter(sub => {
            const progObj = programs.find(p => p.name === selectedProgram);
            return progObj && sub.program_id === progObj.id;
        });
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">

                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name or Employee ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EB8A33] transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {/* Program Filter (Dynamic) */}
                        <div className="relative min-w-[150px]">
                            <select
                                value={selectedProgram}
                                onChange={(e) => {
                                    setSelectedProgram(e.target.value);
                                    setSelectedSubject("All"); // Program மாறினால் Subject Reset
                                }}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                            >
                                <option value="All">All Programs</option>
                                {programs.map(prog => (
                                    <option key={prog.id} value={prog.name}>{prog.name}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* Subject Filter (Dynamic) */}
                        <div className="relative min-w-[150px]">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                            >
                                <option value="All">All Subjects</option>
                                {filteredSubjects.map(sub => (
                                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                                ))}
                            </select>
                            {/* Book Icon requires import { BookOpen } from 'lucide-react' */}
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* Category Filter */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                            >
                                <option value="All">All Categories</option>
                                <option value="Sharia">Sharia</option>
                                <option value="Academic">Academic</option>
                                <option value="Both">Both</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[140px]">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Resigned">Resigned</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        {(searchTerm || selectedProgram !== "All" || selectedSubject !== "All" || selectedCategory !== "All" || selectedStatus !== "All") && (
                            <button onClick={clearFilters} className="px-3 py-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Clear Filters">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 self-end md:self-auto ml-4">
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`} title="List View"><List size={18} /></button>
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`} title="Grid View"><LayoutGrid size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default TeachersFilters;
