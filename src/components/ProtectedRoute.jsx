import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../context/AuthContext';

// Protects any route that requires authentication + role match
export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login, preserve intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in but wrong role → redirect to their own dashboard
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }

  return children;
}
