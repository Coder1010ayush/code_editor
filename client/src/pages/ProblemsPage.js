import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProblemsPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'; 


const ProblemsPage = () => {
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
        <div className={styles.container}>
            <h1 className={styles.heading}>All Coding Problems</h1>

            <div className={styles.filters}>
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
                    <option value="Tees">Trees</option>
                    <option value="Stack">Stack</option>
                </select>
            </div>

            <div className={styles.problemList}>
                {filteredProblems.map((problem, index) => (
                    <div key={problem._id} className={styles.card}>
                       <Link to={`/problems/${problem._id}`} className={styles.cardTitle}>
                            <h3>
                                <FontAwesomeIcon icon={faPuzzlePiece} className={styles.icon} /> {/* Example */}
                                {problem.title}
                            </h3>
                        </Link>
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
    );
};

export default ProblemsPage;
