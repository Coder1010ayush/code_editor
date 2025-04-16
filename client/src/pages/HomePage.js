import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation like buttons
import styles from './HomePage.module.css'; // We'll create this CSS file next

const HomePage = () => {
    // Data for sections (can be fetched from API later)
    const features = [
        { title: 'Vast Problem Set', description: 'Access a wide range of coding problems across various difficulty levels and topics.' },
        { title: 'Real-time Collaboration', description: 'Collaborate with other users on problems and learn from each other.' },
        { title: 'Detailed Solutions', description: 'Explore detailed solutions and explanations for each problem.' },
        { title: 'Mock Interviews', description: 'Practice your interviewing skills with realistic mock interviews.' },
        { title: 'Progress Tracking', description: 'Track your progress and identify areas for improvement.' },
        { title: 'Community Support', description: 'Engage with a supportive community of fellow learners and experts.' },
    ];

    const categories = [
        'Algorithms', 'Data Structures', 'Databases', 'Dynamic Programming',
        'Math', 'String', 'Sorting', 'Graph'
    ];

    return (
        <div className={styles.homePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1>Level Up Your Coding Skills</h1>
                <p>Practice coding problems, prepare for interviews, and join a community of developers.</p>
                {/* Assuming '/problems' is where users start solving */}
                <Link to="/problems" className={styles.ctaButton}>Start Solving</Link>
                 {/* You'll need to add a /problems route later */}
            </section>

            {/* Why Choose Us Section */}
            <section className={styles.features}>
                <h1>Why Choose SparkX?</h1> {/* Changed from LeetCode Clone */}
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.gridItem}>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Explore Categories Section */}
            <section className={styles.categories}>
                <h1>Explore Problem Categories</h1>
                <div className={styles.grid}>
                    {categories.map((category, index) => (
                        <div key={index} className={`${styles.gridItem} ${styles.categoryItem}`}>
                            <h3>{category}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;