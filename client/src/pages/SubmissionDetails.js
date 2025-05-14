import React from 'react';
import { useLocation } from 'react-router-dom';

export default function SubmissionDetailPage() {
  const location = useLocation();
  const {
    question_id,
    lang,
    result,
    submitted_code,
    timestamp,
  } = location.state || {};

  if (!question_id) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading submission details...</p> {/* Added style */}
      </div>
    );
  }

  const isSuccess = result === "Success";

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Submission Detail</h2>

      <div style={styles.detailGrid}>
        {/* Detail Item Card - using inline style for hover effect demonstration */}
        <div style={styles.detailItem}>
          <strong>Question ID:</strong>
          <span style={styles.detailValue}>{question_id}</span>
        </div>
        <div style={styles.detailItem}>
          <strong>Language:</strong>
          <span style={styles.detailValue}>{lang}</span>
        </div>
        <div style={styles.detailItem}>
          <strong>Status:</strong>
          <span style={{ ...styles.detailValue, color: isSuccess ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 'bold' }}> {/* Made status bold */}
            {result}
          </span>
        </div>
        <div style={styles.detailItem}>
          <strong>Submitted At:</strong>
          <span style={styles.detailValue}>{new Date(timestamp).toLocaleString()}</span>
        </div>
      </div>

      <h3 style={styles.subHeading}>Submitted Code:</h3>
      <pre style={styles.codeBlock}>{submitted_code}</pre>
    </div>
  );
}

const styles = {
  // CSS Variables for Dark Theme (Adjusted Colors)
  '--color-background': '#181818',     // Deeper dark background
  '--color-text': '#ededed',           // Lighter text for better contrast
  '--color-card-background': '#282828', // Distinct card background
  '--color-border': '#404040',         // Slightly more visible border
  '--color-success': '#8bc34a',        // Brighter green for success
  '--color-error': '#ff7043',          // A warm red/orange for error
  '--color-primary': '#03a9f4',        // A vibrant blue as accent
  '--color-hover': '#3a3a3a',          // Color for hover effect

  container: {
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    minHeight: '100vh',
    padding: '3rem', // Increased padding
    fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'background-color 0.3s ease', // Smooth background transition
  },
  heading: {
    color: 'var(--color-primary)',
    marginBottom: '2rem', // Increased margin
    borderBottom: '2px solid var(--color-border)',
    paddingBottom: '0.8rem', // Increased padding
    fontSize: '2rem', // Larger heading
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Adjusted minmax
    gap: '1.5rem', // Increased gap
    marginBottom: '3rem', // Increased margin
  },
  detailItem: {
    backgroundColor: 'var(--color-card-background)',
    padding: '1.5rem', // Increased padding
    borderRadius: '10px', // More rounded corners
    border: '1px solid var(--color-border)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // More prominent shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease', // Animation for hover
    ':hover': { // Inline pseudo-class is not standard JS object. This needs CSS or a library.
      transform: 'translateY(-5px)', // Lift effect on hover
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
      backgroundColor: 'var(--color-hover)',
    }
  },
  detailValue: {
    marginLeft: '0.7rem', // Increased margin
    fontWeight: 'normal',
  },
  subHeading: {
    color: 'var(--color-primary)',
    marginBottom: '1.5rem', // Increased margin
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '0.5rem',
    fontSize: '1.5rem', // Larger sub-heading
  },
  codeBlock: {
    backgroundColor: '#2b2b2b',
    color: '#dcdcdc', // Lighter color for code
    padding: '2rem', // Increased padding
    borderRadius: '10px', // More rounded corners
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    overflowX: 'auto',
    border: '1px solid var(--color-border)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    fontSize: '1rem', // Slightly larger font size for code
    lineHeight: '1.6', // Increased line height for readability
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace", // Popular coding fonts
  },
  // Loading state styles
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
  },
  loadingText: { // Style for loading text
      marginTop: '1rem',
      fontSize: '1.2rem',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid var(--color-primary)',
    borderRadius: '50%',
    width: '50px', // Larger spinner
    height: '50px', // Larger spinner
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem', // Increased margin
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

