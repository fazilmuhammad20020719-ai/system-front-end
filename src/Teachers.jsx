import { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

// IMPORTING NEW COMPONENTS
import TeachersHeader from './teachers/TeachersHeader';
import TeachersStats from './teachers/TeachersStats';
import TeachersFilters from './teachers/TeachersFilters';
import TeacherList from './teachers/TeacherList';
import TeacherGrid from './teachers/TeacherGrid';
import Loader from './components/Loader';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // -- VIEW MODE STATE --
    const [viewMode, setViewMode] = useState('grid');

    // -- FILTERS STATE --
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("All");
    // Subject-க்கு பதில் Category State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // -- DATA STATE --
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH DATA
    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/teachers`);
            if (response.ok) {
                const data = await response.json();
                // Transform data for frontend compatibility
                const transformedData = data.map(t => ({
                    ...t,
                    program: t.program_name || t.program_id, // Use name if available
                    empid: t.emp_id, // Map emp_id to empid
                    category: t.teacher_category // இதை புதிதாகச் சேர்க்கவும்
                }));
                setTeachers(transformedData);
            }
        } catch (err) {
            console.error("Error fetching teachers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this teacher?")) return;

        try {
            const response = await fetch(`${API_URL}/api/teachers/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Teacher deleted successfully");
                fetchTeachers(); // Refresh list
            } else {
                alert("Failed to delete teacher");
            }
        } catch (err) {
            console.error("Error deleting teacher:", err);
            alert("Error deleting teacher");
        }
    };

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
            // Category Filter Logic
            let matchesCategory = true;
            if (selectedCategory !== "All") {
                if (selectedCategory === 'Sharia') {
                    matchesCategory = (teacher.category === 'Sharia' || teacher.category === 'Both');
                } else if (selectedCategory === 'Academic') {
                    matchesCategory = (teacher.category === 'Academic' || teacher.category === 'Both');
                } else {
                    matchesCategory = teacher.category === selectedCategory;
                }
            }
            const matchesStatus = selectedStatus === "All" || teacher.status === selectedStatus;

            return matchesSearch && matchesProgram && matchesCategory && matchesStatus;
        });
    }, [teachers, searchTerm, selectedProgram, selectedCategory, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedProgram("All");
        setSelectedCategory("All");
        setSelectedStatus("All");
    };

    if (loading) return <Loader />;

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
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                        viewMode={viewMode} setViewMode={setViewMode}
                        clearFilters={clearFilters}
                        uniqueSubjects={uniqueSubjects}
                    />

                    {/* CONTENT AREA */}
                    {filteredTeachers.length > 0 ? (
                        viewMode === 'list' ? (
                            <TeacherList teachers={filteredTeachers} onDelete={handleDelete} />
                        ) : (
                            <TeacherGrid teachers={filteredTeachers} totalCount={teachers.length} onDelete={handleDelete} />
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