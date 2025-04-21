import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // No need for useLocation now
import styles from './ProblemsPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { FaAppleAlt } from 'react-icons/fa';


const ProblemsPage = () => {

    // const theme = localStorage.getItem('theme') ; 
    // console.log('Current theme:', theme);
    // const darkMode = theme === 'dark';
    // const themeClass = darkMode ? styles.dark : styles.light;

    // ... (filters state and useEffect fetch are the same) ...
     const [problems, setProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: '',
        category: ''
    });

    useEffect(() => {
        fetch('/api/problems')
            .then(res => res.json())
            .then(data => setProblems(data))
            .catch(err => console.error('Error fetching problems:', err));
    }, []);

     const filteredProblems = problems.filter(problem => {
        return (
            (filters.difficulty ? problem.difficulty.toLowerCase() === filters.difficulty : true) &&
            (filters.category ? problem.category === filters.category : true)
        );
    });


    return (
        // <div className={themeClass}>
        <div className={styles.container}>
            {/* ... (heading and filters are the same) ... */}
            <h1 className={styles.heading}>Coding Problems</h1>

            <div className={styles.filters}>
                 {/* ... filter selects ... */}
                 <select
                    className={styles.filterSelect}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    value={filters.difficulty}
                >
                    <option value="">Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <select
                    className={styles.filterSelect}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    value={filters.category}
                >
                    <option value="">Select Category</option>
                    <option value="Math">Math</option>
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Graph">Graph</option>
                    <option value="Sorting">Sorting</option>
                    <option value="Database">Database</option>
                    <option value="Greedy">Greedy</option>
                    <option value="Trees">Trees</option>
                    <option value="Stack">Stack</option>
                </select>
            </div>


            <div className={styles.problemList}>
                {filteredProblems.map((problem, index) => (
                    <div key={problem._id} className={styles.card}>
                       {/* CHANGE THIS LINK BACK TO USE THE PROBLEM ID IN THE PATH */}
                       {/* Use template literals to insert the ID */}
                       <Link to={`/editor/${problem._id}`} className={styles.cardTitle}>
                            <h3>
                                <FontAwesomeIcon icon={faPuzzlePiece} className={styles.icon} />
                                {problem.title}
                            </h3>
                        </Link>
                        {/* ... rest of the card meta ... */}
                        <div className={styles.cardMeta}>
                            <span className={`${styles.difficulty} ${styles[problem.difficulty.toLowerCase()]}`}>
                                {/* Example using a simple circle icon */}
                                {problem.difficulty === 'Easy' && '🟢'}
                                {problem.difficulty === 'Medium' && '🟡'}
                                {problem.difficulty === 'Hard' && '🔴'}
                                {problem.difficulty}
                            </span>
                            <span className={styles.category}>
                                {/* You can add category-specific icons here similarly */}
                                {problem.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        // </div>
    );
};

export default ProblemsPage;