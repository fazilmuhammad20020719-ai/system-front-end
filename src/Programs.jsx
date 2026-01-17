import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
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

    // -- FORM STATE --
    const [formData, setFormData] = useState({
        name: "", head: "", duration: "", fee: "", status: "Active"
    });

    // -- DATA STATE --
    const [programs, setPrograms] = useState([]); // Empty initially

    // 1. FETCH DATA FROM SERVER ON LOAD
    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(`${API_URL}/api/programs`);
            const data = await response.json();
            // Map database columns to frontend names if needed
            const formattedData = data.map(p => ({
                ...p,
                head: p.head_of_program, // Database uses head_of_program
                fees: p.fees             // Database uses fees
            }));
            setPrograms(formattedData);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    };

    // -- HANDLERS --
    const filteredPrograms = programs.filter(program => {
        // Safe check for name in case data is missing
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

    // 2. SAVE DATA TO SERVER
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                // Add Edit Logic Here later (PUT request)
                console.log("Edit not implemented yet");
            } else {
                const response = await fetch(`${API_URL}/api/programs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    fetchPrograms(); // Reload list
                    setShowModal(false);
                    setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
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
                    <ProgramsFilters
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    />
                    <ProgramGrid
                        programs={filteredPrograms}
                        onEdit={handleOpenModal}
                        onView={handleView}
                        onDelete={(id) => setPrograms(programs.filter(p => p.id !== id))}
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
        </div>
    );
};

export default Programs;