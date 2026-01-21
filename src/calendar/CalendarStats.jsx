const CalendarStats = ({ events }) => {
    // Filter for urgent events
    const urgentCount = events.filter(e => e.type === 'urgent').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Notes</h4>
                    <span className="text-xs text-gray-400">This Month</span>
                </div>
                <span className="text-3xl font-bold text-gray-800">{events.length}</span>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">High Priority</h4>
                    <span className="text-xs text-gray-400">Action Required</span>
                </div>
                <span className="text-3xl font-bold text-red-600">
                    {urgentCount}
                </span>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Date</h4>
                    <span className="text-xs text-gray-400">Today</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
            </div>
        </div>
    );
};

export default CalendarStats;
