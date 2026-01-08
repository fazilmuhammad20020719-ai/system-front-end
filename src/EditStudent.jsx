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

    // Form State (Updated with new Location/Guardian fields)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        nic: '',
        email: '',
        phone: '',

        // New Location Fields
        province: '',
        district: '',
        dsDivision: '',
        gnDivision: '',
        address: '',
        googleMapLink: '',
        latitude: '',
        longitude: '',

        guardianName: '',
        guardianRelation: '',
        guardianOccupation: '', // New
        guardianPhone: '',

        program: '',
        year: '',
        session: '',
        previousSchool: '',
        status: 'Active'
    });

    useEffect(() => {
        // Mock Data with Sri Lanka details
        const dummyData = {
            firstName: 'Muhammad',
            lastName: 'Ahmed',
            dob: '2015-05-15',
            gender: 'Male',
            nic: '201512345678',
            email: 'student@example.com',
            phone: '077 123 4567',

            province: 'Western',
            district: 'Colombo',
            dsDivision: 'Colombo Dist',
            gnDivision: 'C-123',
            address: '123, Main Street, Colombo',
            googleMapLink: 'https://maps.google.com',
            latitude: '6.9271',
            longitude: '79.8612',

            guardianName: 'Ali Ahmed',
            guardianRelation: 'Father',
            guardianOccupation: 'Merchant',
            guardianPhone: '077 987 6543',
            program: 'Hifzul Quran',
            year: '1st Year',
            session: '2025',
            previousSchool: 'City High School',
            status: 'Active'
        };
        setFormData(dummyData);
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (newStatus) => {
        setFormData({ ...formData, status: newStatus });
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
                            {/* Pass setFormData to handle Map updates if needed */}
                            <EditProfileInfo formData={formData} handleChange={handleChange} setFormData={setFormData} />
                        </div>
                        <div>
                            <EditAcademicInfo formData={formData} handleChange={handleChange} handleStatusChange={handleStatusChange} />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditStudent;