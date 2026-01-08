import { useState } from 'react';
import Sidebar from './Sidebar';

// IMPORT SUB-COMPONENTS
import ProgramsHeader from './programs/ProgramsHeader';
import ProgramsFilters from './programs/ProgramsFilters';
import ProgramGrid from './programs/ProgramGrid';
import ProgramModal from './programs/ProgramModal';
import ProgramDetails from './programs/ProgramDetails'; // [NEW IMPORT]

const Programs = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // -- MODAL STATES --
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // -- VIEW DETAILS STATE --
    const [viewProgram, setViewProgram] = useState(null); // [NEW STATE]

    const [currentProgram, setCurrentProgram] = useState(null);

    // -- FORM STATE --
    const [formData, setFormData] = useState({
        name: "",
        head: "",
        duration: "",
        fee: "",
        status: "Active"
    });

    // -- MOCK DATA (SRI LANKA CONTEXT) --
    const [programs, setPrograms] = useState([
        {
            id: 1,
            name: "Hifzul Quran",
            head: "Sheikh Abdullah",
            duration: "3 Years",
            students: 120,
            fees: "Free",
            status: "Active",
            color: "bg-emerald-100 text-emerald-600"
        },
        {
            id: 2,
            name: "Al-Alim Course",
            head: "Mufti Rahman",
            duration: "7 Years",
            students: 85,
            fees: "Monthly",
            status: "Active",
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: 3,
            name: "Al-Alimah (Girls)",
            head: "Ustadha Fatima",
            duration: "3 - 5 Years",
            students: 60,
            fees: "Monthly",
            status: "Active",
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: 4,
            name: "Secondary (Gr 8-10)",
            head: "Mr. Perera",
            duration: "3 Years",
            students: 45,
            fees: "Termly",
            status: "Active",
            color: "bg-orange-100 text-orange-600"
        },
        {
            id: 5,
            name: "G.C.E. O/L Prep",
            head: "Mr. Farook",
            duration: "2 Years",
            students: 50,
            fees: "Monthly",
            status: "Active",
            color: "bg-teal-100 text-teal-600"
        },
        {
            id: 6,
            name: "G.C.E. A/L",
            head: "Dr. Kareem",
            duration: "2 Years",
            students: 30,
            fees: "Monthly",
            status: "Active",
            color: "bg-indigo-100 text-indigo-600"
        },
    ]);

    // -- HANDLERS --
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.head.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || program.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (program = null) => {
        if (program) {
            setIsEditing(true);
            setCurrentProgram(program);
            setFormData({
                name: program.name,
                head: program.head,
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

    // [UPDATED] - Now sets the state to open the details modal
    const handleView = (program) => {
        setViewProgram(program);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setPrograms(prev => prev.map(p => p.id === currentProgram.id ? {
                ...p,
                name: formData.name,
                head: formData.head,
                duration: formData.duration,
                fees: formData.fee,
                status: formData.status
            } : p));
        } else {
            const newProgram = {
                id: Date.now(),
                name: formData.name,
                head: formData.head,
                duration: formData.duration,
                students: 0,
                fees: formData.fee,
                status: formData.status,
                color: "bg-gray-100 text-gray-600"
            };
            setPrograms([...programs, newProgram]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this program?")) {
            setPrograms(programs.filter(p => p.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* HEADER */}
                <ProgramsHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onAddClick={() => handleOpenModal()}
                />

                <main className="p-4 md:p-6 lg:p-8">

                    {/* FILTERS */}
                    <ProgramsFilters
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    />

                    {/* GRID */}
                    <ProgramGrid
                        programs={filteredPrograms}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        onView={handleView}
                    />

                </main>
            </div>

            {/* EDIT/ADD MODAL */}
            <ProgramModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
            />

            {/* [NEW] DETAILS MODAL */}
            <ProgramDetails
                isOpen={!!viewProgram}
                onClose={() => setViewProgram(null)}
                program={viewProgram}
            />
        </div>
    );
};

export default Programs;
