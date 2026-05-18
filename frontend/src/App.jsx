import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MatrixBackground from './components/common/MatrixBackground';
import CustomCursor from './components/common/CustomCursor';

// Layouts
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import ThreatIntelPage from './pages/ThreatIntelPage';
import SecurityToolsPage from './pages/SecurityToolsPage';
import AwarenessPage from './pages/AwarenessPage';
import LearnPage from './pages/LearnPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

// Layout component for authenticated and dashboard-style pages
const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent z-10 relative">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      {/* Dashboard Layout Routes */}
      <Route element={<AppLayout />}>
        {/* Public dashboard routes */}
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/learn" element={<LearnPage />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/threat-intel" element={<ThreatIntelPage />} />
          <Route path="/tools" element={<SecurityToolsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <CustomCursor />
          <MatrixBackground />
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
