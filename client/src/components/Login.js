import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import styles from './Login.module.css';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log("fdsjac b");
        e.preventDefault();
        setError('');
        try {
            await login({ emailOrUsername, password });
            navigate('/dashboard');
        } catch (err) {
            console.error("Login component error catch:", err);
            const message = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
            setError(message);
        }
    };
    


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Welcome Back!</h2> {/* More engaging title */}

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {/* Email/Username Input */}
                    <div className={styles.inputGroup}>
                        <FaUser className={styles.inputIcon} /> {/* User Icon */}
                        <input
                            type="text"
                            id="emailOrUsername"
                            className={styles.formInput} // Apply input style
                            placeholder="Email or Username" // Use placeholder
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Password Input */}
                    <div className={styles.passwordInputGroup}> {/* Specific group for password */}
                        <FaLock className={styles.inputIcon} /> {/* Lock Icon */}
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle type
                            id="password"
                            className={styles.formInput} // Apply input style
                            placeholder="Password" // Use placeholder
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        {/* Password Toggle Button */}
                        <span onClick={togglePasswordVisibility} className={styles.passwordToggleIcon}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {/* Conditionally render spinner */}
                        {loading && <span className={styles.spinner}></span>}
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;