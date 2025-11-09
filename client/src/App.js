import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import DeveloperProfile from './Pages/DeveloperProfile.jsx';
import Forbidden from './Pages/Forbidden.jsx';

function Test() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        
        {/* Protected: Developer profile */}
        <Route 
          path="/developer/:id" 
          element={
            <ProtectedRoute requiredRole="developer">
              <DeveloperProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected: Admin dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default Test;