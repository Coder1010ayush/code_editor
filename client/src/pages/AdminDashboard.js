// pages/AdminDashboard.js

import React from 'react';
import styles from './AdminDashboard.module.css'; // Import the CSS module

const AdminDashboard = () => {

    // Placeholder data for admin info
    const admin = {
        name: 'Admin User',
        avatarUrl: 'https://via.placeholder.com/150/0070f3/ffffff?text=AD', // Placeholder image URL
    };

    // List of admin options
    const options = [
        { id: 1, name: 'Add Problem Statement', action: 'add_problem' },
        { id: 2, name: 'Create a Contest', action: 'create_contest' },
        { id: 3, name: 'See Previous Contests', action: 'view_contests' },
    ];

    // Handler for option clicks (placeholder for now)
    const handleOptionClick = (optionAction) => {
        console.log(`Option clicked: ${optionAction}`);
        // In a real application, you would navigate or trigger an action here
        // Example: router.push('/admin/add-problem');
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Admin Info Section */}
            <div className={styles.userInfo}>
                <img
                    src={admin.avatarUrl}
                    alt={`${admin.name}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.userName}>
                    <h2>Welcome, {admin.name}!</h2>
                </div>
            </div>

            {/* Options Section */}
            <div className={styles.optionsList}>
                {options.map(option => (
                    <div
                        key={option.id}
                        className={styles.optionItem}
                        onClick={() => handleOptionClick(option.action)}
                        // Optional: Add a role for accessibility if using div as button
                        role="button"
                        tabIndex={0} // Make it focusable
                        onKeyPress={(e) => { // Handle keyboard navigation
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleOptionClick(option.action);
                          }
                        }}
                    >
                        {option.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;