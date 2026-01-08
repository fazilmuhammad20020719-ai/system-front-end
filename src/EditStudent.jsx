import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import EditStudentHeader from './edit-student/EditStudentHeader';
import EditProfileInfo from './edit-student/EditProfileInfo';
import EditAcademicInfo from './edit-student/EditAcademicInfo';

const EditStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Form State (Added 'status')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        program: '',
        year: '',
        session: '',
        previousSchool: '',
        status: 'Active'
    });

    // Simulate Fetching Data
    useEffect(() => {
        const dummyData = {
            firstName: 'Muhammad',
            lastName: 'Ahmed',
            dob: '2015-05-15',
            gender: 'Male',
            nic: '201512345678',
            email: 'student@example.com',
            phone: '077 123 4567',
            address: '123, Main Street, Colombo',
            guardianName: 'Ali Ahmed',
            guardianRelation: 'Father',
            guardianPhone: '077 987 6543',
            program: 'Hifz ul Quran',
            year: '1st Year',
            session: '2025-2026',
            previousSchool: 'City High School',
            status: 'Active'
        };
        setFormData(dummyData);
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler specifically for the status buttons
    const handleStatusChange = (newStatus) => {
        setFormData({ ...formData, status: newStatus });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Data:", formData);
        alert("Student record updated successfully!");

        // UPDATED: Navigate to the View Student page for this specific ID
        navigate(`/view-student/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* STICKY HEADER */}
                <EditStudentHeader
                    id={id}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onSave={handleSubmit}
                />

                <main className="p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2">
                            <EditProfileInfo formData={formData} handleChange={handleChange} />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div>
                            <EditAcademicInfo
                                formData={formData}
                                handleChange={handleChange}
                                handleStatusChange={handleStatusChange}
                            />
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditStudent;