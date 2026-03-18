import React from 'react';

const AssignSidebar = ({
    filterProgram,
    setFilterProgram,
    programOptions,
    searchTerm,
    setSearchTerm,
    filteredDropdown,
    selectedStudentIds,
    setSelectedStudentIds,
    assignedIds,
    handleAssignStudent
}) => {
    return (
        <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-5">
                    <h2 className="text-white font-bold text-lg uppercase">Assign Student</h2>
                </div>
                <div className="px-4 pt-4 space-y-3">
                    <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm uppercase">
                        <option value="">ALL PROGRAMS</option>
                        {programOptions.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                    </select>
                    <input type="text" placeholder="SEARCH NAME OR ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 uppercase" />
                </div>
                <div className="px-4 py-3 max-h-60 overflow-y-auto mt-2">
                    {filteredDropdown.map(s => {
                        const isAssigned = assignedIds.has(String(s.id));
                        const isSelected = selectedStudentIds.includes(s.id);
                        return (
                            <div key={s.id} onClick={() => {
                                if (isAssigned) return;
                                setSelectedStudentIds(prev => 
                                    prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                                );
                            }} className={`p-2 cursor-pointer rounded-lg text-sm uppercase flex justify-between items-center ${isAssigned ? 'opacity-50' : isSelected ? 'bg-green-100 font-bold' : 'hover:bg-gray-100'}`}>
                                <span>{s.name.toUpperCase()} ({String(s.id).toUpperCase()})</span>
                                {isAssigned ? '✓' : isSelected ? '●' : ''}
                            </div>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleAssignStudent} disabled={selectedStudentIds.length === 0} className="w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 uppercase font-bold text-sm">
                        {selectedStudentIds.length > 0 ? `Add ${selectedStudentIds.length} to Tracker` : 'Add to Tracker'}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AssignSidebar;
