import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './Dashboard';
import Calendar from './Calendar'; // Import the new Calendar

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add the Calendar Route */}
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;