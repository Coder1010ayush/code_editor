import React, { useState, useEffect } from 'react';
import styles from './CreateContest.module.css';

// Simulate fetching problems - Replace with your actual API call
const fetchProblems = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'prob1', name: 'Two Sum' },
        { id: 'prob2', name: 'Add Two Numbers' },
        { id: 'prob3', name: 'Longest Substring Without Repeating Characters' },
        { id: 'prob4', name: 'Median of Two Sorted Arrays' },
        { id: 'prob5', name: 'Longest Palindromic Substring' },
        { id: 'prob6', name: 'Reverse Integer' },
        { id: 'prob7', name: 'String to Integer (atoi)' },
        { id: 'prob8', name: 'Palindrome Number' },
        { id: 'prob9', name: 'Regular Expression Matching' },
        { id: 'prob10', name: 'Container With Most Water' },
      ]);
    }, 500); // Simulate network delay
  });
};

const CreateContest = () => {
  const [contestName, setContestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [contestNumber, setContestNumber] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState(''); // Using a single textarea for simplicity
  const [markingEasy, setMarkingEasy] = useState('');
  const [markingMedium, setMarkingMedium] = useState('');
  const [markingHard, setMarkingHard] = useState('');
  const [status, setStatus] = useState('open'); // Default status
  const [visibility, setVisibility] = useState('public'); // Default visibility

  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblemIdToAdd, setSelectedProblemIdToAdd] = useState(''); // State for the currently selected problem in the dropdown
  const [selectedProblems, setSelectedProblems] = useState([]); // State for the list of problems added to the contest

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProblems = async () => {
      try {
        const problems = await fetchProblems();
        setAvailableProblems(problems);
        // Set default selected problem to the first one if available
        if (problems.length > 0) {
          setSelectedProblemIdToAdd(problems[0].id);
        }
      } catch (err) {
        setError("Failed to fetch problems.");
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    getProblems();
  }, []);

  const handleProblemSelectChange = (event) => {
    setSelectedProblemIdToAdd(event.target.value);
  };

  const handleAddProblem = () => {
    if (selectedProblemIdToAdd) {
        // Check if the problem is already added
        const problemAlreadyAdded = selectedProblems.some(problemId => problemId === selectedProblemIdToAdd);

        if (!problemAlreadyAdded) {
             setSelectedProblems([...selectedProblems, selectedProblemIdToAdd]);
             // Optional: Reset dropdown to default or keep current selection
             // setSelectedProblemIdToAdd(availableProblems.length > 0 ? availableProblems[0].id : '');
        } else {
            alert("Problem already added to the contest.");
        }
    }
  };


  const handleRemoveProblem = (problemIdToRemove) => {
    setSelectedProblems(selectedProblems.filter(problemId => problemId !== problemIdToRemove));
  };

  // Helper function to get problem name from ID
  const getProblemNameById = (id) => {
    const problem = availableProblems.find(p => p.id === id);
    return problem ? problem.name : 'Unknown Problem';
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation
    if (!contestName || !startTime || !endTime || !contestNumber || !description || selectedProblems.length === 0) {
      alert("Please fill in all required fields and select at least one problem.");
      return;
    }

    const newContest = {
      name: contestName,
      start_time: startTime,
      end_time: endTime,
      contest_no: parseInt(contestNumber, 10), // Ensure it's a number
      descr: description,
      rules: rules.split('\n').filter(rule => rule.trim() !== ''), // Split rules by newline
      marking: {
        Easy: parseInt(markingEasy, 10) || 0, // Default to 0 if empty or invalid
        Medium: parseInt(markingMedium, 10) || 0,
        Hard: parseInt(markingHard, 10) || 0,
      },
      questions: selectedProblems, // Array of problem IDs
      status: status,
      visibility: visibility,
      participants: [], // Assuming participants are added later
      // _id and participants will likely be assigned by the backend
    };

    console.log("New Contest Data:", newContest);

    // TODO: Add your API call here to send newContest data to your backend
    // Example: axios.post('/api/createContest', newContest)
    //   .then(response => {
    //     console.log('Contest created successfully:', response.data);
    //     // Redirect or show success message
    //   })
    //   .catch(error => {
    //     console.error('Error creating contest:', error);
    //     // Show error message
    //   });

    alert("Contest data logged to console. Implement API call to create contest.");

    // Reset form (optional - uncomment to clear form after submission)
    // setContestName('');
    // setStartTime('');
    // setEndTime('');
    // setContestNumber('');
    // setDescription('');
    // setRules('');
    // setMarkingEasy('');
    // setMarkingMedium('');
    // setMarkingHard('');
    // setStatus('open');
    // setVisibility('public');
    // setSelectedProblemIdToAdd(availableProblems.length > 0 ? availableProblems[0].id : '');
    // setSelectedProblems([]);
  };

  if (loading) {
    return <div className={styles.container}>Loading problems...</div>;
  }

  if (error) {
    return <div className={`${styles.container} ${styles.error}`}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Contest</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="contestName">Contest Name:</label>
          <input
            type="text"
            id="contestName"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rules">Rules:</label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows="5"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Marking Scheme:</label>
          <div className={styles.markingInputs}>
            <label htmlFor="markingEasy">Easy:</label>
            <input
              type="number"
              id="markingEasy"
              value={markingEasy}
              onChange={(e) => setMarkingEasy(e.target.value)}
              min="0"
            />
            <label htmlFor="markingMedium">Medium:</label>
            <input
              type="number"
              id="markingMedium"
              value={markingMedium}
              onChange={(e) => setMarkingMedium(e.target.value)}
              min="0"
            />
            <label htmlFor="markingHard">Hard:</label>
            <input
              type="number"
              id="markingHard"
              value={markingHard}
              onChange={(e) => setMarkingHard(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* --- Problem Selection Section --- */}
        <div className={styles.formGroup}>
            <label htmlFor="selectProblem">Select Problems:</label>
            <div className={styles.problemSelectionArea}>
                {availableProblems.length > 0 ? (
                    <>
                        <select
                            id="selectProblem"
                            value={selectedProblemIdToAdd}
                            onChange={handleProblemSelectChange}
                            className={styles.problemDropdown}
                            // No 'required' here, as the list below is checked for length
                        >
                            {availableProblems.map((problem) => (
                                <option key={problem.id} value={problem.id}>
                                    {problem.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddProblem}
                            className={styles.addProblemButton}
                            disabled={!selectedProblemIdToAdd} // Disable if nothing is selected
                        >
                            Add Problem
                        </button>
                    </>
                ) : (
                  <p>No problems available to select.</p>
                )}
            </div>

            {/* Display Selected Problems */}
            {selectedProblems.length > 0 && (
              <div className={styles.selectedProblemsList}>
                <h3>Selected Problems:</h3>
                <ul>
                  {selectedProblems.map(problemId => (
                    <li key={problemId} className={styles.selectedProblemItem}>
                      {getProblemNameById(problemId)}
                      <button
                        type="button"
                        onClick={() => handleRemoveProblem(problemId)}
                        className={styles.removeProblemButton}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        {/* --- End Problem Selection Section --- */}


        <div className={styles.formGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>


        <button type="submit" className={styles.submitButton}>Create Contest</button>
      </form>
    </div>
  );
};

export default CreateContest;