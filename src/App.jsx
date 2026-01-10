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
import ViewProgram from './programs/ViewProgram'; // [NEW IMPORT]
import ProgramDetails from './programs/ProgramDetails';
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

        {/* Teacher Routes */}
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
        <Route path="/view-teacher/:id" element={<ViewTeacher />} />
        <Route path="/edit-teacher/:id" element={<EditTeacher />} />

        {/* Management Team */}
        <Route path="/management-team" element={<ManagementTeam />} />

        {/* Program Routes */}
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} /> {/* Keeping old route just in case, but new one is preferred */}
        <Route path="/view-program/:id" element={<ViewProgram />} /> {/* [NEW ROUTE] */}

        {/* Attendance & Documents */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/documents" element={<Documents />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;