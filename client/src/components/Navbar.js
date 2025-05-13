import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css"; // Use CSS Modules
import { DashBoard } from "../pages/DashBoard";
import DarkModeToggle from "./DarkModeToggle";
function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed from Navbar:", error);
    }
  };

  // Don't render auth buttons until loading is complete
  const renderAuthButtons = () => {
    if (loading) {
      return <div className={styles.loadingPlaceholder}></div>; // Placeholder for spacing
    }
    if (user) {
      return (
        <>
          <Link to="/DashBoard" className={styles.welcomeMessage}>
            Welcome, {user.username}!
          </Link>
          <button
            onClick={handleLogout}
            className={`${styles.navButton} ${styles.logoutButton}`}
            disabled={loading}
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/login"
            className={`${styles.navButton} ${styles.loginButton}`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`${styles.navButton} ${styles.signupButton}`}
          >
            Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          SparkX
        </Link>{" "}
        {/* Logo */}
        <div className={styles.navLinks}>
          {/* Add other nav links here if needed later */}
          <Link to="/problems" className={styles.navLink}>
            Problems
          </Link>
          
          <Link to="/prev_contest" className={styles.navLink}>
            Previous Contest

          </Link>

          <Link to="/contest" className={styles.navLink}>
            Contest
          </Link>
          {/* Create routes for /problems, /mock-interview, /contest later */}
        </div>
        <div className={styles.navAuth}>
          <DarkModeToggle />
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
