import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ContestDetail.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // No need for useLocation now
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { FaAppleAlt } from 'react-icons/fa';
import CodeEditorPage from './Editor';

const ContestDetail = () => {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log("contest id is ", id);
    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const contestResponse = await axios.get(`/api/contests/${id}`);
                // console.log("contest response is " , contestResponse);
                const contestData = contestResponse.data;
                setContest(contestData);

                const questionIds = contestData.questions || [];
                // console.log("Question IDs:", questionIds);

                const questionPromises = questionIds.map(qid =>
                    axios.get(`/api/problems/${qid}`)
                );
                const questionsData = await Promise.all(questionPromises);

                const fullQuestions = questionsData.map(q => q.data);
                setQuestions(fullQuestions);

                // Automatically select the first question if available
                if (fullQuestions.length > 0) {
                    setSelectedQuestion(fullQuestions[0]);
                }
                console.log("selected questions are " , fullQuestions[0]);
            } catch (error) {
                setError("Error fetching contest details. Please try again later.");
                console.error("Error fetching contest details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContestDetails();
    }, [id]);

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
    };

    return (
        <div className={styles.container}>
            <h1>{loading ? 'Loading contest details...' : contest ? contest.name : 'Contest not found'}</h1>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading questions...</div>
            ) : (
                <div className={styles.questionsList}>
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <div
                                key={question._id}
                                className={`${styles.questionItem} ${selectedQuestion && selectedQuestion._id === question._id ? styles.selected : ''}`}
                                onClick={() => handleQuestionSelect(question)}
                            >
                                {question.title}
                            </div>
                        ))
                    ) : (
                        <div>No questions available for this contest</div>
                    )}
                </div>
            )}

            <div className={styles.editorContainer}>
                {selectedQuestion ? (
                    <CodeEditorPage problemId={selectedQuestion._id } _contest_id={id} />
                ) : (
                    !loading && <div>Select a question to start solving!</div>
                )}
            </div>
        </div>
    );
};

export default ContestDetail;
