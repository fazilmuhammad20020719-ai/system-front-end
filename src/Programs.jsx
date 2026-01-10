import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORT NAVIGATE
import Sidebar from './Sidebar';

// IMPORT SUB-COMPONENTS
import ProgramsHeader from './programs/ProgramsHeader';
import ProgramsFilters from './programs/ProgramsFilters';
import ProgramGrid from './programs/ProgramGrid';
import ProgramModal from './programs/ProgramModal';
import SubjectModal from './programs/SubjectModal';

const Programs = () => {
    const navigate = useNavigate(); // HOOK
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // -- MODAL STATES --
    const [showModal, setShowModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // -- VIEW DETAILS STATE (Removed local viewProgram state) --
    // const [viewProgram, setViewProgram] = useState(null); // REMOVE THIS

    const [currentProgram, setCurrentProgram] = useState(null);

    // -- FORM STATE --
    const [formData, setFormData] = useState({
        name: "", head: "", duration: "", fee: "", status: "Active"
    });

    // -- DATA STATES --
    const [programs, setPrograms] = useState([
        { id: 1, name: "Hifzul Quran", head: "Sheikh Abdullah", duration: "3 Years", students: 120, fees: "Free", status: "Active", color: "bg-emerald-100 text-emerald-600" },
        { id: 2, name: "Al-Alim Course", head: "Mufti Rahman", duration: "7 Years", students: 85, fees: "Monthly", status: "Active", color: "bg-blue-100 text-blue-600" },
        { id: 3, name: "G.C.E. O/L Prep", head: "Mr. Farook", duration: "2 Years", students: 50, fees: "Monthly", status: "Active", color: "bg-teal-100 text-teal-600" },
        { id: 4, name: "G.C.E. A/L Arts", head: "Mrs. Naleema", duration: "2 Years", students: 40, fees: "Monthly", status: "Active", color: "bg-purple-100 text-purple-600" },
        { id: 5, name: "Al-Alimah (Girls)", head: "Ms. Fatima", duration: "4 Years", students: 60, fees: "Monthly", status: "Active", color: "bg-pink-100 text-pink-600" },
    ]);

    // -- SUBJECTS STATE --
    const [subjects, setSubjects] = useState([]); // (Mock logic, usually fetched in View page)

    // -- HANDLERS --
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || program.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Open Add/Edit Program Modal
    const handleOpenModal = (program = null) => {
        if (program) {
            setIsEditing(true);
            setCurrentProgram(program);
            setFormData({
                name: program.name, head: program.head, duration: program.duration, fee: program.fees, status: program.status
            });
        } else {
            setIsEditing(false);
            setCurrentProgram(null);
            setFormData({ name: "", head: "", duration: "", fee: "", status: "Active" });
        }
        setShowModal(true);
    };

    // HANDLE VIEW CLICK (Navigate to new page)
    const handleView = (program) => {
        navigate(`/view-program/${program.id}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ... (Save logic remains same)
        setShowModal(false);
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
                        onView={handleView} // Passes navigation handler
                        onDelete={(id) => setPrograms(programs.filter(p => p.id !== id))}
                    />
                </main>
            </div>

            {/* Modals (No ProgramDetails modal anymore) */}
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