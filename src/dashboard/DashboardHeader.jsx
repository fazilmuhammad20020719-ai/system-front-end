import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Calendar, Bell, Search } from 'lucide-react';
import { API_URL } from '../config';


// MOCK PAGES DATA (Client-side routing only)
const PAGE_ROUTES = [
    { title: 'Dashboard', path: '/dashboard', type: 'Page' },
    { title: 'Calendar', path: '/calendar', type: 'Page' },
    { title: 'Students Directory', path: '/students', type: 'Page' },
    { title: 'Teachers Directory', path: '/teachers', type: 'Page' },
    { title: 'Attendance', path: '/attendance', type: 'Page' },
    { title: 'Programs / Courses', path: '/programs', type: 'Page' },
    { title: 'Management Team', path: '/management-team', type: 'Page' },
    { title: 'Documents', path: '/documents', type: 'Page' },
];

const DashboardHeader = ({ toggleSidebar, onAlertClick, alertCount = 0 }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Search Results State
    const [searchResults, setSearchResults] = useState({
        pages: [],
        students: [],
        teachers: [],
        documents: []
    });



    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm.trim()) {
                setSearchResults({ pages: [], students: [], teachers: [], documents: [] });
                return;
            }

            // Local Filter for Pages
            const matchingPages = PAGE_ROUTES.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            try {
                // Backend Search
                const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchTerm)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults({
                        pages: matchingPages,
                        students: data.students || [],
                        teachers: data.teachers || [],
                        documents: data.documents || []
                    });
                }
            } catch (error) {
                console.error("Search error:", error);
                // Fallback to just pages if API fails
                setSearchResults(prev => ({ ...prev, pages: matchingPages }));
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const hasResults = Object.values(searchResults).some(arr => arr.length > 0);

    const handleSearch = (path) => {
        navigate(path);
        setSearchTerm('');
        setShowResults(false);
    };

    return (
        <header className="px-6 py-4 md:px-8 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all relative">

            {/* LEFT: Title & Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">Dashboard Overview</h2>
            </div>

            {/* CENTER: Search Bar */}
            <div className="flex-1 max-w-md w-full relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for pages..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EB8A33] focus:border-[#EB8A33] transition-all"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowResults(true);
                        }}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        onFocus={() => setShowResults(true)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-96 overflow-y-auto">
                        {hasResults ? (
                            <div className="py-2">
                                {/* PAGES */}
                                {searchResults.pages.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Pages</h3>
                                        {searchResults.pages.map((item, index) => (
                                            <button key={`page-${index}`} onClick={() => handleSearch(item.path)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EB8A33] transition-colors flex items-center justify-between">
                                                <span>{item.title}</span>
                                                <Search size={14} className="opacity-50" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* STUDENTS */}
                                {searchResults.students.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Students</h3>
                                        {searchResults.students.map((item, index) => (
                                            <button key={`student-${index}`} onClick={() => handleSearch('/students')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EB8A33] transition-colors">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.id} • {item.program_id}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* TEACHERS */}
                                {searchResults.teachers.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Teachers</h3>
                                        {searchResults.teachers.map((item, index) => (
                                            <button key={`teacher-${index}`} onClick={() => handleSearch('/teachers')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EB8A33] transition-colors">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.emp_id} • {item.subject}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* DOCUMENTS */}
                                {searchResults.documents.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Documents</h3>
                                        {searchResults.documents.map((item, index) => (
                                            <button key={`doc-${index}`} onClick={() => handleSearch('/documents')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EB8A33] transition-colors flex items-center justify-between">
                                                <span>{item.name}</span>
                                                <span className="text-xs text-gray-400 border border-gray-200 px-1 rounded">{item.category}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
                        )}
                    </div>
                )}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3 self-end md:self-auto">
                {/* DATE DISPLAY (Hidden on mobile) */}
                <div className="hidden lg:flex bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 shadow-sm whitespace-nowrap">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* ALERT BELL ICON BUTTON */}
                <button
                    onClick={onAlertClick}
                    className="relative p-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg shadow-sm transition-colors group"
                >
                    <Bell size={20} className="group-hover:text-indigo-600 transition-colors" />
                    {/* Notification Badge - Dynamic */}
                    {alertCount > 0 && (
                        <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border border-white flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">{alertCount}</span>
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;