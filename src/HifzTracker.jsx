import React, { useState, useEffect } from 'react';
import { useNotification } from './context/NotificationContext';
import { useLoader } from './context/LoaderContext';
import { BookOpen } from 'lucide-react';
import { API_URL } from './config';
import Sidebar from './Sidebar';

// Sub-components
import ProgressRing from './hifz/ProgressRing';
import AssignSidebar from './hifz/AssignSidebar';
import StudentTable from './hifz/StudentTable';
import UpdateModal from './hifz/UpdateModal';
import ConfirmPopup from './hifz/ConfirmPopup';

// Helpers
import { juzNames, getCompletedJuzs, getRunningJuzs } from './hifz/hifzHelpers';

const HifzTracker = () => {
    const { notify } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [allStudents, setAllStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('');
    const [tableSearch, setTableSearch] = useState('');

    /* Modal States */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('update');
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentLogs, setStudentLogs] = useState([]);

    // Custom Confirmation Popup State
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, num: null, name: '' });

    const [isEditingCompleted, setIsEditingCompleted] = useState(false);
    const [updateData, setUpdateData] = useState({
        running_juzs: [], completed_juzs: []
    });

    useEffect(() => {
        fetchAllStudents();
        fetchAssignedStudents();
        fetchPrograms();
    }, []);

    const fetchAllStudents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await res.json();
            setAllStudents(Array.isArray(data) ? data : (data.students || []));
        } catch { }
    };

    const fetchPrograms = async () => {
        try {
            const res = await fetch(`${API_URL}/api/programs`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await res.json();
            setAllPrograms(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchAssignedStudents = async () => {
        try {
            showLoader();
            const res = await fetch(`${API_URL}/api/hifz/students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setAssignedStudents(await res.json());
        } catch { notify('error', 'FAILED TO LOAD HIFZ TRACKER LIST'); } finally { hideLoader(); }
    };

    const fetchStudentLogs = async (studentId) => {
        try {
            const res = await fetch(`${API_URL}/api/hifz/logs/${studentId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            if (res.ok) setStudentLogs(await res.json());
        } catch { }
    };

    const handleAssignStudent = async () => {
        if (selectedStudentIds.length === 0) return notify('warning', 'PLEASE SELECT AT LEAST ONE STUDENT');
        try {
            showLoader();
            const token = localStorage.getItem('token');
            const promises = selectedStudentIds.map(studentId => 
                fetch(`${API_URL}/api/hifz/assign`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ studentId })
                })
            );
            
            const responses = await Promise.all(promises);
            const successCount = responses.filter(r => r.ok).length;
            
            if (successCount > 0) {
                notify('success', `${successCount} STUDENTS ADDED TO HIFZ TRACKER!`);
                setSelectedStudentIds([]); 
                fetchAssignedStudents();
            } else {
                notify('error', 'FAILED TO ASSIGN STUDENTS');
            }
        } catch { notify('error', 'ERROR IN STUDENT ASSIGNMENT'); } finally { hideLoader(); }
    };

    const openUpdateModal = (student) => {
        setEditingStudent(student);
        setUpdateData({
            running_juzs: getRunningJuzs(student.current_juz),
            completed_juzs: getCompletedJuzs(student.completed_juzs)
        });
        setActiveTab('update');
        setIsEditingCompleted(false);
        setIsModalOpen(true);
        fetchStudentLogs(student.student_id);
    };

    const handleJuzGridSelect = (num) => {
        if (isEditingCompleted) {
            setUpdateData(prev => ({
                ...prev,
                completed_juzs: prev.completed_juzs.includes(num)
                    ? prev.completed_juzs.filter(j => j !== num)
                    : [...prev.completed_juzs, num],
                running_juzs: prev.running_juzs.filter(j => j !== num)
            }));
        } else {
            if (updateData.completed_juzs.includes(num)) return;

            if (updateData.running_juzs.includes(num)) {
                setUpdateData(prev => ({
                    ...prev,
                    running_juzs: prev.running_juzs.filter(j => j !== num)
                }));
            } else {
                const juzName = juzNames[num - 1];
                setConfirmDialog({ isOpen: true, num, name: juzName });
            }
        }
    };

    const confirmStartJuz = () => {
        setUpdateData(prev => ({
            ...prev,
            running_juzs: [...prev.running_juzs, confirmDialog.num]
        }));
        setConfirmDialog({ isOpen: false, num: null, name: '' });
    };

    const cancelStartJuz = () => {
        setConfirmDialog({ isOpen: false, num: null, name: '' });
    };

    const handleSaveProgress = async (e) => {
        e.preventDefault();

        try {
            showLoader();
            const payload = {
                studentId: editingStudent.student_id,
                sabaq_juz: JSON.stringify(updateData.running_juzs),
                sabaq_surah: '-',
                sabqi: '-',
                manzil: '-',
                grade: '-',
                mistakes: 0,
                completed_juzs: updateData.completed_juzs
            };

            const res = await fetch(`${API_URL}/api/hifz/log`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('FAILED');
            notify('success', 'PROGRESS SAVED SUCCESSFULLY!');
            setIsModalOpen(false); fetchAssignedStudents();
        } catch { notify('error', 'FAILED TO SAVE PROGRESS.'); } finally { hideLoader(); }
    };

    /* UI Derived Data */
    const programOptions = [...new Set(allStudents.map(s => s.program).filter(Boolean))].sort();
    const assignedIds = new Set(assignedStudents.map(s => String(s.student_id)));
    const filteredDropdown = allStudents.filter(s => {
        const matchSearch = (s?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s?.id || '').includes(searchTerm);
        const matchProgram = !filterProgram || s.program === filterProgram;
        return matchSearch && matchProgram;
    });

    const filteredTable = assignedStudents.filter(s =>
        (s?.student_name || '').toLowerCase().includes(tableSearch.toLowerCase()) ||
        (s?.student_id || '').toString().includes(tableSearch)
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 min-h-screen bg-gray-50`}>
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center"><BookOpen size={18} className="text-white" /></div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 uppercase">Hifz Tracker</h1>
                            <p className="text-xs text-gray-500 uppercase">Juz Progress Management</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 px-6 pt-5 pb-24">
                    <AssignSidebar 
                        filterProgram={filterProgram}
                        setFilterProgram={setFilterProgram}
                        programOptions={programOptions}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredDropdown={filteredDropdown}
                        selectedStudentIds={selectedStudentIds}
                        setSelectedStudentIds={setSelectedStudentIds}
                        assignedIds={assignedIds}
                        handleAssignStudent={handleAssignStudent}
                    />

                    <StudentTable 
                        filteredTable={filteredTable}
                        openUpdateModal={openUpdateModal}
                        getCompletedJuzs={getCompletedJuzs}
                        getRunningJuzs={getRunningJuzs}
                    />
                </div>

                <UpdateModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    editingStudent={editingStudent}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleSaveProgress={handleSaveProgress}
                    isEditingCompleted={isEditingCompleted}
                    setIsEditingCompleted={setIsEditingCompleted}
                    updateData={updateData}
                    handleJuzGridSelect={handleJuzGridSelect}
                    studentLogs={studentLogs}
                    getRunningJuzs={getRunningJuzs}
                />

                <ConfirmPopup 
                    isOpen={confirmDialog.isOpen}
                    num={confirmDialog.num}
                    name={confirmDialog.name}
                    onConfirm={confirmStartJuz}
                    onCancel={cancelStartJuz}
                />

            </div>
        </div>
    );
};

export default HifzTracker;