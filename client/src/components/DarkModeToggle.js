// src/components/DarkModeToggle.jsx
import { useEffect, useState } from 'react';
import styles from './DarkModeToggle.module.css';

export default function 
DarkModeToggle() {
  const [dark, setDark] = useState(true);

  // On mount, read saved preference (default → dark)
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') {
      document.body.classList.add('dark');
      setDark(true);
    } else {
      document.body.classList.remove('dark');
      setDark(false);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      className={styles.toggleButton}
      aria-label="Toggle theme"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
