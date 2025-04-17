// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import styles from './DashBoard.module.css'; // We'll create this CSS file next

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserCircle, faTrophy, faCheckCircle, faStar, faChartBar } from '@fortawesome/free-solid-svg-icons';

// const DashboardPage = () => {
//     const { user } = useAuth();
//     const username = user && user.username ? user.username : 'User';

//     // Placeholder data for profile information
//     const solvedProblems = 150;
//     const ranking = 1250;
//     const completionRate = 75;
//     const streak = 30;
//     const badges = [
//         { name: 'Problem Solver', icon: faCheckCircle },
//         { name: 'Top 15%', icon: faTrophy },
//         { name: 'Consistent Coder', icon: faStar },
//     ];

//     return (
//         <div className={styles.dashboardContainer}>
//             <div className={styles.profileCard}>
//                 <div className={styles.profileHeader}>
//                     <FontAwesomeIcon icon={faUserCircle} className={styles.profileAvatar} />
//                     <h2 className={styles.username}>{username}</h2>
//                 </div>
//                 <div className={styles.profileStats}>
//                     <div className={styles.statItem}>
//                         <FontAwesomeIcon icon={faCheckCircle} className={styles.statIcon} />
//                         <span>{solvedProblems} Problems Solved</span>
//                     </div>
//                     <div className={styles.statItem}>
//                         <FontAwesomeIcon icon={faTrophy} className={styles.statIcon} />
//                         <span>Ranking: #{ranking}</span>
//                     </div>
//                     <div className={styles.statItem}>
//                         <FontAwesomeIcon icon={faChartBar} className={styles.statIcon} />
//                         <span>Completion Rate: {completionRate}%</span>
//                     </div>
//                     <div className={styles.statItem}>
//                         <FontAwesomeIcon icon={faStar} className={styles.statIcon} />
//                         <span>Current Streak: {streak} days</span>
//                     </div>
//                 </div>
//                 <div className={styles.profileBadges}>
//                     <h3>Badges</h3>
//                     <div className={styles.badgeList}>
//                         {badges.map((badge, index) => (
//                             <div key={index} className={styles.badgeItem}>
//                                 <FontAwesomeIcon icon={badge.icon} className={styles.badgeIcon} />
//                                 <span>{badge.name}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             {/* You can add more dashboard content below the profile */}
//         </div>
//     );
// };

// export default DashboardPage;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './DashBoard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className={styles.dashboardContainer}>
            {/* Left Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.profile}>
                    <FontAwesomeIcon icon={faUserCircle} className={styles.avatar} />
                    <h2>{user.username}</h2>
                    <p className={styles.tag}>Internship</p>
                    <p className={styles.rank}>Rank ~5,000,000</p>
                    <button className={styles.editBtn}>Edit Profile</button>
                </div>

                <div className={styles.stats}>
                    <h3>Community Stats</h3>
                    <ul>
                        <li>Views: <span>0</span></li>
                        <li>Solutions: <span>0</span></li>
                        <li>Discuss: <span>0</span></li>
                        <li>Reputation: <span>0</span></li>
                    </ul>
                </div>

                <div className={styles.languages}>
                    <h3>Languages</h3>
                    <p>Not enough data</p>
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

            {/* Main Dashboard */}
            <main className={styles.mainContent}>
                <section className={styles.progressSection}>
                    <div className={styles.progressCard}>
                        <div className={styles.solved}>
                            <p>0 / 3521</p>
                            <span>Solved</span>
                        </div>
                        <div className={styles.levels}>
                            <p><span className={styles.easy}>Easy:</span> 0 / 873</p>
                            <p><span className={styles.medium}>Medium:</span> 0 / 1826</p>
                            <p><span className={styles.hard}>Hard:</span> 0 / 822</p>
                        </div>
                    </div>
                    <div className={styles.badgeCard}>
                        <p>Locked Badge</p>
                        <strong>Apr LeetCoding Challenge</strong>
                    </div>
                </section>

                <section className={styles.calendarSection}>
                    <h3>0 submissions in the past one year</h3>
                    <div className={styles.calendar}>
                        {/* Implement heatmap here */}
                        Calendar Placeholder
                    </div>
                </section>

                <section className={styles.submissionSection}>
                    <div className={styles.tabs}>
                        <button>Recent AC</button>
                        <button>List</button>
                        <button>Solutions</button>
                        <button>Discuss</button>
                        <span>View all submissions &gt;</span>
                    </div>
                    <div className={styles.noSubmissions}>
                        <p>No recent submissions</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
