import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import EditCourse from './pages/EditCourse';
import Profile from './pages/Profile';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';

// Redirect unauthenticated users to login
const AuthRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

// Providers only — redirect learners to their dashboard
const ProviderRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'provider') return <Navigate to="/dashboard" replace />;
  return children;
};

// Learners / public — redirect providers AND admins away
const PublicOnlyForProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user?.role === 'provider') return <Navigate to="/dashboard" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

// Admin only
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Block admin from non-admin routes
const NonAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Admin-only */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Public pages — providers & admins redirected away */}
      <Route path="/" element={<PublicOnlyForProvider><Home /></PublicOnlyForProvider>} />
      <Route path="/courses" element={<PublicOnlyForProvider><Courses /></PublicOnlyForProvider>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared authenticated routes (non-admin) */}
      <Route path="/dashboard" element={<NonAdminRoute><AuthRoute><Dashboard /></AuthRoute></NonAdminRoute>} />
      <Route path="/profile" element={<NonAdminRoute><AuthRoute><Profile /></AuthRoute></NonAdminRoute>} />

      {/* Learner-only */}
      <Route path="/course/:id" element={<PublicOnlyForProvider><CourseView /></PublicOnlyForProvider>} />

      {/* Provider-only */}
      <Route path="/add-course" element={<ProviderRoute><AddCourse /></ProviderRoute>} />
      <Route path="/edit-course/:id" element={<ProviderRoute><EditCourse /></ProviderRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <Navigation />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
