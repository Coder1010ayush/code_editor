import React, { useState } from 'react';
import styles from './AddProblems.module.css'; // Import the CSS module

const AddProblems = () => {
  // State for basic problem details
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState('Easy'); // Default difficulty
  const [category, setCategory] = useState('');

  // State for description sections
  const [extra, setExtra] = useState('');
  const [header, setHeader] = useState('');
  const [constraints, setConstraints] = useState('');

  // State for test cases
  const [numTestCases, setNumTestCases] = useState(0);
  const [testCases, setTestCases] = useState([]); // Array of { argument: '', data: '' }

  // State for examples
  const [numExamples, setNumExamples] = useState(0);
  const [examples, setExamples] = useState([]); // Array of { argument: '', data: '' }

  // Handle changes for test case inputs
  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  // Handle changes for example inputs
  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  // Handle change in number of test cases dropdown
  const handleNumTestCasesChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumTestCases(count);
    // Initialize test cases array with empty objects based on the count
    setTestCases(Array.from({ length: count }, () => ({ argument: '', data: '' })));
  };

  // Handle change in number of examples dropdown
  const handleNumExamplesChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumExamples(count);
    // Initialize examples array with empty objects based on the count
    setExamples(Array.from({ length: count }, () => ({ argument: '', data: '' })));
  };

  // Handle form submission (you'll add your logic here to send data to a backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    const problemData = {
      title,
      question,
      difficulty,
      category,
      descr: {
        extra,
        header,
        constraints,
      },
      test_cases: testCases,
      example: examples,
    };
    console.log('Problem Data:', problemData);
    // Add your logic to send problemData to your backend API
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Coding Problem</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Problem Details */}
        <div className={styles.section}>
          <label htmlFor="title" className={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.section}>
          <label htmlFor="question" className={styles.label}>Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={`${styles.input} ${styles.textarea}`}
            required
          ></textarea>
        </div>

        <div className={styles.section}>
          <label htmlFor="difficulty" className={styles.label}>Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={styles.select}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className={styles.section}>
          <label htmlFor="category" className={styles.label}>Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* Description Section */}
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Description</h2>
          <div className={styles.subSection}>
            <label htmlFor="extra" className={styles.label}>Extra:</label>
            <textarea
              id="extra"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              className={`${styles.input} ${styles.textarea}`}
            ></textarea>
          </div>
          <div className={styles.subSection}>
            <label htmlFor="header" className={styles.label}>Header:</label>
            <textarea
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className={`${styles.input} ${styles.textarea}`}
            ></textarea>
          </div>
          <div className={styles.subSection}>
            <label htmlFor="constraints" className={styles.label}>Constraints:</label>
            <textarea
              id="constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className={`${styles.input} ${styles.textarea}`}
            ></textarea>
          </div>
        </div>

        {/* Test Cases Section */}
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Test Cases</h2>
          <div className={styles.subSection}>
            <label htmlFor="numTestCases" className={styles.label}>Number of Test Cases:</label>
            <select
              id="numTestCases"
              value={numTestCases}
              onChange={handleNumTestCasesChange}
              className={styles.select}
            >
              {[...Array(11).keys()].map(num => ( // Options from 0 to 10
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {testCases.map((testCase, index) => (
            <div key={index} className={styles.testCaseInput}>
              <h3 className={styles.inputGroupTitle}>Test Case {index + 1}</h3>
              <div className={styles.inputGroup}>
                <label htmlFor={`testCaseArg${index}`} className={styles.label}>Argument:</label>
                <input
                  type="text"
                  id={`testCaseArg${index}`}
                  value={testCase.argument}
                  onChange={(e) => handleTestCaseChange(index, 'argument', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={`testCaseData${index}`} className={styles.label}>Data:</label>
                <input
                  type="text"
                  id={`testCaseData${index}`}
                  value={testCase.data}
                  onChange={(e) => handleTestCaseChange(index, 'data', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Examples Section */}
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Examples</h2>
          <div className={styles.subSection}>
            <label htmlFor="numExamples" className={styles.label}>Number of Examples:</label>
            <select
              id="numExamples"
              value={numExamples}
              onChange={handleNumExamplesChange}
              className={styles.select}
            >
              {[...Array(6).keys()].map(num => ( // Options from 0 to 5
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {examples.map((example, index) => (
            <div key={index} className={styles.exampleInput}>
              <h3 className={styles.inputGroupTitle}>Example {index + 1}</h3>
              <div className={styles.inputGroup}>
                <label htmlFor={`exampleArg${index}`} className={styles.label}>Input:</label>
                <input
                  type="text"
                  id={`exampleArg${index}`}
                  value={example.argument}
                  onChange={(e) => handleExampleChange(index, 'argument', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={`exampleData${index}`} className={styles.label}>Output:</label>
                <input
                  type="text"
                  id={`exampleData${index}`}
                  value={example.data}
                  onChange={(e) => handleExampleChange(index, 'data', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={styles.submitButton}>Add Problem</button>
      </form>
    </div>
  );
};

export default AddProblems;
