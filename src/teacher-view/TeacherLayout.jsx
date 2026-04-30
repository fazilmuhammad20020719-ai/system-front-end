import { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    User, Calendar, DollarSign, FileText, ArrowLeft, Printer, Download, Layout
} from 'lucide-react';
import Sidebar from '../Sidebar';
import Loader from '../components/Loader';
import { API_URL } from '../config';

const TeacherLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await fetch(`${API_URL}/api/teachers/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeacher(data);
                } else {
                    console.error('Failed to fetch teacher');
                }
            } catch (err) {
                console.error('Error fetching teacher:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, [id]);

    if (!teacher) return <Loader />;

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <header className="px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/teachers')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowLeft size={20} /></button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{teacher.name}</h1>
                                <p className="text-xs text-gray-500 font-medium">{teacher.emp_id} &bull; {teacher.department}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50"><Printer size={16} /> Print</button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700"><Download size={16} /> Report</button>
                        </div>
                    </div>

                    {/* NAVIGATION TABS */}
                    <div className="flex gap-6 border-b border-gray-200">
                        <NavTab to="overview" icon={User} label="Overview" />
                        <NavTab to="schedule" icon={Calendar} label="Schedule" />
                        <NavTab to="payroll" icon={DollarSign} label="Payroll" />
                        <NavTab to="documents" icon={FileText} label="Documents" />
                    </div>
                </header>

                <main className="p-8">
                    {/* The specific page content will render here */}
                    <Outlet context={{ teacher }} />
                </main>
            </div>
        </div>
    );
};

// Helper Component for Navigation Links
const NavTab = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${isActive ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
    >
        <Icon size={16} /> {label}
    </NavLink>
);

export default TeacherLayout;