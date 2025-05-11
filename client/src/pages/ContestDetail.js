import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./ContestDetail.module.css";

const ContestDetail = () => {
  const { id } = useParams(); // contest ID from route
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contest and then fetch each question
  useEffect(() => {
    const fetchContestAndQuestions = async () => {
      try {
        // 1. Fetch contest by ID
        const contestRes = await axios.get(`/api/contests/${id}`);
        setContest(contestRes.data);

        // 2. Fetch each question by its ID
        const questionIds = contestRes.data.questions || [];

        const questionPromises = questionIds.map((qid) =>
          axios.get(`/api/problems/${qid}`).then((res) => res.data)
        );

        const questionDetails = await Promise.all(questionPromises);
        setQuestions(questionDetails);
      } catch (err) {
        console.error("Error loading contest or questions:", err);
        setError("Failed to load contest or questions");
      } finally {
        setLoading(false);
      }
    };

    fetchContestAndQuestions();
  }, [id]);

  if (loading)
    return <div className={styles.statusText}>Loading contest...</div>;
  if (error) return <div className={styles.statusText}>{error}</div>;
  if (!contest)
    return <div className={styles.statusText}>Contest not found</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{contest.name}</h2>
      <p className={styles.description}>{contest.description}</p>

      <h3 className={styles.problemHeader}>Questions</h3>
      {questions.length > 0 ? (
        <ul className={styles.problemList}>
          {questions.map((question) => (
            <li key={question._id} className={styles.problemItem}>
              <Link
                to={`/problems/${question._id}`}
                className={styles.problemLink}
              >
                {question.name}
              </Link>
              <p className={styles.problemInfo}>{question.difficulty}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noProblems}>No questions assigned yet.</p>
      )}
    </div>
  );
};

export default ContestDetail;
