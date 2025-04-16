import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear(); // Get current year dynamically

    return (
        <footer className={styles.footer}>
            <p>&copy; {currentYear} SparkX. All rights reserved.</p>
        </footer>
    );
};

export default Footer;