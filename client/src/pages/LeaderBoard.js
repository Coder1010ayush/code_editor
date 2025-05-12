import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import styles from './LeaderBoard.module.css';

const LeaderBoard = () => {
    const location = useLocation();
    const userData = location.state?.contest_data;
    console.log("userdata is " , userData);
    
  
  const [rankedUsers, setRankedUsers] = useState([]);


  useEffect(() => {
    if (!userData || userData.length === 0) {
      setRankedUsers([]);
      return;
    }

    const sortedUsers = [...userData].sort((a, b) => {
      if (b.curr_score !== a.curr_score) {
        return b.curr_score - a.curr_score; 
      }
      const timeA = new Date(a.latest_time).getTime();
      const timeB = new Date(b.latest_time).getTime();
      return timeA - timeB;
    });

    const rankedData = sortedUsers.map((user, index) => {
      let rank = index + 1;
      if (index > 0) {
        const prevUser = sortedUsers[index - 1];
        const prevTime = new Date(prevUser.latest_time).getTime();
        const currentTime = new Date(user.latest_time).getTime();

        if (user.curr_score === prevUser.curr_score && currentTime === prevTime) {
          rank = rankedData[index - 1].rank;
        }
      }

      const formattedTime = new Date(user.latest_time).toLocaleString(); 

      return {
        ...user,
        rank: rank,
        formattedTime: formattedTime,
      };
    });

    setRankedUsers(rankedData);

  }, [userData]); 

  return (
    <div className={styles.leaderboardContainer}>
      <h1 className={styles.leaderboardTitle}>Leaderboard</h1>

      {rankedUsers.length === 0 ? (
        <p className={styles.noDataMessage}>No leaderboard data available yet.</p>
      ) : (
        <table className={styles.leaderboardTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
              <th>Latest Time</th>
            </tr>
          </thead>
          <tbody>
            {rankedUsers.map((user, index) => (
              <tr
                key={user.username}
                className={`${styles.tableRow} ${user.rank <= 3 ? styles.topRank : ''}`}
                style={{ '--index': index }}
              >
                <td className={styles.rankCell}>{user.rank}</td>
                <td className={styles.usernameCell}>{user.username}</td>
                <td className={styles.scoreCell}>{user.curr_score}</td>
                <td className={styles.timeCell}>{user.formattedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderBoard;