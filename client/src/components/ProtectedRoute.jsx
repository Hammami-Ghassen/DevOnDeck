import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Not authenticated
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;