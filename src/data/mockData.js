
// MOCK DATA FOR THE SYSTEM

export const STUDENTS_DATA = [
    // Hifzul Quran - Grade 1
    { id: '2025001', name: 'Muhammad Ahmed', program: 'Hifzul Quran', year: 'Grade 1', session: '2025', guardian: 'Ali Ahmed', contact: '077 123 4567', status: 'Active' },
    { id: '2025002', name: 'Omar Farooq', program: 'Hifzul Quran', year: 'Grade 1', session: '2025', guardian: 'Farooq Khan', contact: '071 222 3333', status: 'Active' },
    { id: '2025003', name: 'Zaid Ibn Harith', program: 'Hifzul Quran', year: 'Grade 1', session: '2025', guardian: 'Harith', contact: '075 555 1234', status: 'Active' },

    // Hifzul Quran - Grade 2
    { id: '2024001', name: 'Bilal Philips', program: 'Hifzul Quran', year: 'Grade 2', session: '2024', guardian: 'Philips', contact: '076 987 6543', status: 'Active' },
    { id: '2024002', name: 'Hamza Yusuf', program: 'Hifzul Quran', year: 'Grade 2', session: '2024', guardian: 'Yusuf', contact: '077 888 9999', status: 'Active' },

    // Hifzul Quran - Grade 3
    { id: '2023001', name: 'Khalid Bin Walid', program: 'Hifzul Quran', year: 'Grade 3', session: '2023', guardian: 'Walid', contact: '077 111 2233', status: 'Active' },
    { id: '2023002', name: 'Tariq Jameel', program: 'Hifzul Quran', year: 'Grade 3', session: '2023', guardian: 'Jameel', contact: '071 444 5566', status: 'Active' },

    // Al-Alim (Boys) - Year 1
    { id: '2025010', name: 'Yusuf Islam', program: 'Al-Alim (Boys)', year: 'Year 1', session: '2025', guardian: 'Cat Stevens', contact: '077 444 5555', status: 'Active' },
    { id: '2025011', name: 'Nouman Khan', program: 'Al-Alim (Boys)', year: 'Year 1', session: '2025', guardian: 'Ali Khan', contact: '071 333 4444', status: 'Active' },

    // Al-Alim (Boys) - Year 2
    { id: '2024010', name: 'Ismail Menk', program: 'Al-Alim (Boys)', year: 'Year 2', session: '2024', guardian: 'Musa Menk', contact: '075 111 2222', status: 'Active' },

    // Al-Alimah (Girls) - Grade 1
    { id: '2025020', name: 'Ayesha Siddiqa', program: 'Al-Alimah (Girls)', year: 'Grade 1', session: '2025', guardian: 'Abu Bakr', contact: '077 999 8888', status: 'Active' },
    { id: '2025021', name: 'Fathima Zahra', program: 'Al-Alimah (Girls)', year: 'Grade 1', session: '2025', guardian: 'Ali', contact: '071 777 6666', status: 'Active' },

    // English Unit - Level 1
    { id: '2025030', name: 'John Doe', program: 'English Unit', year: 'Level 1', session: '2025', guardian: 'Jane Doe', contact: '077 000 1111', status: 'Active' },
];

export const TEACHERS_DATA = [
    { id: 1, name: "Dr. Sarah Wilson", empid: "EMP-001", program: "Al Hafiz", subject: "Tajweed Rules", role: "Head of Dept", email: "sarah@college.edu", phone: "+94 77 123 4567", status: "Active" },
    { id: 2, name: "Mr. Ahmed Kabeer", empid: "EMP-002", program: "Al Alim", subject: "Arabic Grammar", role: "Senior Lecturer", email: "ahmed@college.edu", phone: "+94 77 987 6543", status: "Active" },
    { id: 3, name: "Ms. Fatima Rihana", empid: "EMP-003", program: "Al Alimah", subject: "English Literature", role: "Visiting Lecturer", email: "fatima@college.edu", phone: "+94 71 555 0123", status: "On Leave" },
    { id: 4, name: "Mr. Mohamed Naleem", empid: "EMP-004", program: "Al Alim", subject: "Information Tech", role: "Instructor", email: "naleem@college.edu", phone: "+94 75 000 1111", status: "Active" },
    { id: 5, name: "Sheikh Abdullah", empid: "EMP-005", program: "Al Hafiz", subject: "Quran Memorization", role: "Head of Hifz", email: "abdullah@college.edu", phone: "+94 77 222 3333", status: "Active" },
    { id: 6, name: "Moulavi Zaid", empid: "EMP-006", program: "Al Alim", subject: "Fiqh", role: "Lecturer", email: "zaid@college.edu", phone: "+94 77 444 5555", status: "Active" },
    { id: 7, name: "Mr. Retired Person", empid: "EMP-007", program: "O/L", subject: "Spoken English", role: "Former Lecturer", email: "retired@college.edu", phone: "+94 77 000 0000", status: "Inactive" },
];

export const DOCUMENTS_DATA = [
    { id: 'DOC-001', name: 'Student Handbook 2025.pdf', type: 'PDF', category: 'Policy' },
    { id: 'DOC-002', name: 'Exam Calendar Term 1.xlsx', type: 'Excel', category: 'Schedule' },
    { id: 'DOC-003', name: 'Staff Directory.csv', type: 'CSV', category: 'HR' },
    { id: 'DOC-004', name: 'Financial Report Q1.pdf', type: 'PDF', category: 'Finance' },
];

export const PAGE_ROUTES = [
    { title: 'Dashboard', path: '/dashboard', type: 'Page' },
    { title: 'Calendar', path: '/calendar', type: 'Page' },
    { title: 'Students Directory', path: '/students', type: 'Page' },
    { title: 'Add New Student', path: '/add-student', type: 'Page' },
    { title: 'Teachers Directory', path: '/teachers', type: 'Page' },
    { title: 'Add New Teacher', path: '/add-teacher', type: 'Page' },
    { title: 'Attendance', path: '/attendance', type: 'Page' },
    { title: 'Programs / Courses', path: '/programs', type: 'Page' },
    { title: 'Management Team', path: '/management-team', type: 'Page' },
    { title: 'Documents', path: '/documents', type: 'Page' },
];

export const PROGRAMS_DATA = [
    { id: 1, name: "Al Alim", head: "Mr. Ahmed Kabeer", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Al Alimah", head: "Ms. Fatima Rihana", color: "bg-pink-100 text-pink-600" },
    { id: 3, name: "Al Hafiz", head: "Sheikh Abdullah", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "O/L", head: "U.L.M Hassen", color: "bg-orange-100 text-orange-600" },
    { id: 5, name: "A/L", head: "Head Master", color: "bg-indigo-100 text-indigo-600" },
    { id: 6, name: "Grade 8-10", head: "Coordinator", color: "bg-purple-100 text-purple-600" },
];

export const SUBJECTS_DATA = [
    { id: 101, programId: 3, name: 'Juz 1-5' },   // Al Hafiz (ID 3)
    { id: 102, programId: 3, name: 'Tajweed Basics' },
    { id: 103, programId: 1, name: 'Arabic Grammar' }, // Al Alim (ID 1)
    { id: 104, programId: 1, name: 'Fiqh' },
    { id: 105, programId: 2, name: 'English Lit' }, // Al Alimah (ID 2)
    { id: 106, programId: 4, name: 'Maths' },      // O/L (ID 4)
    { id: 107, programId: 5, name: 'Physics' },    // A/L (ID 5)
];

export const SCHEDULES_DATA = [
    { id: 1, programId: 3, day: 'Monday', subjectId: 101, teacherId: 5, startTime: '08:30', endTime: '10:00', room: 'Hall A', grade: 'Grade 1' },
    { id: 2, programId: 3, day: 'Monday', subjectId: 102, teacherId: 1, startTime: '10:30', endTime: '12:00', room: 'Room 102', grade: 'Grade 2' },
    { id: 3, programId: 1, day: 'Tuesday', subjectId: 103, teacherId: 2, startTime: '09:00', endTime: '10:30', room: 'Hall B', grade: 'Grade 3' },
    { id: 4, programId: 4, day: 'Wednesday', subjectId: 106, teacherId: 7, startTime: '08:00', endTime: '09:30', room: 'Class 10A', grade: 'Grade 4' },
];