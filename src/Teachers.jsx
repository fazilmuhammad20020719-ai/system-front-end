import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import TeachersHeader from './teachers/TeachersHeader';
import TeachersStats from './teachers/TeachersStats';
import TeachersFilters from './teachers/TeachersFilters';
import TeacherList from './teachers/TeacherList';
import TeacherGrid from './teachers/TeacherGrid';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // -- VIEW MODE STATE --
    const [viewMode, setViewMode] = useState('grid');

    // -- FILTERS STATE --
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // -- MOCK DATA --
    const [teachers] = useState([
        { id: 1, name: "Dr. Sarah Wilson", empid: "EMP-001", dept: "Islamic Studies", role: "Head of Dept", email: "sarah@college.edu", phone: "+94 77 123 4567", status: "Active" },
        { id: 2, name: "Mr. Ahmed Kabeer", empid: "EMP-002", dept: "Arabic Language", role: "Senior Lecturer", email: "ahmed@college.edu", phone: "+94 77 987 6543", status: "Active" },
        { id: 3, name: "Ms. Fatima Rihana", empid: "EMP-003", dept: "English Unit", role: "Visiting Lecturer", email: "fatima@college.edu", phone: "+94 71 555 0123", status: "On Leave" },
        { id: 4, name: "Mr. Mohamed Naleem", empid: "EMP-004", dept: "Information Tech", role: "Instructor", email: "naleem@college.edu", phone: "+94 75 000 1111", status: "Active" },
        { id: 5, name: "Sheikh Abdullah", empid: "EMP-005", dept: "Hifz", role: "Head of Hifz", email: "abdullah@college.edu", phone: "+94 77 222 3333", status: "Active" },
    ]);

    const departments = ["Islamic Studies", "Arabic Language", "English Unit", "Information Tech", "Hifz"];

    // -- FILTER LOGIC --
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.empid.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || teacher.dept === selectedDept;
            const matchesStatus = selectedStatus === "All" || teacher.status === selectedStatus;
            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [teachers, searchTerm, selectedDept, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedDept("All");
        setSelectedStatus("All");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <TeachersHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="p-8">

                    {/* STATS */}
                    <TeachersStats teachers={teachers} />

                    {/* FILTERS */}
                    <TeachersFilters
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        selectedDept={selectedDept} setSelectedDept={setSelectedDept}
                        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                        viewMode={viewMode} setViewMode={setViewMode}
                        clearFilters={clearFilters}
                        departments={departments}
                    />

                    {/* CONTENT AREA */}
                    {filteredTeachers.length > 0 ? (
                        viewMode === 'list' ? (
                            <TeacherList teachers={filteredTeachers} />
                        ) : (
                            <TeacherGrid teachers={filteredTeachers} totalCount={teachers.length} />
                        )
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400 text-sm">
                            No teachers found matching filters.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Teachers;