import { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

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
    const [selectedProgram, setSelectedProgram] = useState("All");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // -- DATA STATE --
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH DATA
    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/teachers`);
                if (response.ok) {
                    const data = await response.json();
                    setTeachers(data);
                }
            } catch (err) {
                console.error("Error fetching teachers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    // Derived Unique Subjects for Filter Dropdown
    const uniqueSubjects = useMemo(() => {
        const subjects = teachers.map(t => t.subject).filter(Boolean); // Filter out nulls
        return [...new Set(subjects)];
    }, [teachers]);

    // -- FILTER LOGIC --
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            // Safe navigation for properties
            const name = teacher.name || '';
            const empid = teacher.empid || teacher.emp_id || ''; // Handle DB column naming difference if any
            const tProgram = teacher.program || teacher.program_name || '';

            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                empid.toLowerCase().includes(searchTerm.toLowerCase());

            // Program matching: Select 'All' or match exact string
            const matchesProgram = selectedProgram === "All" || tProgram === selectedProgram;
            const matchesSubject = selectedSubject === "All" || teacher.subject === selectedSubject;
            const matchesStatus = selectedStatus === "All" || teacher.status === selectedStatus;

            return matchesSearch && matchesProgram && matchesSubject && matchesStatus;
        });
    }, [teachers, searchTerm, selectedProgram, selectedSubject, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedProgram("All");
        setSelectedSubject("All");
        setSelectedStatus("All");
    };

    if (loading) return <div className="p-20 text-center">Loading Teachers...</div>;

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
                        selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram}
                        selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
                        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                        viewMode={viewMode} setViewMode={setViewMode}
                        clearFilters={clearFilters}
                        uniqueSubjects={uniqueSubjects}
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