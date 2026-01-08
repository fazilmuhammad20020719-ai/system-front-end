import { Search, Filter, X, List, LayoutGrid, Maximize2, Minimize2 } from 'lucide-react';

const StudentFilters = ({
    searchTerm, setSearchTerm,
    selectedYear, setSelectedYear,
    selectedBatch, setSelectedBatch, // NEW PROP
    selectedProgram, setSelectedProgram,
    selectedStatus, setSelectedStatus,
    viewMode, setViewMode,
    cardSize, setCardSize,
    academicYears,
    batchYears, // NEW DATA
    programs,
    clearFilters
}) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* 1. Search & Filters Group */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] transition-all"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide w-full md:w-auto">

                        {/* 1. PROGRAM FILTER */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <option value="">All Programs</option>
                                {programs.map(prog => <option key={prog} value={prog}>{prog}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* 2. BATCH YEAR FILTER (NEW) */}
                        <div className="relative min-w-[120px]">
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <option value="">Batch</option>
                                {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>



                        {/* 4. STATUS FILTER */}
                        <div className="relative min-w-[120px]">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#EB8A33] cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <option value="">Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* Clear Filters Button */}
                        {(searchTerm || selectedYear || selectedBatch || selectedProgram || selectedStatus) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                                title="Clear All Filters"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. View Controls */}
                <div className="flex items-center gap-3 self-end md:self-auto">

                    {/* Card Size Toggle (Only Visible in Grid Mode) */}
                    {viewMode === 'grid' && (
                        <div className="hidden sm:flex items-center bg-gray-50 rounded-lg border border-gray-200 h-[42px] px-1">
                            <button onClick={() => setCardSize('small')} className={`p-1.5 rounded-md transition-all ${cardSize === 'small' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-400 hover:text-gray-600'}`}><Minimize2 size={16} /></button>
                            <button onClick={() => setCardSize('large')} className={`p-1.5 rounded-md transition-all ${cardSize === 'large' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-400 hover:text-gray-600'}`}><Maximize2 size={16} /></button>
                        </div>
                    )}

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 h-[42px]">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`}><List size={18} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-[#EB8A33]' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid size={18} /></button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentFilters;