import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContestDetail.module.css';
import axios from 'axios';
import CodeEditorPage from './Editor';

const ContestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contest, setContest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null); 

    // Fetch contest and questions
    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const contestResponse = await axios.get(`/api/contests/${id}`);
                const contestData = contestResponse.data;
                setContest(contestData);

                const questionIds = contestData.questions || [];
                const questionPromises = questionIds.map(qid =>
                    axios.get(`/api/problems/${qid}`)
                );
                const questionsData = await Promise.all(questionPromises);
                const fullQuestions = questionsData.map(q => q.data);
                setQuestions(fullQuestions);
            } catch (err) {
                setError("Error fetching contest details. Please try again later.");
                console.error("Error fetching contest details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContestDetails();
    }, [id]);

    useEffect(() => {
        if (questions.length > 0 && !selectedQuestion) {
            setSelectedQuestion(questions[0]);
        }
    }, [questions, selectedQuestion]);

    useEffect(() => {
        if (!contest) return;

        const endTime = new Date(contest.end_time);

        const updateTimer = () => {
            const now = new Date();
            const diff = Math.max(0, endTime - now);
            if (diff === 0) {
                navigate('/contests');
                return;
            }

            const seconds = Math.floor(diff / 1000) % 60;
            const minutes = Math.floor(diff / 1000 / 60) % 60;
            const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
            const days = Math.floor(diff / 1000 / 60 / 60 / 24);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer(); // Initial call ninja hack always works never fails
        const timerId = setInterval(updateTimer, 1000);

        return () => clearInterval(timerId);
    }, [contest, navigate]);

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
    };

    const renderTimeLeft = () => {
        if (!timeLeft) return null;
        const { days, hours, minutes, seconds } = timeLeft;
        return (
            <div className={styles.timer}>
                Time Left: {days}d {hours}h {minutes}m {seconds}s
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h2>{loading ? 'Loading...' : contest ? contest.name : 'Contest not found'}</h2>
                {renderTimeLeft()}
    
                {error && <div className={styles.error}>{error}</div>}
    
                <div className={styles.questionList}>
                    {loading ? (
                        <div className={styles.loading}>Loading questions...</div>
                    ) : questions.length > 0 ? (
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
                        <div>No questions available</div>
                    )}
                </div>
            </div>
    
            {/* Main Editor Area */}
            <div className={styles.mainContent}>
                <div className={styles.editorContainer}>
                    {selectedQuestion ? (
                        <CodeEditorPage problemId={selectedQuestion._id} _contest_id={id} />
                    ) : (
                        !loading && <div className={styles.selectMessage}>Select a question to start solving!</div>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default ContestDetail;
