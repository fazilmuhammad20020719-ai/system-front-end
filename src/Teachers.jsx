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
import { useNotification } from './context/NotificationContext';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { notify } = useNotification();

    // -- VIEW MODE STATE --
    const [viewMode, setViewMode] = useState('grid');

    // -- FILTERS STATE --
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("All");
    // Subject-க்கு பதில் Category State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubject, setSelectedSubject] = useState("All"); // புதிய Subject Filter
    const [programs, setPrograms] = useState([]); // Programs List
    const [subjects, setSubjects] = useState([]); // Subjects List
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
                    category: t.teacher_category, // For filter logic
                    teacher_category: t.teacher_category, // For display in TeacherGrid/List
                    assigned_programs: t.assigned_programs // Ensure assigned_programs is preserved
                }));
                setTeachers(transformedData);
            }

            // 2. Fetch Programs
            const pRes = await fetch(`${API_URL}/api/programs`);
            if (pRes.ok) setPrograms(await pRes.json());

            // 3. Fetch Subjects
            const sRes = await fetch(`${API_URL}/api/subjects`);
            if (sRes.ok) setSubjects(await sRes.json());
        } catch (err) {
            console.error("Error fetching teachers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // DELETE STATE
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

    const handleDelete = (teacher) => {
        setDeleteModal({ isOpen: true, id: teacher.id, name: teacher.name });
    };

    const executeDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/teachers/${deleteModal.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                notify('success', 'Teacher deleted successfully', 'Success');
                fetchTeachers();
            } else {
                notify('error', 'Failed to delete teacher', 'Error');
            }
        } catch (err) {
            console.error("Error deleting teacher:", err);
            notify('error', 'Error deleting teacher', 'Error');
        } finally {
            setDeleteModal({ isOpen: false, id: null, name: '' });
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
            const matchesSubject = selectedSubject === "All" || teacher.subject === selectedSubject;
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

            return matchesSearch && matchesProgram && matchesSubject && matchesCategory && matchesStatus;
        });
    }, [teachers, searchTerm, selectedProgram, selectedSubject, selectedCategory, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedProgram("All");
        setSelectedSubject("All");
        setSelectedCategory("All");
        setSelectedStatus("All");
    };

    if (loading) return <Loader />;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* DELETE MODAL */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Teacher?</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteModal.name}"</span>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ isOpen: false })} className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={executeDelete} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

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
                        programs={programs}

                        // Subjects List & State அனுப்புகிறோம்
                        selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
                        subjects={subjects}

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