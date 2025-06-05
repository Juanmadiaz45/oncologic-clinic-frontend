// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from '@/pages/auth/LoginPage';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import authService from '@/services/auth/authService';

function App() {
  useEffect(() => {
    // Initialize auth state from stored token
    const initialized = authService.initializeFromStoredToken();
    console.log('App initialized from token:', initialized);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              authService.isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route 
            path="*" 
            element={
              authService.isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;