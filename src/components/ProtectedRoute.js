import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user is not an admin
  if (user?.scope !== 'ADMIN') {
    // Redirect to login page if not admin
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
