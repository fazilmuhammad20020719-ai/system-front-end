import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { API_URL } from './config';

// IMPORTING COMPONENTS
import StudentHeader from './students/StudentHeader';
import StudentFilters from './students/StudentFilters';
import StudentList from './students/StudentList';
import StudentGrid from './students/StudentGrid';
import StudentStats from './students/StudentStats';
import Loader from './components/Loader';

const Students = () => {
    // Responsive sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // VIEW STATES
    const [viewMode, setViewMode] = useState('grid');
    const [cardSize, setCardSize] = useState('large');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(''); // This is for Grade (1st Year, etc.)
    const [selectedBatch, setSelectedBatch] = useState(''); // NEW: This is for Session (2025, 2024...)
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // DATA STATES
    const [students, setStudents] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Dynamic Filter Data
    // Filter batches/years based on selected Program to make it dependent (User Request: "suitable for program filter")
    const filteredForDropdowns = selectedProgram
        ? students.filter(s => s.program === selectedProgram)
        : students;

    const uniqueBatchYears = [...new Set(filteredForDropdowns.map(s => s.session).filter(Boolean))]
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    const uniqueAcademicYears = [...new Set(filteredForDropdowns.map(s => s.currentYear).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    // Reset Grade filter when Program changes
    useEffect(() => {
        setSelectedYear('');
        setSelectedBatch(''); // Optional: Reset batch too if we want strict hierarchy
    }, [selectedProgram]);

    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Students
                const sRes = await fetch(`${API_URL}/api/students`);
                if (sRes.ok) {
                    const sData = await sRes.json();
                    setStudents(sData);
                }

                // Fetch Programs for Dropdown
                const pRes = await fetch(`${API_URL}/api/programs`);
                if (pRes.ok) {
                    const pData = await pRes.json();
                    setProgramOptions(pData.map(p => p.name));
                }
            } catch (err) {
                console.error("Error fetching student data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(student.id).includes(searchTerm);
        const matchesYear = selectedYear ? student.currentYear === selectedYear : true;
        const matchesBatch = selectedBatch ? student.session === selectedBatch : true;
        const matchesProgram = selectedProgram ? student.program === selectedProgram : true;
        const matchesStatus = selectedStatus ? student.status === selectedStatus : true;

        return matchesSearch && matchesYear && matchesBatch && matchesProgram && matchesStatus;
    });

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedYear, selectedBatch, selectedProgram, selectedStatus]);

    // PAGINATION CALCULATION
    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedBatch('');
        setSelectedProgram('');
        setSelectedStatus('');
        setCurrentPage(1);
    };

    // DELETE STATE
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
    const [successMsg, setSuccessMsg] = useState('');

    const confirmDelete = (student) => {
        setDeleteModal({ isOpen: true, id: student.id, name: student.name });
    };

    const executeDelete = async () => {
        try {
            await fetch(`${API_URL}/api/students/${deleteModal.id}`, { method: 'DELETE' });
            setStudents(prev => prev.filter(s => s.id !== deleteModal.id));
            setSuccessMsg('Student deleted successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete");
        } finally {
            setDeleteModal({ isOpen: false, id: null, name: '' });
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex relative">
            {/* SUCCESS TOAST */}
            {successMsg && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
                    <b>{successMsg}</b>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student?</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteModal.name}"</span>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ isOpen: false })} className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={executeDelete} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER (Sticky) */}
                <StudentHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />

                <main className="p-4 md:p-8">

                    {/* STATS CARDS */}
                    <StudentStats students={students} />

                    {/* FILTERS & VIEW CONTROLS */}
                    <StudentFilters
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                        selectedBatch={selectedBatch} setSelectedBatch={setSelectedBatch}
                        selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram}
                        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                        viewMode={viewMode} setViewMode={setViewMode}
                        cardSize={cardSize} setCardSize={setCardSize}
                        academicYears={uniqueAcademicYears}
                        batchYears={uniqueBatchYears}
                        programs={programOptions}
                        clearFilters={clearFilters}
                    />

                    {/* CONTENT AREA */}
                    {filteredStudents.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <StudentList
                                    students={paginatedStudents}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    onDelete={confirmDelete} // Pass Handler
                                />
                            ) : (
                                <StudentGrid
                                    students={paginatedStudents}
                                    cardSize={cardSize}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    onDelete={confirmDelete} // Pass Handler
                                />
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No students found</h3>
                            <button onClick={clearFilters} className="mt-4 text-green-600 hover:underline font-medium text-sm">Clear all filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Students;