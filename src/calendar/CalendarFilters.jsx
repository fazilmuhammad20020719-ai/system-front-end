import { Filter } from 'lucide-react';

const CalendarFilters = ({ currentDate, onDateChange, searchTerm, onSearchChange }) => {
    // Format date for input value (YYYY-MM)
    const monthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const handleMonthChange = (e) => {
        const [y, m] = e.target.value.split('-');
        onDateChange(parseInt(y), parseInt(m) - 1);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Month Selection</label>
                <input
                    type="month"
                    value={monthValue}
                    onChange={handleMonthChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex-[2] min-w-[200px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Search Notes</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
            </div>
            {/* Removed Apply button as filtering is real-time/reactive now */}
        </div>
    );
};

export default CalendarFilters;
