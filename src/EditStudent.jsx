import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

// IMPORTING SUB-COMPONENTS
import EditStudentHeader from './edit-student/EditStudentHeader';
import EditProfileInfo from './edit-student/EditProfileInfo';
import EditAcademicInfo from './edit-student/EditAcademicInfo';

const EditStudent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Form State - UPDATED with all fields used in sub-components
    const [formData, setFormData] = useState({
        // Personal
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        nic: '',
        email: '',
        phone: '',

        // Location
        province: '',
        district: '',
        dsDivision: '',  // Added
        gnDivision: '',  // Added
        address: '',
        googleMapLink: '',
        latitude: '',
        longitude: '',

        // Guardian
        guardianName: '',
        guardianRelation: '',
        guardianOccupation: '',
        guardianPhone: '',
        guardianEmail: '', // Added

        // Academic
        program: '',
        year: '',
        session: '',
        previousSchoolName: '', // Renamed to match sub-component
        lastStudiedGrade: '',   // Added
        previousCollegeName: '',// Added
        mediumOfStudy: 'Tamil', // Added
        status: 'Active'
    });

    useEffect(() => {
        // Mock Data with ALL details
        const dummyData = {
            firstName: 'Muhammad',
            lastName: 'Ahmed',
            dob: '2015-05-15',
            gender: 'Male',
            nic: '201512345678',
            email: 'student@example.com',
            phone: '0771234567',

            province: 'Western',
            district: 'Colombo',
            dsDivision: 'Colombo Dist',
            gnDivision: 'C-123',
            address: '123, Main Street, Colombo',
            googleMapLink: 'http://maps.google.com/?q=6.9271,79.8612',
            latitude: '6.9271',
            longitude: '79.8612',

            guardianName: 'Ali Ahmed',
            guardianRelation: 'Father',
            guardianOccupation: 'Merchant',
            guardianPhone: '0779876543',
            guardianEmail: 'ali.parent@example.com',

            program: 'Hifzul Quran',
            year: 'Grade 5',
            session: '2025',

            // Previous Education
            previousSchoolName: 'City High School',
            lastStudiedGrade: 'Grade 4',
            previousCollegeName: 'City Madrasa',
            mediumOfStudy: 'Tamil',

            status: 'Active'
        };
        setFormData(dummyData);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (newStatus) => {
        setFormData(prev => ({ ...prev, status: newStatus }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Data:", formData);
        alert("Student record updated successfully!");
        navigate(`/view-student/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <EditStudentHeader id={id} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onSave={handleSubmit} />
                <main className="p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Personal, Location, Guardian Info */}
                            <EditProfileInfo formData={formData} handleChange={handleChange} setFormData={setFormData} />
                        </div>
                        <div>
                            {/* Academic & Documents */}
                            <EditAcademicInfo formData={formData} handleChange={handleChange} handleStatusChange={handleStatusChange} />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditStudent;