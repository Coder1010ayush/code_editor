import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        // Optionally show a loading spinner or skeleton screen
        return <div>Loading authentication status...</div>;
    }

    // If not loading and user exists, render the child route (Outlet)
    // Otherwise, redirect to the login page
    return user ? <Outlet /> : <Navigate to="/login" replace />;
     // 'replace' prevents the login page from being added to history stack when redirecting
}

export default ProtectedRoute;