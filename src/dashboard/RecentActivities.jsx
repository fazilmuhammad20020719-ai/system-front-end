import { Clock, UserPlus, FileText, Upload } from 'lucide-react';

// Component: Activity List Item
const ActivityItem = ({ icon: Icon, iconBg, iconColor, title, desc, time }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg cursor-default">
        <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-1`}>
                <Icon className={iconColor} size={18} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
        </div>
        <span className="text-xs font-medium text-gray-400 whitespace-nowrap mt-2">{time}</span>
    </div>
);

const RecentActivities = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <div className="flex items-center gap-2 mb-8">
                <Clock className="text-gray-700" size={20} strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-800">Recent Office Activities</h3>
            </div>

            <div className="space-y-0">
                <ActivityItem
                    icon={UserPlus}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                    title="New Admission"
                    desc="agdf - Qiraat Course 1st Year"
                    time="25 Dec, 01:41 PM"
                />
                <ActivityItem
                    icon={FileText}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    title="Document Uploaded"
                    desc="File Birth Certificate (Student File)"
                    time="25 Dec, 01:41 PM"
                />
                <ActivityItem
                    icon={Upload}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    title="Document Uploaded"
                    desc="File ID Card/NIC (Student File)"
                    time="25 Dec, 01:41 PM"
                />
                <ActivityItem
                    icon={Upload}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    title="Document Uploaded"
                    desc="File School Leaving Cert (Student File)"
                    time="25 Dec, 01:41 PM"
                />
                <ActivityItem
                    icon={Upload}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    title="Document Uploaded"
                    desc="File Medical Report (Student File)"
                    time="25 Dec, 01:41 PM"
                />
            </div>
        </div>
    );
};

export default RecentActivities;
