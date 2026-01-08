import { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar';

// IMPORTING COMPONENTS
import StudentHeader from './students/StudentHeader';
import StudentFilters from './students/StudentFilters';
import StudentList from './students/StudentList';
import StudentGrid from './students/StudentGrid';
import StudentStats from './students/StudentStats'; // <-- Import new component

const Students = () => {
    // Responsive sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // VIEW STATES
    const [viewMode, setViewMode] = useState('grid');
    const [cardSize, setCardSize] = useState('large');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // <-- New State

    // Fixed Academic Years Options
    const academicYears = [
        "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year", "7th Year"
    ];

    // Dummy Data (Updated with Graduated status for demo)
    const [students] = useState([
        { id: '2025001', name: 'Muhammad Ahmed', program: 'Hifzul Quran', year: '1st Year', guardian: 'Ali Ahmed', contact: '077 123 4567', status: 'Active' },
        { id: '2025002', name: 'Yusuf Khan', program: 'Al-Alim Course', year: '2nd Year', guardian: 'Usman Khan', contact: '076 987 6543', status: 'Active' },
        { id: '2025003', name: 'Ibrahim Zaid', program: 'Secondary (Gr 8-10)', year: '3rd Year', guardian: 'Zaid Moor', contact: '075 555 1234', status: 'Inactive' },
        { id: '2025004', name: 'Abdullah Omar', program: 'Hifzul Quran', year: '1st Year', guardian: 'Omar Farooq', contact: '071 222 3333', status: 'Graduated' },
        { id: '2025005', name: 'Kareem Abdul', program: 'Al-Alim Course', year: '7th Year', guardian: 'Abdul Jabbar', contact: '077 999 8888', status: 'Active' },
        { id: '2025006', name: 'Fahad Mustafa', program: 'G.C.E. O/L Prep', year: '4th Year', guardian: 'Mustafa Ali', contact: '077 111 2222', status: 'Active' },
        { id: '2025007', name: 'Zaid Haris', program: 'G.C.E. A/L', year: '1st Year', guardian: 'Haris Khan', contact: '077 333 4444', status: 'Active' },
        { id: '2025008', name: 'Omar Bin Khattab', program: 'Al-Alim Course', year: '2nd Year', guardian: 'Khattab', contact: '077 555 6666', status: 'Graduated' },
    ]);

    // Unique Programs for Dropdown
    const programs = [...new Set(students.map(s => s.program))];

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm);
        const matchesYear = selectedYear ? student.year === selectedYear : true;
        const matchesProgram = selectedProgram ? student.program === selectedProgram : true;
        const matchesStatus = selectedStatus ? student.status === selectedStatus : true; // <-- New Logic

        return matchesSearch && matchesYear && matchesProgram && matchesStatus;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedProgram('');
        setSelectedStatus(''); // Clear status
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

                    {/* STATS CARDS (New) */}
                    <StudentStats students={students} />

                    {/* FILTERS & VIEW CONTROLS */}
                    <StudentFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        selectedProgram={selectedProgram}
                        setSelectedProgram={setSelectedProgram}
                        selectedStatus={selectedStatus} // Pass state
                        setSelectedStatus={setSelectedStatus} // Pass setter
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        cardSize={cardSize}
                        setCardSize={setCardSize}
                        academicYears={academicYears}
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