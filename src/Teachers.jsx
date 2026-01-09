import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import TeachersHeader from './teachers/TeachersHeader';
import TeachersStats from './teachers/TeachersStats';
import TeachersFilters from './teachers/TeachersFilters';
import TeacherList from './teachers/TeacherList';
import TeacherGrid from './teachers/TeacherGrid';

import { TEACHERS_DATA } from './data/mockData';

const Teachers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // -- VIEW MODE STATE --
    const [viewMode, setViewMode] = useState('grid');

    // -- FILTERS STATE --
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("All");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // -- MOCK DATA --
    const [teachers] = useState(TEACHERS_DATA);

    // Derived Unique Subjects for Filter Dropdown
    const uniqueSubjects = useMemo(() => {
        const subjects = teachers.map(t => t.subject);
        return [...new Set(subjects)];
    }, [teachers]);

    // -- FILTER LOGIC --
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.empid.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProgram = selectedProgram === "All" || teacher.program === selectedProgram;
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