
// MOCK DATA FOR THE SYSTEM

export const STUDENTS_DATA = [
    { id: '2025001', name: 'Muhammad Ahmed', program: 'Hifzul Quran', year: '1st Year', session: '2025', guardian: 'Ali Ahmed', contact: '077 123 4567', status: 'Active' },
    { id: '2025002', name: 'Yusuf Khan', program: 'Al-Alim (Boys)', year: '2nd Year', session: '2024', guardian: 'Usman Khan', contact: '076 987 6543', status: 'Active' },
    { id: '2025003', name: 'Fathima Zaid', program: 'Al-Alimah (Girls)', year: '3rd Year', session: '2023', guardian: 'Zaid Moor', contact: '075 555 1234', status: 'Inactive' },
    { id: '2025004', name: 'Abdullah Omar', program: 'Hifzul Quran', year: '1st Year', session: '2025', guardian: 'Omar Farooq', contact: '071 222 3333', status: 'Graduated' },
    { id: '2025005', name: 'Kareem Abdul', program: 'Al-Alim (Boys)', year: 'Final Year', session: '2020', guardian: 'Abdul Jabbar', contact: '077 999 8888', status: 'Active' },
    { id: '2025006', name: 'Fahad Mustafa', program: 'Hifzul Quran', year: 'Grade 5', session: '2025', guardian: 'Mustafa Ali', contact: '077 111 2222', status: 'Active' },
];

export const TEACHERS_DATA = [
    { id: 1, name: "Dr. Sarah Wilson", empid: "EMP-001", program: "Hifzul Quran", subject: "Tajweed Rules", role: "Head of Dept", email: "sarah@college.edu", phone: "+94 77 123 4567", status: "Active" },
    { id: 2, name: "Mr. Ahmed Kabeer", empid: "EMP-002", program: "Al-Alim (Boys)", subject: "Arabic Grammar", role: "Senior Lecturer", email: "ahmed@college.edu", phone: "+94 77 987 6543", status: "Active" },
    { id: 3, name: "Ms. Fatima Rihana", empid: "EMP-003", program: "Al-Alimah (Girls)", subject: "English Literature", role: "Visiting Lecturer", email: "fatima@college.edu", phone: "+94 71 555 0123", status: "On Leave" },
    { id: 4, name: "Mr. Mohamed Naleem", empid: "EMP-004", program: "Al-Alim (Boys)", subject: "Information Tech", role: "Instructor", email: "naleem@college.edu", phone: "+94 75 000 1111", status: "Active" },
    { id: 5, name: "Sheikh Abdullah", empid: "EMP-005", program: "Hifzul Quran", subject: "Quran Memorization", role: "Head of Hifz", email: "abdullah@college.edu", phone: "+94 77 222 3333", status: "Active" },
    { id: 6, name: "Moulavi Zaid", empid: "EMP-006", program: "Al-Alim (Boys)", subject: "Fiqh", role: "Lecturer", email: "zaid@college.edu", phone: "+94 77 444 5555", status: "Active" },
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
