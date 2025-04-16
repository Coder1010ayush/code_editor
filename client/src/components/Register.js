import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Register.module.css'; // Import the CSS module

function Register() {
    const [username, setUsername] = useState('');
    const [enrol_no , setEnrol] = useState('');
    const [name , setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register({ username, enrol_no , name, email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.heading}>Register</h2>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={styles.inputGroup}>
                        <FaUser className={styles.inputIcon} />
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <FaUser className={styles.inputIcon} />
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div> 

                    <div className={styles.inputGroup}>
                        <FaUser className={styles.inputIcon} />
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Enrollment Number"
                            value={enrol_no}
                            onChange={(e) => setEnrol(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <FaEnvelope className={styles.inputIcon} />
                        <input
                            type="email"
                            className={styles.formInput}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.passwordInputGroup}>
                        <FaLock className={styles.inputIcon} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={styles.formInput}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <span onClick={togglePasswordVisibility} className={styles.passwordToggleIcon}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className={styles.passwordInputGroup}>
                        <FaLock className={styles.inputIcon} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={styles.formInput}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={toggleConfirmPasswordVisibility} className={styles.passwordToggleIcon}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading && <span className={styles.spinner}></span>}
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className={styles.link}>
                    Already have an account? <Link to="/login" className={styles.linkText}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;