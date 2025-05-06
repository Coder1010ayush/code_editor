import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // Import Footer
import HomePage from './pages/HomePage'; // Import HomePage if separated
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashBoard';
// import CodeEditorPage from './pages/Editor';
import CodeEditorPage from './pages/Editor';
import AdminDashboard from './pages/AdminDashboard';
import AddProblems from './pages/AddProblems';

// Keep DashboardPage and NotFoundPage (or move them to /pages too)
const NotFoundPage = () => <div style={{ minHeight: '60vh', textAlign: 'center', padding: '50px' }}><h1>404 - Page Not Found</h1></div>;

// Placeholder pages for new nav links
// const ProblemsPage = () => <div style={{minHeight: '60vh', padding: '20px'}}><h2>Problems Page</h2><p>Problem listings would go here...</p></div>
const MockInterviewPage = () => <div style={{minHeight: '60vh', padding: '20px'}}><h2>Mock Interview Page</h2><p>Mock interview features would go here...</p></div>
const ContestPage = () => <div style={{minHeight: '60vh', padding: '20px'}}><h2>Contest Page</h2><p>Contest listings/information would go here...</p></div>


function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Ensure footer stays at bottom */}
            <Navbar />
            <main style={{ flex: '1', width: '100%' }}> {/* Main content area takes available space */}
                 {/* No global padding here, handled by pages/components */}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

                    {/* Placeholder Public Routes from Navbar */}
                    <Route path="/problems" element={<ProblemsPage />} />
                    <Route path="/mock-interview" element={<MockInterviewPage />} />
                    <Route path="/contest" element={<ContestPage />} />


                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        {/* Add other protected routes here (e.g., user profile) */}
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/editor/:problemId" element={<CodeEditorPage />} />
                        {/* Add other protected routes here */}
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/adminDashboard" element={<AdminDashboard />} />
                        {/* Add other protected routes here */}
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/addProblem" element={<AddProblems />} />
                        {/* Add other protected routes here */}
                    </Route>

                    {/* Catch-all Not Found Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer /> {/* Add Footer */}
        </div>
    );
}

export default App;