import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate, data } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import styles from './Editor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTerminal, faListAlt, faPlay, faPaperPlane, faSync, faExclamationTriangle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // Added sun/moon icons

const supportedLanguages = ['javascript', 'python', 'c++']; // Define supported languages

const CodeEditorPage = () => {
    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // Default language
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('testcase');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [testResults, setTestResults] = useState([]);

    const [isWhiteMode, setIsWhiteMode] = useState(false); // State for theme mode

    const editorRef = useRef(null);

    // --- Fetch Problem Details useEffect ---
    useEffect(() => {
        if (!problemId) {
            setError('Problem ID is missing.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`/api/problems/${problemId}`) 
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Problem not found.');
                    }
                    throw new Error(`Failed to fetch problem data: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                setProblem(data);
                const initialLang = supportedLanguages.find(lang => data.defaultCode?.[lang]) || 'javascript';
                setSelectedLanguage(initialLang);
                setCode(`// Write your ${initialLang} code here`);
                console.log("test cases in data is " , data.testCases);
                const testCaseObjects = data.testCases?.[0]; // get the object inside the array

                const testCasesArray = testCaseObjects
                ? Object.values(testCaseObjects).map((tc, index) => ({
                    id: index,
                    status: 'pending',
                    output: tc.ans,
                    expected: tc.ans,
                    input: tc.tc,
                    }))
                : [];

                setTestResults(testCasesArray);

                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching problem:', err);
                setError(err.message);
                setLoading(false);
            });

    }, [problemId]); // Depend only on problemId for fetching
    // Effect to update code when language or problem changes
    useEffect(() => {
        if (problem) {
            // Set code for the newly selected language if default code exists
            setCode(problem.defaultCode?.[selectedLanguage] || `// Write your ${selectedLanguage} code here`);
        }
    }, [selectedLanguage, problem]); // Depend on selectedLanguage AND problem state


    // Handle editor mounting
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        // Optional: add commands or configure editor here
        // console.log("Monaco Editor Mounted");
    }

    // Handle code changes
    function handleEditorChange(value, event) {
        setCode(value);
    }

    // Handle language selection change
    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        if (supportedLanguages.includes(newLanguage)) {
            setSelectedLanguage(newLanguage);
        }
        // The useEffect above will handle updating the code based on the new language
    };

    // Handle theme toggle
    const toggleTheme = () => {
        setIsWhiteMode(prevMode => !prevMode);
    };


    // --- Run/Submit Functions (Mock implementation - replace with API calls) ---
    const handleRunCode = async () => {
        if (!problem) {
            setConsoleOutput('Cannot run: Problem data is not loaded.');
            setActiveTab('console');
            return;
        }
        console.log('Running code:', selectedLanguage, code);
        setConsoleOutput('Running code...\n');
        setActiveTab('console');

        // --- Replace with actual API call to your backend ---
        // Example:
        // try {
        //     const response = await fetch('/api/run', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             code: code,
        //             language: selectedLanguage,
        //             input: problem.testCases?.[0]?.input // Often 'run' uses a single or default input
        //         })
        //     });
        //     if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        //     const result = await response.json(); // Assume API returns { output: "...", error: "..." }
        //     setConsoleOutput(`Execution Finished:\n${result.output || result.error || 'No output'}`);
        // } catch (err) {
        //     console.error('Run Error:', err);
        //     setConsoleOutput(`Execution Error:\n${err.message}`);
        // }
        // --- End API Call Placeholder ---

        // --- Mock Execution (Remove for actual API) ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const mockOutput = `Simulated execution finished for ${selectedLanguage}.\nYour code output: Hello World!\nInput used: ${problem.testCases?.[0]?.input || 'N/A'}`;
        setConsoleOutput(prev => prev + mockOutput);
        // --- End Mock Execution ---
    };

    const handleSubmitCode = async () => {
        if (!problem || !problem.testCases || problem.testCases.length === 0) {
            setConsoleOutput('Cannot submit: Problem data or test cases are missing.');
            setError('Cannot submit: Problem data or test cases are missing.');
            setActiveTab('console');
            return;
        }

        console.log('Submitting code:', selectedLanguage, code);
        setConsoleOutput('Submitting code and running test cases...\n');
        setActiveTab('testcase');

        // Reset test case statuses to running/pending
        setTestResults(prev => prev.map(tc => ({ ...tc, status: 'running', output: 'Running...' })));

        // --- Replace with actual API call to your backend ---
        // Example:
        // try {
        //     const response = await fetch('/api/submit', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             code: code,
        //             language: selectedLanguage,
        //             testCases: problem.testCases // Send all test cases
        //         })
        //     });
        //     if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        //     const results = await response.json(); // Assume API returns an array of test results
        //     // Update testResults state with actual results
        //     setTestResults(results.map((res, index) => ({
        //          ...testResults[index], // Keep original input/expected if needed
        //          status: res.status, // 'passed', 'failed', 'error'
        //          output: res.output || res.error || 'No output',
        //     })));
        //     setConsoleOutput(prev => prev + 'Finished running all test cases.\n');
        // } catch (err) {
        //     console.error('Submit Error:', err);
        //     setConsoleOutput(`Submission Error:\n${err.message}`);
        //     // Optionally update test results to indicate error
        //     setTestResults(prev => prev.map(tc => ({ ...tc, status: 'error', output: `Submission failed: ${err.message}` })));
        // }
        // --- End API Call Placeholder ---


        // --- Mock Test Execution (Remove for actual API) ---
        const mockResults = [];
        for (let i = 0; i < problem.testCases.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate test execution time

            const testCase = problem.testCases[i];
            let testStatus = 'failed'; // Default to failed
            let testOutput = `Mock Output for Test Case ${i + 1}`; // Generic mock output

            // Basic mock comparison: check if expectedOutput exists and is not empty
            if (testCase.expectedOutput) {
                // Simulate success 70% of the time if expectedOutput exists
                if (Math.random() > 0.3) {
                    testStatus = 'passed';
                    testOutput = testCase.expectedOutput; // Simulate correct output
                } else {
                     testStatus = 'failed';
                     // Simulate a wrong output
                     try {
                         const expectedJson = JSON.parse(testCase.expectedOutput);
                         if (Array.isArray(expectedJson)) {
                             testOutput = `Wrong Answer: Expected ${testCase.expectedOutput}, got ${JSON.stringify([...expectedJson].reverse())}`; // Mock wrong array output
                         } else {
                             testOutput = `Wrong Answer: Expected ${testCase.expectedOutput}, got "Some other output"`;
                         }
                     } catch (e) {
                          testOutput = `Wrong Answer: Expected "${testCase.expectedOutput}", got "Some other output"`;
                     }
                }
            } else {
                 // If no expected output, just simulate a "passed" run with generic output
                 testStatus = 'passed';
                 testOutput = `Completed: No expected output provided for this test case. Mock output: "Success"`;
            }


            mockResults.push({
                 id: i,
                 status: testStatus,
                 output: testOutput,
                 expected: testCase.expectedOutput,
                 input: testCase.input,
            });

            // Update state periodically to show progress
             setTestResults([...mockResults, ...testResults.slice(i + 1)]);
        }
         setTestResults(mockResults); // Set final results
         setConsoleOutput(prev => prev + 'Finished running all test cases.\n');
        // --- End Mock Test Execution ---
    };
    // --- End Run/Submit Functions ---


    // Loading and Error States
    if (loading) {
        return <div className={styles.loading}><FontAwesomeIcon icon={faSync} spin className={styles.icon} /> Loading Problem...</div>;
    }
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Error: {error}
                </div>
                <Link to="/problems" className={styles.backLink}>Go back to Problems List</Link>
            </div>
        );
    }
     // Fallback if problem data is null after loading stops without error
     if (!problem) {
          return (
              <div className={styles.errorContainer}>
                 <div className={styles.error}>
                     <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Problem data could not be loaded. Please try again.
                 </div>
                  <Link to="/problems" className={styles.backLink}>Go back to Problems List</Link>
             </div>
          );
     }


    // Determine difficulty class (problem should be available here)
    const difficultyClass = styles[`difficulty${problem.difficulty?.toLowerCase()}`] || styles.difficulty;

    return (
        <div className={`${styles.editorLayout} ${isWhiteMode ? styles.whiteMode : ''}`}>
            {/* Left Panel: Problem Description */}
            <div className={styles.leftPanel}>
                <h1 className={styles.title}>{problem.title}</h1>
                <div className={styles.meta}>
                    <span className={`${styles.difficulty} ${difficultyClass}`}>
                        {problem.difficulty}
                    </span>
                    {problem.category && (
                        <span className={styles.category}>{problem.category}</span>
                    )}
                </div>
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                />
            </div>

            {/* Right Panel: Editor and Results */}
            <div className={styles.rightPanel}>
                {/* Editor Controls */}
                <div className={styles.editorControls}>
                     {/* Theme Toggle Button */}
                    <button className={styles.themeToggle} onClick={toggleTheme} title={isWhiteMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                         <FontAwesomeIcon icon={isWhiteMode ? faMoon : faSun} className={styles.icon} />
                    </button>
                    <div className={styles.languageSelector}>
                       <label htmlFor="language-select">Language:</label>
                       <select
                            id="language-select"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            {supportedLanguages.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Monaco Editor Container */}
                <div className={styles.editorContainer}>
                    <Editor
                        height="100%"
                        language={selectedLanguage}
                        value={code}
                        theme={isWhiteMode ? 'vs-light' : 'vs-dark'} // Change theme based on state
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                        options={{
                            selectOnLineNumbers: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Results Panel */}
                <div className={styles.resultsPanel}>
                     {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'testcase' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('testcase')}
                        >
                            <FontAwesomeIcon icon={faListAlt} className={styles.icon} /> Testcase ({testResults.length})
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'console' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('console')}
                        >
                            <FontAwesomeIcon icon={faTerminal} className={styles.icon} /> Console
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className={styles.tabContent}>
                        {activeTab === 'testcase' && (
                            <div>
                                {console.log("sfjknjf nakfn os is ", testResults)}
                                {Array.isArray(testResults) && testResults.length > 0 ? (
                                    testResults.map((tc, index) => (
                                        <div key={index} className={styles.testCaseItem}>
                                             <h4>Test Case {index + 1}
                                                <span className={styles[`testStatus_${tc.status}`]}>
                                                    ({tc.status.charAt(0).toUpperCase() + tc.status.slice(1)}) {/* Capitalize status */}
                                                </span>
                                             </h4>
                                            <div><strong>Input:</strong><pre>{tc.input || 'N/A'}</pre></div>
                                            <div><strong>Output:</strong><pre>{tc.output || 'N/A'}</pre></div>
                                            {/* Show expected only if not pending or running */}
                                            {tc.status !== 'pending' && tc.status !== 'running' && (
                                                <div><strong>Expected:</strong><pre>{tc.expected || 'N/A'}</pre></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                     activeTab === 'testcase' && <p>No test cases available for this problem or not run yet.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'console' && (
                            <pre className={styles.consoleOutput}>
                                {consoleOutput || 'Click "Run" to execute your code or "Submit" to run test cases.'}
                            </pre>
                        )}
                    </div>
                     {/* Action Buttons */}
                     <div className={styles.actionButtons}>
                        {/* Disable buttons while loading or if no problem */}
                        <button className={`${styles.button} ${styles.runButton}`} onClick={handleRunCode} disabled={loading || !problem}>
                            <FontAwesomeIcon icon={faPlay} className={styles.icon} /> Run
                        </button>
                        {/* Disable submit if no test cases either */}
                        <button className={`${styles.button} ${styles.submitButton}`} onClick={handleSubmitCode} disabled={loading || !problem || !problem.testCases || problem.testCases.length === 0}>
                            <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} /> Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPage;