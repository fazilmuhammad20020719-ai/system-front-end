import { AlertTriangle, Calendar, CreditCard, Bell, Clock } from 'lucide-react';

const UpcomingAlerts = () => {
    // Helper function to get date string (YYYY-MM-DD) for demo purposes
    const getFutureDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // SAMPLE DATA: Ungal backend data-vai inge podalam.
    // Mukkiyam: 'daysFromNow' field ai vaithu opacity control seiyapadukirathu.
    const alerts = [
        {
            id: 1,
            title: "Salary Payment Due",
            message: "Teachers Salary for October Month",
            date: getFutureDate(0), // Today
            daysFromNow: 0,
            icon: CreditCard,
            color: "text-red-600",
            borderColor: "border-red-200",
            bgColor: "bg-red-50"
        },
        {
            id: 2,
            title: "Electricity Bill",
            message: "Last date to pay monthly bill",
            date: getFutureDate(1), // Tomorrow
            daysFromNow: 1,
            icon: AlertTriangle,
            color: "text-orange-600",
            borderColor: "border-orange-200",
            bgColor: "bg-orange-50"
        },
        {
            id: 3,
            title: "Student Fees Collection",
            message: "10 Students pending fees deadline",
            date: getFutureDate(2), // In 2 Days
            daysFromNow: 2,
            icon: Bell,
            color: "text-blue-600",
            borderColor: "border-blue-200",
            bgColor: "bg-blue-50"
        },
        {
            id: 4,
            title: "Staff Meeting",
            message: "Monthly preparation meeting",
            date: getFutureDate(3), // In 3 Days
            daysFromNow: 3,
            icon: Calendar,
            color: "text-gray-600",
            borderColor: "border-gray-200",
            bgColor: "bg-gray-50"
        }
    ];

    // OPACITY CALCULATION LOGIC
    const getOpacityClass = (days) => {
        switch (days) {
            case 0: return "opacity-100 scale-100 shadow-md"; // Today: Full visible, Highlighted
            case 1: return "opacity-80";  // Tomorrow
            case 2: return "opacity-60";  // 2 Days left
            case 3: return "opacity-40 grayscale-[50%]";  // 3 Days left (Faded)
            default: return "hidden";     // Hide others
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="text-indigo-600" size={20} strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-800">Upcoming Alerts & Reminders</h3>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`
                            ${getOpacityClass(alert.daysFromNow)} 
                            ${alert.bgColor} ${alert.borderColor}
                            border rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:opacity-100 hover:scale-[1.01] hover:shadow-sm cursor-default
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-full bg-white ${alert.color} shadow-sm shrink-0`}>
                                <alert.icon size={20} />
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${alert.daysFromNow === 0 ? 'text-gray-900 text-base' : 'text-gray-700'}`}>
                                    {alert.title}
                                    {alert.daysFromNow === 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white bg-red-500 rounded-full">Today</span>
                                    )}
                                </h4>
                                <p className="text-xs text-gray-600 font-medium mt-0.5">{alert.message}</p>
                            </div>
                        </div>

                        {/* DATE DISPLAY */}
                        <div className="text-right shrink-0 ml-4">
                            <div className="flex items-center gap-1 justify-end text-gray-500">
                                <Clock size={12} />
                                <span className="text-[10px] font-semibold uppercase tracking-wide">
                                    {alert.daysFromNow === 0 ? 'Due Today' : `${alert.daysFromNow} Days Left`}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-700 mt-0.5">{alert.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingAlerts;