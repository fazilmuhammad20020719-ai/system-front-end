import { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    User, Calendar, DollarSign, FileText, ArrowLeft, Printer, Download, Layout
} from 'lucide-react';
import Sidebar from '../Sidebar'; // Adjust path if needed

const TeacherLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);

    // -- MOCK DATA (Ideally fetched from API) --
    useEffect(() => {
        // Simulating data fetch
        setTeacher({
            id: id,
            fullName: "Dr. Sarah Wilson",
            empid: "EMP-001",
            email: "sarah@college.edu",
            phone: "+94 77 123 4567",
            address: "Colombo 03, LK",
            dept: "Islamic Studies",
            role: "Head of Dept",
            status: "Active",
            joinDate: "2020-01-12",
            salary: "125,000",
            schedule: [
                { day: "Monday", time: "08:00 - 09:00", subject: "Quranic Tafseer", grade: "Year 3" },
                { day: "Monday", time: "10:00 - 11:00", subject: "Hadith Studies", grade: "Year 5" },
                { day: "Wednesday", time: "09:00 - 10:30", subject: "Fiqh", grade: "Year 4" },
            ],
            payroll: [
                { month: "October 2025", basic: "125,000", bonus: "5,000", status: "Paid" },
                { month: "September 2025", basic: "125,000", bonus: "0", status: "Paid" },
            ],
            docs: [
                { name: "Contract_Agreement.pdf", size: "2.4 MB", date: "Jan 10, 2024" },
                { name: "PhD_Certificate.jpg", size: "1.5 MB", date: "Feb 15, 2020" },
            ]
        });
    }, [id]);

    if (!teacher) return <div className="p-10 text-center">Loading Teacher Profile...</div>;

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
                                <h1 className="text-xl font-bold text-gray-800">{teacher.fullName}</h1>
                                <p className="text-xs text-gray-500 font-medium">{teacher.empid} &bull; {teacher.dept}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50"><Printer size={16} /> Print</button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#EB8A33] text-white rounded-lg text-sm font-bold hover:bg-[#d97c2a]"><Download size={16} /> Report</button>
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
        className={({ isActive }) => `flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${isActive ? "border-[#EB8A33] text-[#EB8A33]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
    >
        <Icon size={16} /> {label}
    </NavLink>
);

export default TeacherLayout;