import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './DashBoard.module.css';
import { useNavigate } from 'react-router-dom';
import styless from './AdminDashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        if (user?.role === 'User' && user.username) {
            fetch(`http://localhost:5001/api/submit/user/${user.username}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch submissions');
                    return res.json();
                })
                .then(data => setSubmissions(data))
                .catch(console.error);
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    if (user.role === 'Admin') {
        const avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D";
        const options = [
            { id: 1, name: 'Add Problem Statement', action: 'add_problem' },
            { id: 2, name: 'Create a Contest', action: 'create_contest' },
            { id: 3, name: 'See Previous Contests', action: 'view_contests' },
        ];

        const handleOptionClick = (optionAction) => {
            if (optionAction === "add_problem") {
                navigate("/addProblem");
            } else if (optionAction === "create_contest") {
                navigate("/addContest");
            } else {
                navigate("/previous-contests");
            }
        };

        return (
            <div className={styless.dashboardContainer}>
                <div className={styless.userInfo}>
                    <img src={avatarUrl} alt="avatar" className={styless.avatar} />
                    <div className={styless.userName}>
                        <h2>Welcome, {user.name}!</h2>
                    </div>
                </div>
                <div className={styless.optionsList}>
                    {options.map(option => (
                        <div
                            key={option.id}
                            className={styless.optionItem}
                            onClick={() => handleOptionClick(option.action)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
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
    }

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.profile}>
                    <FontAwesomeIcon icon={faUserCircle} className={styles.avatar} />
                    <h2>{user.username}</h2>
                    <p className={styles.tag}>Student</p>
                    <p className={styles.rank}>Rank ~{user.rank || 'Unranked'}</p>
                    <button className={styles.editBtn}>Edit Profile</button>
                </div>

                <div className={styles.stats}>
                    <h3>Community Stats</h3>
                    <ul>
                        <li>Views: <span>0</span></li>
                        <li>Solutions: <span>
                            {(Number(user.no_easy) || 0) + (Number(user.no_med) || 0) + (Number(user.no_hard) || 0)}
                            </span>
                        </li>
                        <li>Discuss: <span>0</span></li>
                        <li>Reputation: <span>0</span></li>
                    </ul>
                </div>

                <div className={styles.languages}>
                    <h3>Languages</h3>
                    {user.lang_used?.length > 0 ? (
                        <ul>
                            {user.lang_used.map((lang, idx) => <li key={idx}>{lang}</li>)}
                        </ul>
                    ) : (
                        <p>Not enough data</p>
                    )}
                </div>

                <div className={styles.skills}>
                    <h3>Skills</h3>
                    <ul>
                        <li>Advanced: <span>Not enough data</span></li>
                        <li>Intermediate: <span>Not enough data</span></li>
                        <li>Fundamental: <span>Not enough data</span></li>
                    </ul>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <section className={styles.progressSection}>
                    <div className={styles.progressCard}>
                        <div className={styles.solved}>
                            <p>{user.no_easy + user.no_med + user.no_hard} / 3521</p>
                            <span>Solved</span>
                        </div>
                        <div className={styles.levels}>
                        <p><span className={styles.easy}>Easy:</span> {isNaN(user.no_easy) ? 0 : user.no_easy} / 873</p>
                        <p><span className={styles.medium}>Medium:</span> {isNaN(user.no_med) ? 0 : user.no_med} / 1826</p>
                        <p><span className={styles.hard}>Hard:</span> {isNaN(user.no_hard) ? 0 : user.no_hard} / 822</p>

                        </div>
                    </div>
                    <div className={styles.badgeCard}>
                        <p>Locked Badge</p>
                        <strong>Apr Coding Challenge</strong>
                    </div>
                </section>

                <section className={styles.calendarSection}>
                    <h3>{submissions.length} submissions in the past one year</h3>
                    <div className={styles.calendar}>Calendar Placeholder</div>
                </section>

                <section className={styles.submissionSection}>
                    <div className={styles.tabs}>
                        <button>Recent AC</button>
                        <button>List</button>
                        <button>Solutions</button>
                        <button>Discuss</button>
                        <span>View all submissions &gt;</span>
                    </div>

                    <div className={styles.submissionCards}>
                        {submissions.length > 0 ? (
                            submissions.map((submission, idx) => (
                                <div
                                    key={idx}
                                    className={styles.submissionCard}
                                    onClick={() => navigate("/submission-detail", { state: { ...submission } })}
                                >
                                    <p className={styles.submissionStatus}>
                                        <strong>Status :        </strong> 
                                        <span className={submission.result === "Success" ? styles.successStatus : styles.failStatus}>
                                            {submission.result}
                                        </span>
                                    </p>
                                    <p><strong>Submitted At :          </strong> {new Date(submission.timestamp).toLocaleString()}</p>

                                </div>

                            ))
                        ) : (
                            <p>No recent submissions</p>
                        )}
                    </div>

                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
