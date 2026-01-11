import { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar';

// IMPORTING COMPONENTS
import StudentHeader from './students/StudentHeader';
import StudentFilters from './students/StudentFilters';
import StudentList from './students/StudentList';
import StudentGrid from './students/StudentGrid';
import StudentStats from './students/StudentStats';

import { STUDENTS_DATA } from './data/mockData';

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

    // --- DATA CONSISTENCY WITH ADD STUDENT PAGE ---

    // 1. Batch Years (2026 down to 2002)
    const batchYears = Array.from({ length: 25 }, (_, i) => (2026 - i).toString());

    // 2. Academic Grades
    const academicYears = [
        "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
        "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
        "Grade 11", "Grade 12", "Grade 13"
    ];

    // 3. Programs
    const programs = ['Hifzul Quran', 'Al-Alim (Boys)', 'Al-Alimah (Girls)'];

    // Updated Dummy Data with 'session' (Batch) and 'year' (Grade)
    const [students] = useState(STUDENTS_DATA);


    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm);
        const matchesYear = selectedYear ? student.year === selectedYear : true;
        const matchesBatch = selectedBatch ? student.session === selectedBatch : true; // New Filter
        const matchesProgram = selectedProgram ? student.program === selectedProgram : true;
        const matchesStatus = selectedStatus ? student.status === selectedStatus : true;

        return matchesSearch && matchesYear && matchesBatch && matchesProgram && matchesStatus;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedBatch('');
        setSelectedProgram('');
        setSelectedStatus('');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
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
                        selectedBatch={selectedBatch} setSelectedBatch={setSelectedBatch} // Pass Batch Props
                        selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram}
                        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                        viewMode={viewMode} setViewMode={setViewMode}
                        cardSize={cardSize} setCardSize={setCardSize}
                        academicYears={academicYears}
                        batchYears={batchYears} // Pass Batch Data
                        programs={programs}
                        clearFilters={clearFilters}
                    />

                    {/* CONTENT AREA */}
                    {filteredStudents.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <StudentList students={filteredStudents} />
                            ) : (
                                <StudentGrid students={filteredStudents} cardSize={cardSize} />
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No students found</h3>
                            <button onClick={clearFilters} className="mt-4 text-[#EB8A33] hover:underline font-medium text-sm">Clear all filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Students;