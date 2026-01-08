import { Filter } from 'lucide-react';

const CalendarFilters = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Month Selection</label>
                <input type="date" defaultValue="2025-12-25" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex-[2] min-w-[200px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Search Notes</label>
                <input type="text" placeholder="Keyword..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <button className="px-6 py-2.5 bg-[#1E293B] hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                <Filter size={16} /> Apply
            </button>
        </div>
    );
};

export default CalendarFilters;
