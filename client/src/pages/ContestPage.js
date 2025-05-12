// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './ContestPage.module.css';
// import { Link } from 'react-router-dom';
// import { useAuth } from "../context/AuthContext";


// const ContestPage = () => {
//     const [contests, setContests] = useState([]);
//     const [filteredContests, setFilteredContests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');

//     const {user} = useAuth();
//     useEffect(() => {
//         const fetchContests = async () => {
//             try {
//                 const response = await axios.get('/api/contests');
//                 setContests(response.data);
//                 setFilteredContests(response.data);
//             } catch (err) {
//                 setError('Failed to load contests. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchContests();
//     }, []);

//     useEffect(() => {
//         const filtered = contests.filter(contest =>
//             contest.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredContests(filtered);
//     }, [searchTerm, contests]);

//     const fixedImage = '/contest-image.ico';

//     if (loading) return <div className={styles.statusText}>Loading contests...</div>;
//     if (error) return <div className={styles.statusText} style={{ color: 'red' }}>{error}</div>;

//     return (
//         <div className={styles.wrapper}>
//             <h2 className={styles.heading}>Available Contests</h2>

//             <input
//                 type="text"
//                 placeholder="Search contests by name..."
//                 className={styles.searchBox}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <div className={styles.cardGrid}>
//                 {filteredContests.length > 0 ? (
//                     filteredContests.map(contest => (
//                         <Link
//                             to={`/contest/${contest._id}`}
//                             key={contest._id}
//                             className={styles.cardLink}
//                         >
//                             <div className={styles.card}>
//                                 <img
//                                     src={fixedImage}
//                                     alt={contest.name}
//                                     className={styles.cardImage}
//                                 />
//                                 <div className={styles.cardContent}>
//                                     <h3 className={styles.cardTitle}>{contest.name}</h3>
//                                     <p className={styles.cardDescription}>{contest.description}</p>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))
//                 ) : (
//                     <p className={styles.statusText}>No contests found.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ContestPage;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ContestPage.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ContestPage = () => {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('/api/contests');
                setContests(response.data);
                setFilteredContests(response.data);
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

    const handleJoin = async (contestId) => {
        try {
            const response = await axios.put(`/api/contests/${contestId}/join`, {
                username: user.username,
            });
    
            setContests(prev =>
                prev.map(contest =>
                    contest._id === contestId ? response.data : contest
                )
            );
            console.log(`User ${user.username} joined contest ${contestId}`);
        } catch (error) {
            console.error('Failed to join contest:', error);
        }
    };
    

    const fixedImage = '/contest-image.ico';

    if (loading) return <div className={styles.statusText}>Loading contests...</div>;
    if (error) return <div className={styles.statusText} style={{ color: 'red' }}>{error}</div>;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>Available Contests</h2>

            <input
                type="text"
                placeholder="Search contests by name..."
                className={styles.searchBox}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.cardGrid}>
                {filteredContests.length > 0 ? (
                    filteredContests.map(contest => {
                        const isJoined = contest.participants.includes(user.username);

                        return (
                            <div key={contest._id} className={styles.card}>
                                <img
                                    src={fixedImage}
                                    alt={contest.name}
                                    className={styles.cardImage}
                                />
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{contest.name}</h3>
                                    <p className={styles.cardDescription}>{contest.description}</p>

                                    {isJoined ? (
                                        <Link to={`/contest/${contest._id}`} key={contest._id} className={styles.cardLink}>
                                            <button className={styles.joinButton}>Open</button>
                                        </Link>
                                    ) : (
                                        <button
                                            className={styles.joinButton}
                                            onClick={() => handleJoin(contest._id)}
                                        >
                                            Join
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles.statusText}>No contests found.</p>
                )}
            </div>
        </div>
    );
};

export default ContestPage;
