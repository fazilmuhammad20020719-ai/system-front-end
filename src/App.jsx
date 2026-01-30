import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import { LoaderProvider } from './context/LoaderContext';
import { NotificationProvider } from './context/NotificationContext';

// Lazy Load Components
const Login = lazy(() => import('./login'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const Dashboard = lazy(() => import('./Dashboard'));
const Calendar = lazy(() => import('./Calendar'));
const Schedule = lazy(() => import('./schedule/Schedule'));

// Student Routes
const Students = lazy(() => import('./Students'));
const AddStudent = lazy(() => import('./AddStudent'));
const EditStudent = lazy(() => import('./EditStudent'));
const ViewStudent = lazy(() => import('./ViewStudent'));

// Teacher Routes
const Teachers = lazy(() => import('./Teachers'));
const AddTeacher = lazy(() => import('./AddTeacher'));
const EditTeacher = lazy(() => import('./EditTeacher'));
const ViewTeacher = lazy(() => import('./ViewTeacher'));

// Management & Programs
const ManagementTeam = lazy(() => import('./ManagementTeam'));
const Programs = lazy(() => import('./Programs'));
const ViewProgram = lazy(() => import('./programs/ViewProgram'));
const ProgramDetails = lazy(() => import('./programs/ProgramDetails'));

// Exams
const ExamsLayout = lazy(() => import('./exams/ExamsLayout'));



// Others
const Attendance = lazy(() => import('./Attendance'));
const Documents = lazy(() => import('./Documents'));
const Subscription = lazy(() => import('./Subscription'));

function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <NotificationProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/schedule" element={<Schedule />} />

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
              <Route path="/programs/:id" element={<ProgramDetails />} />
              <Route path="/view-program/:id" element={<ViewProgram />} />

              {/* Exams Routes */}
              <Route path="/exams" element={<ExamsLayout />} />



              {/* Attendance & Documents */}
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/subscription" element={<Subscription />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </LoaderProvider>
    </BrowserRouter>
  );
}

export default App;