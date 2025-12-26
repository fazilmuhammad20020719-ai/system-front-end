import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import Students from './Students';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import ViewStudent from './ViewStudent';
import Teachers from './Teachers';
import Attendance from './Attendance'; // Import Attendance page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />

        {/* Student Routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/view-student/:id" element={<ViewStudent />} /> {/* Add this line */}

        {/* Add Teachers Route */}
        <Route path="/teachers" element={<Teachers />} />

        {/* Add Attendance Route */}
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;