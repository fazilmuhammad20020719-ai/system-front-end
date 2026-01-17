import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react'; // Import Icon
import { API_URL } from './config';
import Sidebar from './Sidebar';
import ProgramsHeader from './programs/ProgramsHeader';
import ProgramsFilters from './programs/ProgramsFilters';
import ProgramGrid from './programs/ProgramGrid';
import ProgramModal from './programs/ProgramModal';
import SubjectModal from './programs/SubjectModal';

const Programs = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // -- MODAL STATES --
    const [showModal, setShowModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);

    // -- DELETE MODAL STATE --
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);

    // -- FEEDBACK STATE (New) --
    const [successMsg, setSuccessMsg] = useState(""); // Success message state

    // -- FORM STATE --
    const [formData, setFormData] = useState({
        name: "", head: "", duration: "", fee: "", status: "Active"
    });

    // -- DATA STATE --
    const [programs, setPrograms] = useState([]);

    // 1. FETCH DATA
    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(`${API_URL}/api/programs`);
            const data = await response.json();
            const formattedData = data.map(p => ({
                ...p,
                head: p.head_of_program,
                fees: p.fees
            }));
            setPrograms(formattedData);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    };

    // Helper to show success message
    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000); // Hide after 3 seconds
    };

    // -- HANDLERS --
    const filteredPrograms = programs.filter(program => {
        const nameMatch = program.name ? program.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        const statusMatch = statusFilter === "All" || program.status === statusFilter;
        return nameMatch && statusMatch;
    });

    const handleOpenModal = (program = null) => {
        if (program) {
            setIsEditing(true);
            setCurrentProgram(program);
            setFormData({
                name: program.name,
                head: program.head || program.head_of_program,
                duration: program.duration,
                fee: program.fees,
                status: program.status
            });
        } else {
            setIsEditing(false);
            setCurrentProgram(null);
            setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
        }
        setShowModal(true);
    };

    const handleView = (program) => {
        navigate(`/view-program/${program.id}`);
    };

    // -- DELETE HANDLER --
    const handleDelete = (id) => {
        // Open Modal instead of Window Confirm
        setProgramToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!programToDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/programs/${programToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchPrograms(); // Reload data
                showSuccess("Program Deleted Successfully"); // Show success msg
                setShowDeleteModal(false); // Close Modal
            } else {
                alert("Failed to delete program");
            }
        } catch (error) {
            console.error("Error deleting program:", error);
        }
    };

    // 2. SAVE DATA (Add & Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                // EDIT Logic
                const response = await fetch(`${API_URL}/api/programs/${currentProgram.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    fetchPrograms();
                    setShowModal(false);
                    setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
                    setIsEditing(false);
                    setCurrentProgram(null);
                    showSuccess("Program Successfully Updated"); // Show success msg
                } else {
                    alert("Failed to update program");
                }
            } else {
                // ADD Logic
                const response = await fetch(`${API_URL}/api/programs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    fetchPrograms();
                    setShowModal(false);
                    setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
                    showSuccess("Program Added Successfully"); // Show success msg
                } else {
                    alert("Failed to save program");
                }
            }
        } catch (error) {
            console.error("Error saving program:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                <ProgramsHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onAddClick={() => handleOpenModal()}
                    onAddSubjectClick={() => setShowSubjectModal(true)}
                />

                <main className="p-4 md:p-6 lg:p-8">
                    {/* Success Message Display */}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg font-bold text-center animate-in fade-in slide-in-from-top-2">
                            {successMsg}
                        </div>
                    )}

                    <ProgramsFilters
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    />
                    <ProgramGrid
                        programs={filteredPrograms}
                        onEdit={handleOpenModal}
                        onView={handleView}
                        onDelete={handleDelete} // Using the new handler
                    />
                </main>
            </div>

            <ProgramModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
            />

            <SubjectModal
                isOpen={showSubjectModal}
                onClose={() => setShowSubjectModal(false)}
                programs={programs}
                onSave={(data) => console.log(data)}
            />

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Program?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to delete this program? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;