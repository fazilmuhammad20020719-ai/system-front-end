import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import Students from './Students';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import ViewStudent from './ViewStudent';
import Teachers from './Teachers';
import AddTeacher from './AddTeacher';
import EditTeacher from './EditTeacher';
import ViewTeacher from './ViewTeacher';
import Programs from './Programs';
import Attendance from './Attendance';
import Documents from './Documents';
import ManagementTeam from './ManagementTeam';
import ForgotPassword from './ForgotPassword';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />

        {/* Student Routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/view-student/:id" element={<ViewStudent />} />

        {/* Add Teachers Route */}
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
        <Route path="/view-teacher/:id" element={<ViewTeacher />} />

        <Route path="/edit-teacher/:id" element={<EditTeacher />} />

        {/* Add Management Team Route */}
        <Route path="/management-team" element={<ManagementTeam />} />

        {/* Add Programs Route */}
        <Route path="/programs" element={<Programs />} />

        {/* Add Attendance Route */}
        <Route path="/attendance" element={<Attendance />} />

        {/* Documents Route */}
        <Route path="/documents" element={<Documents />} />

        {/* Catch-all Route: Redirect to Dashboard (or 404) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;