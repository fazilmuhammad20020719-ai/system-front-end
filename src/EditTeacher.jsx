import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

// IMPORTING NEW COMPONENTS
import EditTeacherHeader from './edit-teacher/EditTeacherHeader';
import EditTeacherPersonal from './edit-teacher/EditTeacherPersonal';
import EditTeacherFinancial from './edit-teacher/EditTeacherFinancial';

const EditTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        dob: '',
        gender: '',
        address: '',
        employeeId: '',
        department: '',
        designation: '',
        qualification: '',
        experience: '',
        joiningDate: '',
        salary: '',
        status: 'Active' // <--- Added Status State
    });

    useEffect(() => {
        console.log(`Fetching data for teacher ID: ${id}`);
        const mockData = {
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah@college.edu',
            phone: '+94 77 123 4567',
            nic: '851350123V',
            dob: '1985-05-15',
            gender: 'Female',
            address: '45, Marine Drive, Colombo 03',
            employeeId: 'EMP-001',
            department: 'Islamic Studies',
            designation: 'Head of Dept',
            qualification: 'PhD in Islamic Theology',
            experience: '12 Years',
            joiningDate: '2015-01-12',
            salary: '125,000.00',
            status: 'Active'
        };
        setFormData(mockData);
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (newStatus) => {
        setFormData({ ...formData, status: newStatus });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Teacher Data Updated:", formData);
        alert("Teacher record updated successfully!");
        navigate('/teachers');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>

                {/* STICKY HEADER */}
                <EditTeacherHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onSave={handleSubmit}
                />

                <main className="p-8">
                    {/* FORM CONTAINER */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN - Personal Info */}
                        <div className="lg:col-span-2">
                            <EditTeacherPersonal
                                formData={formData}
                                handleChange={handleChange}
                                handleStatusChange={handleStatusChange}
                            />
                        </div>

                        {/* RIGHT COLUMN - Salary & Uploads */}
                        <div>
                            <EditTeacherFinancial
                                formData={formData}
                                handleChange={handleChange}
                            />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditTeacher;
