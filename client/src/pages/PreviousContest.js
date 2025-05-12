import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import styles from './PreviousContest.module.css';
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';

const PreviousContestPage = () => {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('/api/contests');
                const closedContests = response.data.filter(c => c.status === 'close');
                setContests(closedContests);
                setFilteredContests(closedContests);
            } catch (err) {
                setError('Failed to load contests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    useEffect(() => {
        const filtered = contests.filter(contest =>
            contest.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContests(filtered);
    }, [searchTerm, contests]);

    const handleClick = (contest) => {
        navigate("/leaderboard", { state: { contest } });
    };

    const fixedImage = '/contest-image.ico';

    if (loading) return <div className={styles.statusText}>Loading contests...</div>;
    if (error) return <div className={styles.statusText} style={{ color: 'red' }}>{error}</div>;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>Closed Contests</h2>

            <input
                type="text"
                placeholder="Search contests by name..."
                className={styles.searchBox}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.cardGrid}>
                {filteredContests.length > 0 ? (
                    filteredContests.map(contest => (
                        <div key={contest._id} className={styles.card}>
                            <img
                                src={fixedImage}
                                alt={contest.name}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{contest.name}</h3>
                                <p className={styles.cardDescription}>{contest.description}</p>

                                <button className={styles.joinButton} onClick={() => {
                                    navigate("/leaderboard", { state: { contest_data: contest.participants } });
                                }}>
                                    Open
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.statusText}>No contests found.</p>
                )}
            </div>
        </div>
    );
};

export default PreviousContestPage;
