import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProblemsPage.module.css';

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
                    {/* Add more categories here */}
                </select>
            </div>

            <div className={styles.problemList}>
                {filteredProblems.map((problem, index) => (
                    <div key={problem._id} className={styles.card}>
                        <Link to={`/problems/${problem._id}`} className={styles.cardTitle}>
                            <h3>{problem.title}</h3>
                        </Link>
                        <div className={styles.cardMeta}>
                            <span className={styles[problem.difficulty.toLowerCase()]}>
                                {problem.difficulty}
                            </span>
                            <span className={styles.category}>{problem.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemsPage;
