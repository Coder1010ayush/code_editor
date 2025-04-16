// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { registerUser, loginUser, logoutUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading until we check session

    const checkUserSession = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchCurrentUser();
            setUser(response.data); // Set user if session is valid
        } catch (error) {
            // Handle error (e.g., 401 Unauthorized means no active session)
            console.log('No active session or error checking session:', (error.response && error.response.data && error.response.data.message) || error.message);

            setUser(null); // Ensure user is null if session check fails
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        // Check user session when the app loads
        checkUserSession();
    }, [checkUserSession]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await loginUser(credentials);
            setUser(response.data);
            setLoading(false);
            return response.data; // Return user data on success
        } catch (error) {
            setLoading(false);
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error; // Re-throw error to be caught in the component
        }
    };

    const register = async (userData) => {
         setLoading(true);
         try {
             const response = await registerUser(userData);
             setUser(response.data); // Log user in immediately after registration
             setLoading(false);
             return response.data;
         } catch (error) {
             setLoading(false);
             console.error("Registration failed:", error.response?.data?.message || error.message);
             throw error;
         }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null); // Clear user state
            setLoading(false);
        } catch (error) {
             setLoading(false);
             console.error("Logout failed:", error.response?.data?.message || error.message);
             // Even if API call fails, clear local state
             setUser(null);
             throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, checkUserSession }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};