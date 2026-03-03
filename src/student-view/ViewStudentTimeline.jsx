import React, { useState, useMemo } from 'react';
import {
    Activity, CheckCircle, AlertTriangle, Info,
    Lock, Eye, Filter, Calendar, Search,
    Paperclip, Mic, Image as ImageIcon, FileText,
    MessageSquare, ChevronDown, Check, Clock,
    MoreHorizontal, User
} from 'lucide-react';

const ViewStudentTimeline = () => {
    // 1. Mock Data (Ideally fetched from API)
    const [timelineData, setTimelineData] = useState([
        {
            id: 1,
            date: '2025-06-15',
            type: 'Positive', // Positive, Warning, Notice, Achievement, Joining
            severity: 'High', // Low, Medium, High
            title: 'Awarded: Qiraat Winner',
            description: '1st Place in Inter-class competition. Demonstrated excellent Tajweed.',
            author: 'Sheikh Ahmed',
            visibility: 'Parent', // Parent, Internal
            actionRequired: false,
            actionStatus: 'Done',
            attachments: [
                { type: 'image', url: '/certificate.jpg', name: 'Certificate.jpg' }
            ],
            comments: [
                { id: 101, author: 'Admin', text: 'MashaAllah, well done!', date: '2025-06-16' }
            ]
        },
        {
            id: 2,
            date: '2025-05-20',
            type: 'Warning',
            severity: 'Low',
            title: 'Repeated Late Arrival',
            description: 'Arrived late for 3 consecutive days. Please ensure timely drop-off.',
            author: 'Ustadh Bilal',
            visibility: 'Parent',
            actionRequired: true,
            actionStatus: 'Pending',
            followUpDate: '2025-05-27',
            attachments: [],
            comments: []
        },
        {
            id: 3,
            date: '2025-04-10',
            type: 'Notice',
            severity: 'Medium',
            title: 'Parent Meeting Scheduled',
            description: 'Discussing progress in Hifz. Both parents requested to attend.',
            author: 'Admin Office',
            visibility: 'Internal', // Staff Only
            actionRequired: true,
            actionStatus: 'Pending',
            assignedTo: 'Sheikh Ahmed',
            attachments: [],
            comments: []
        },
        {
            id: 4,
            date: '2025-03-01',
            type: 'Achievement',
            severity: 'High',
            title: 'Exam: 1st Term Passed',
            description: 'Passed with Grade A (88%). Strong performance in Fiqh and Aqeedah.',
            author: 'Examination Board',
            visibility: 'Parent',
            actionRequired: false,
            actionStatus: 'Done',
            attachments: [
                { type: 'pdf', url: '/report_card.pdf', name: 'Report_Card_Term1.pdf' }
            ],
            comments: []
        },
        {
            id: 5,
            date: '2025-01-15',
            type: 'Joining',
            severity: 'Medium',
            title: 'Admission Joined',
            description: 'Enrolled in Hifz ul Quran (Grade 1). Welcome to the institute!',
            author: 'System',
            visibility: 'Parent',
            actionRequired: false,
            actionStatus: 'Done',
            attachments: [],
            comments: []
        }
    ]);

    // 2. Filter States
    const [filterType, setFilterType] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [showInternal, setShowInternal] = useState(true); // Toggle for staff view
    const [searchQuery, setSearchQuery] = useState('');

    // 3. Computed Logic
    const filteredTimeline = useMemo(() => {
        return timelineData.filter(item => {
            const matchesType = filterType === 'All' || item.type === filterType;
            const matchesSeverity = filterSeverity === 'All' || item.severity === filterSeverity;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVisibility = showInternal ? true : item.visibility === 'Parent';

            return matchesType && matchesSeverity && matchesSearch && matchesVisibility;
        });
    }, [timelineData, filterType, filterSeverity, searchQuery, showInternal]);

    const stats = useMemo(() => {
        return {
            positives: timelineData.filter(i => ['Positive', 'Achievement'].includes(i.type)).length,
            warnings: timelineData.filter(i => i.type === 'Warning').length,
            notices: timelineData.filter(i => i.type === 'Notice').length,
            pendingActions: timelineData.filter(i => i.actionRequired && i.actionStatus === 'Pending').length
        };
    }, [timelineData]);

    // Helper: Severity Styles
    const getSeverityStyles = (type, severity) => {
        // Base colors
        let colors = { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'text-gray-400' };

        if (['Positive', 'Achievement'].includes(type)) {
            colors = { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
        } else if (type === 'Warning') {
            if (severity === 'High') colors = { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
            else colors = { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' };
        } else if (type === 'Notice') {
            colors = { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' };
        } else if (type === 'Joining') {
            colors = { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' };
        }
        return colors;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Positive': return CheckCircle;
            case 'Achievement': return Activity;
            case 'Warning': return AlertTriangle;
            case 'Notice': return Info;
            case 'Joining': return User;
            default: return FileText;
        }
    };

    return (
        <div className="space-y-6">

            {/* 1. Summary Cards (Gold Feature) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard label="Positives" count={stats.positives} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
                <SummaryCard label="Warnings" count={stats.warnings} icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
                <SummaryCard label="Notices" count={stats.notices} icon={Info} color="text-blue-600" bg="bg-blue-50" />
                <SummaryCard label="Actions Pending" count={stats.pendingActions} icon={Clock} color="text-orange-600" bg="bg-orange-50" />
            </div>

            {/* 2. Filters & Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10 transition-shadow">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {/* Activity Type Filter */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option value="All">All Activities</option>
                            <option value="Positive">Positive</option>
                            <option value="Warning">Warning</option>
                            <option value="Notice">Notice</option>
                            <option value="Achievement">Achievement</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Visibility Filter */}
                    <button
                        onClick={() => setShowInternal(!showInternal)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showInternal
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                            }`}
                        title={showInternal ? "Showing Internal Notes" : "Hiding Internal Notes"}
                    >
                        {showInternal ? <UnlockIcon size={16} /> : <Lock size={16} />}
                        {showInternal ? 'Staff View' : 'Parent View'}
                    </button>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search timeline..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* 3. Timeline List */}
            <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-8 pb-8">
                {filteredTimeline.length > 0 ? (
                    filteredTimeline.map((item) => {
                        const styles = getSeverityStyles(item.type, item.severity);
                        const Icon = getTypeIcon(item.type);

                        return (
                            <div key={item.id} className="relative pl-8 group">
                                {/* Timeline Dot */}
                                <span className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors ${item.type === 'Warning' ? 'bg-red-500' :
                                    item.type === 'Notice' ? 'bg-blue-500' :
                                        'bg-green-500'
                                    }`}></span>

                                <div className={`bg-white rounded-xl border ${styles.border} shadow-sm hover:shadow-md transition-shadow p-5`}>
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1.5 rounded-lg ${styles.bg} ${styles.icon}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{item.date} • {item.author}</p>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-2">
                                            {item.visibility === 'Internal' && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 border border-gray-200">
                                                    <Lock size={10} /> Internal
                                                </span>
                                            )}
                                            {item.actionRequired && (
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 border ${item.actionStatus === 'Pending'
                                                    ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                                                    : 'bg-green-50 text-green-600 border-green-200'
                                                    }`}>
                                                    {item.actionStatus === 'Pending' ? <Clock size={10} /> : <Check size={10} />}
                                                    {item.actionStatus === 'Pending' ? 'Action Req' : 'Resolved'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pl-[38px]">
                                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                            {item.description}
                                        </p>

                                        {/* Action Required Details */}
                                        {item.actionRequired && item.actionStatus === 'Pending' && (
                                            <div className="mb-4 bg-orange-50/50 border border-orange-100 rounded-lg p-3 flex gap-4 text-xs text-orange-800">
                                                {item.followUpDate && (
                                                    <span className="flex items-center gap-1 font-medium"><Calendar size={12} /> Due: {item.followUpDate}</span>
                                                )}
                                                {item.assignedTo && (
                                                    <span className="flex items-center gap-1 font-medium"><User size={12} /> Assigned: {item.assignedTo}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Attachments */}
                                        {item.attachments && item.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {item.attachments.map((att, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                                                        {att.type === 'image' ? <ImageIcon size={14} className="text-purple-500" /> :
                                                            att.type === 'pdf' ? <FileText size={14} className="text-red-500" /> :
                                                                <Paperclip size={14} />}
                                                        {att.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                                            <div className="flex gap-4">
                                                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors">
                                                    <MessageSquare size={14} /> {item.comments.length} Comments
                                                </button>
                                                {item.type === 'Warning' && (
                                                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors">
                                                        <AlertTriangle size={14} /> Acknowledge
                                                    </button>
                                                )}
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 pl-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-gray-500 font-medium">No timeline entries found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component: Summary Card
const SummaryCard = ({ label, count, icon: Icon, color, bg }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <h4 className="text-2xl font-bold text-gray-800">{count}</h4>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        </div>
    </div>
);

// Helper Icon for Unlock
const UnlockIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
);

export default ViewStudentTimeline;