import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import AceEditor from 'react-ace';

// Import base modes and themes
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/c_cpp';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
// Import Ace editor features you might need (optional)
import 'brace/ext/language_tools'; // For autocompletion
import 'brace/ext/searchbox'; // For search functionality

import styles from './Editor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faListAlt, faPlay, faPaperPlane, faSync, faExclamationTriangle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const supportedLanguages = ['javascript', 'python', 'c++'];

const languageMap = {
    javascript: 'javascript',
    python: 'python',
    'c++': 'c_cpp', // Ace uses 'c_cpp' for C++
};

// Function to safely parse JSON description
const parseDescription = (description) => {
    if (typeof description === 'object' && description !== null) {
        return description; // Already an object
    }
    if (typeof description === 'string') {
        try {
            const parsed = JSON.parse(description);
            // Basic validation to ensure it has expected keys
            if (typeof parsed === 'object' && parsed !== null && parsed.header) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse description JSON:", e);
        }
    }
    // Fallback: return as-is or wrap in a basic structure
    return { header: description }; // Treat the whole string as header if parsing fails
};


const CodeEditorPage = () => {
    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('testcase'); // Default to testcase
    const [consoleOutput, setConsoleOutput] = useState('');
    const [testResults, setTestResults] = useState([]);

    const [isWhiteMode, setIsWhiteMode] = useState(false); // Default to dark mode
    const editorRef = useRef(null);

    useEffect(() => {
        if (!problemId) {
            setError('Problem ID is missing.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        // Reset previous problem state
        setProblem(null);
        setCode('');
        setConsoleOutput('');
        setTestResults([]);
        setActiveTab('testcase'); 


        const fetchProblem = async () => {
            try {
                // --- IMPORTANT: Replace with your actual API endpoint ---
                const res = await fetch(`/api/problems/${problemId}`);
                // --- MOCK IMPLEMENTATION FOR TESTING ---
                // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                // const mockData = getMockProblemData(problemId);
                // if (!mockData) {
                //      throw new Error('Problem not found (Mock).');
                // }
                // const data = res; // Use mock data
                // --- END MOCK IMPLEMENTATION ---

                // Original fetch logic (uncomment when using a real API)
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Problem not found.');
                    }
                    throw new Error(`Failed to fetch problem data: ${res.statusText}`);
                }
                const data = await res.json();
                // --- End Original Fetch Logic ---

                // Parse description safely
                const parsedDescription = parseDescription(data.description);
                const processedData = { ...data, description: parsedDescription };

                setProblem(processedData);

                // Set initial language and code based on fetched data
                const initialLang = supportedLanguages.find(lang => processedData.defaultCode?.[lang]) || 'javascript';
                setSelectedLanguage(initialLang);
                setCode(processedData.defaultCode?.[initialLang] || getDefaultCodeComment(initialLang));

                // Process test cases (assuming structure might vary slightly)
                // This part needs adjustment based on your EXACT API response structure
                const testCasesInput = processedData.testCases; // e.g., [{ input: "...", expectedOutput: "..." }, ...]
                let formattedTestCases = [];
                if (Array.isArray(testCasesInput)) {
                     formattedTestCases = testCasesInput.map((tc, index) => ({
                        id: index,
                        status: 'pending', // Initial status
                        input: tc.input,
                        expected: tc.expectedOutput, // Use expectedOutput field
                        output: null, // Will be filled after running/submitting
                    }));
                }
                // --- Adjust the logic above if your API structure for testCases is different ---
                 else if (testCasesInput && typeof testCasesInput === 'object') {
                    // Handle the older structure if necessary
                     console.warn("Processing potentially older test case structure.");
                     formattedTestCases = Object.values(testCasesInput).map((tc, index) => ({
                        id: index,
                        status: 'pending',
                        output: null, // Initially no output
                        expected: tc.ans, // Adapt if needed
                        input: tc.tc, // Adapt if needed
                    }));
                 }

                setTestResults(formattedTestCases);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching problem:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProblem();

    }, [problemId]); // Re-run effect when problemId changes

    // Effect to update code in editor when language changes
    useEffect(() => {
        if (problem) {
            setCode(problem.defaultCode?.[selectedLanguage] || getDefaultCodeComment(selectedLanguage));
        }
    }, [selectedLanguage, problem]);

    const getDefaultCodeComment = (lang) => {
         switch (lang) {
            case 'python': return '# Write your Python code here\n';
            case 'c++': return '// Write your C++ code here\n';
            case 'javascript':
            default: return '// Write your JavaScript code here\n';
         }
    };


    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        if (supportedLanguages.includes(newLanguage)) {
            setSelectedLanguage(newLanguage);
            // Dynamically import the mode for the selected language if needed
            // Ace usually bundles common modes, but this ensures it's loaded
            const aceLanguage = languageMap[newLanguage];
            if (aceLanguage) {
                import(`brace/mode/${aceLanguage}`)
                    .then(() => {
                         if (editorRef.current) {
                             editorRef.current.editor.getSession().setMode(`ace/mode/${aceLanguage}`);
                         }
                    })
                    .catch(error => console.error(`Failed to load mode for ${newLanguage}`, error));
            }
        }
    };

    const toggleTheme = () => {
        setIsWhiteMode(prevMode => !prevMode);
    };

    // --- MOCK: Replace with actual code execution API call ---
    const handleRunCode = async () => {
        if (!problem) {
            setConsoleOutput('Cannot run: Problem data is not loaded.');
            setActiveTab('console');
            return;
        }

        // Use the first test case's input for the run simulation
        const firstInput = testResults[0]?.input || 'No input provided for run';
        console.log('Running code:', selectedLanguage, code, 'with input:', firstInput);
        setConsoleOutput(`Running code with input:\n${firstInput}\n...\n`);
        setActiveTab('console');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // --- Replace with actual API call ---
            // const response = await fetch('/api/run', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ language: selectedLanguage, code, input: firstInput })
            // });
            // const result = await response.json();
            // --- Mock result ---
            const mockResult = {
                output: `Simulated output for ${selectedLanguage}:\nHello World! Input was: ${firstInput.substring(0, 50)}...`, // Mock output
                error: null // Simulate no error
            };
            // --- End Mock Result ---

            if (mockResult.error) {
                 setConsoleOutput(prev => prev + `Execution Error:\n${mockResult.error}`);
            } else {
                 setConsoleOutput(prev => prev + `Execution Finished:\n${mockResult.output}`);
            }
        } catch (err) {
            console.error('Run Error:', err);
            setConsoleOutput(prev => prev + `Execution Error:\n${err.message || 'Failed to run code.'}`);
        }
    };

    // --- MOCK: Replace with actual submission API call ---
    const handleSubmitCode = async () => {
        if (!problem || !testResults || testResults.length === 0) {
            setConsoleOutput('Cannot submit: Problem data or test cases are missing.');
            setError('Cannot submit: Problem data or test cases are missing.'); // Also set error state
            setActiveTab('console');
            return;
        }

        console.log('Submitting code:', selectedLanguage, code);
        setConsoleOutput('Submitting code and running test cases...\n'); // Add to console
        setActiveTab('testcase'); // Switch view to test cases

        // Reset test results status to 'running'
        const runningTests = testResults.map(tc => ({ ...tc, status: 'running', output: 'Running...' }));
        setTestResults(runningTests);

        try {
            // Simulate API call delay for submission
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- Replace with actual API call to submit ---
            const response = await fetch(`/api/submit/${problemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: selectedLanguage, code })
            });
            const submissionResult = await response.json(); // Expects an array of results
            // --- Mock results ---
            // const mockSubmissionResult = await runMockTests(code, testResults);
            // --- End Mock Results ---

            // Update test results based on the response
            setTestResults(submissionResult);
            setConsoleOutput(prev => prev + 'Finished running all test cases.\nSee Testcase tab for results.\n'); // Update console

        } catch (err) {
            console.error('Submit Error:', err);
            setConsoleOutput(prev => prev + `Submission Error:\n${err.message || 'Failed to submit code.'}`);
            // Set all running tests to error status
            setTestResults(prev => prev.map(tc =>
                tc.status === 'running' ? { ...tc, status: 'error', output: `Submission failed: ${err.message}` } : tc
            ));
        }
    };


    // --- MOCK TEST EXECUTION LOGIC ---
    const runMockTests = async (userCode, tests) => {
         const results = [];
         for (const testCase of tests) {
             await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); // Simulate test run time

             let status = 'failed';
             let output = `Mock Output for Input: ${testCase.input?.substring(0,30)}...`;

             // Simulate pass/fail based on expected output
             if (testCase.expected) {
                 if (Math.random() > 0.35) { // Simulate ~65% pass rate
                     status = 'passed';
                     output = testCase.expected; // Show expected as actual output on pass
                 } else {
                     status = 'failed';
                     // Generate a slightly different mock output for failure
                     output = `Wrong Answer. Got: "${testCase.expected.split('').reverse().join('').substring(0,15)}..."`;
                 }
             } else {
                 // If no expected output, consider it passed (e.g., for code structure checks)
                 status = 'passed';
                 output = 'Execution Completed (No specific output check)';
             }

             results.push({
                 ...testCase, // Keep original id, input, expected
                 status: status,
                 output: output,
             });
         }
         return results;
    };
    // --- END MOCK TEST LOGIC ---


    // --- MOCK PROBLEM DATA FUNCTION ---
    const getMockProblemData = (id) => {
        const problems = {
            '1': {
                _id: '1',
                title: 'Two Sum',
                difficulty: 'Easy',
                category: 'Array',
                description: { // Structured description
                    header: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
                    example: [
                        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
                        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
                        { input: "nums = [3, 3], target = 6", output: "[0, 1]" }
                    ],
                    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
                    extra: "Follow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?"
                },
                defaultCode: {
                    javascript: '// Write your JavaScript code here\nfunction twoSum(nums, target) {\n\n};',
                    python: '# Write your Python code here\ndef twoSum(nums, target):\n    pass\n',
                    'c++': '// Write your C++ code here\n#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    \n}\n'
                },
                testCases: [ // Example test cases structure
                    { input: "nums = [2, 7, 11, 15], target = 9", expectedOutput: "[0, 1]" },
                    { input: "nums = [3, 2, 4], target = 6", expectedOutput: "[1, 2]" },
                    { input: "nums = [-1, -3, 5, 10], target = 4", expectedOutput: "[0, 2]" },
                    { input: "nums = [0, 0], target = 0", expectedOutput: "[0, 1]" },
                ]
            },
            '2': {
                 _id: '2',
                title: 'Add Two Numbers',
                difficulty: 'Medium',
                category: 'Linked List',
                 description: { // Structured description
                    header: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
                    example: [
                        { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." },
                        { input: "l1 = [0], l2 = [0]", output: "[0]" },
                        { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" }
                    ],
                    constraints: "The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros.",
                    extra: ""
                 },
                defaultCode: {
                    javascript: `// Definition for singly-linked list.\n// function ListNode(val, next) {\n//     this.val = (val===undefined ? 0 : val)\n//     this.next = (next===undefined ? null : next)\n// }\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};`,
                    python: `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef addTwoNumbers(l1, l2):\n    pass`,
                    'c++': `// Definition for singly-linked list.\n// struct ListNode {\n//     int val;\n//     ListNode *next;\n//     ListNode() : val(0), next(nullptr) {}\n//     ListNode(int x) : val(x), next(nullptr) {}\n//     ListNode(int x, ListNode *next) : val(x), next(next) {}\n// };\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};`
                },
                 testCases: [
                     { input: "l1 = [2,4,3], l2 = [5,6,4]", expectedOutput: "[7,0,8]" },
                     { input: "l1 = [0], l2 = [0]", expectedOutput: "[0]" },
                     { input: "l1 = [9,9,9], l2 = [1]", expectedOutput: "[0,0,0,1]" },
                 ]
            }
            // Add more mock problems as needed
        };
        return problems[id];
    };
    // --- END MOCK PROBLEM DATA ---


    // --- RENDER LOGIC ---
    if (loading) {
        return <div className={styles.loading}><FontAwesomeIcon icon={faSync} spin className={styles.icon} /> Loading Problem...</div>;
    }
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Error: {error}
                </div>
                {/* Provide a link back to a problems list page */}
                <Link to="/" className={styles.backLink}>Go back to Problems List</Link>
            </div>
        );
    }
    if (!problem) {
        // This case should ideally be covered by the loading/error states, but good as a fallback
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Problem data could not be loaded or is not available.
                </div>
                <Link to="/" className={styles.backLink}>Go back to Problems List</Link>
            </div>
        );
    }

    // Determine difficulty class safely
    const difficultyClass = styles[`difficulty${problem.difficulty?.toLowerCase()}`] || styles.difficultyDefault;
    const editorTheme = isWhiteMode ? 'github' : 'monokai'; // Simple theme toggle

    return (
        <div className={`${styles.editorLayout} ${isWhiteMode ? styles.whiteMode : styles.darkMode}`}>
            {/* Left Panel: Problem Description */}
            <div className={styles.leftPanel}>
                <h1 className={styles.title}>{problem.title || 'Problem Title'}</h1>
                <div className={styles.meta}>
                    <span className={`${styles.difficulty} ${difficultyClass}`}>
                        {problem.difficulty || 'N/A'}
                    </span>
                    {problem.category && (
                        <span className={styles.category}>{problem.category}</span>
                    )}
                     {/* Add more meta info if needed, e.g., tags, source */}
                </div>

                {/* Structured Description Rendering */}
                <div className={styles.descriptionContainer}>
                    {problem.description?.header && (
                        <p className={styles.descriptionHeader} dangerouslySetInnerHTML={{ __html: problem.description.header.replace(/`([^`]+)`/g, '<code>$1</code>') }}>
                           {/* Using dangerouslySetInnerHTML here ONLY for simple inline code formatting */}
                        </p>
                    )}

                    {Array.isArray(problem.description?.example) && problem.description.example.length > 0 && (
                        <div className={styles.examplesSection}>
                            <h3>Examples</h3>
                            {problem.description.example.map((ex, index) => (
                                <div key={index} className={styles.exampleItem}>
                                    <h4>Example {index + 1}</h4>
                                    {ex.input !== undefined && (
                                        <div className={styles.exampleIO}>
                                            <strong className={styles.exampleLabel}>Input:</strong>
                                            <pre className={styles.exampleCode}>{ex.input}</pre>
                                        </div>
                                    )}
                                    {ex.output !== undefined && (
                                        <div className={styles.exampleIO}>
                                            <strong className={styles.exampleLabel}>Output:</strong>
                                            <pre className={styles.exampleCode}>{ex.output}</pre>
                                        </div>
                                    )}
                                     {ex.explanation && (
                                        <div className={styles.exampleExplanation}>
                                            <strong>Explanation:</strong>
                                            <p>{ex.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                     {problem.description?.constraints && (
                        <div className={styles.constraintsSection}>
                             <h3>Constraints</h3>
                             <ul className={styles.constraintsList}>
                                {/* Split constraints string by newline and render each as a list item */}
                                {problem.description.constraints.split('\n').map((constraint, index) => (
                                    constraint.trim() && <li key={index}>{constraint.trim()}</li>
                                ))}
                             </ul>
                        </div>
                    )}

                    {problem.description?.extra && (
                        <div className={styles.descriptionExtra}>
                            {/* Check if label needed */}
                            {problem.description.example || problem.description.constraints ? <h3>Follow-up</h3> : null}
                            <p>{problem.description.extra}</p>
                        </div>
                    )}

                    {/* Fallback for non-structured description (less ideal) */}
                     {typeof problem.description !== 'object' && (
                         <div
                             className={styles.description}
                             dangerouslySetInnerHTML={{ __html: problem.description }}
                         />
                     )}
                </div>
            </div> {/* End Left Panel */}

            {/* Right Panel: Editor and Results */}
            <div className={styles.rightPanel}>
                {/* Editor Controls: Theme Toggle, Language Selector */}
                <div className={styles.editorControls}>
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        title={isWhiteMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        aria-label={isWhiteMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                        <FontAwesomeIcon icon={isWhiteMode ? faMoon : faSun} />
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
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)} {/* Capitalize */}
                                </option>
                            ))}
                        </select>
                    </div>
                     {/* Add other controls here if needed, e.g., reset code button */}
                </div>

                {/* Ace Editor Container */}
                <div className={styles.editorContainer}>
                    <AceEditor
                        ref={editorRef}
                        mode={languageMap[selectedLanguage]}
                        theme={editorTheme}
                        onChange={handleEditorChange}
                        value={code}
                        name="UNIQUE_ID_OF_DIV" // Required by Ace
                        editorProps={{ $blockScrolling: true }} // Recommended setting
                        width="100%"
                        height="100%" // Fill container
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                            enableBasicAutocompletion: true, // Enable basic suggestions
                            enableLiveAutocompletion: true, // Enable live suggestions
                            enableSnippets: false, // Disable snippets if not needed
                            showLineNumbers: true,
                            tabSize: 4, // Use 4 spaces for tabs
                            useWorker: false // Disable worker to avoid potential issues in some environments
                        }}
                    />
                </div>

                {/* Results Panel: Tabs for Test Cases and Console */}
                <div className={styles.resultsPanel}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'testcase' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('testcase')}
                            aria-selected={activeTab === 'testcase'}
                        >
                            <FontAwesomeIcon icon={faListAlt} className={styles.icon} /> Test Cases ({testResults.length})
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'console' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('console')}
                             aria-selected={activeTab === 'console'}
                        >
                            <FontAwesomeIcon icon={faTerminal} className={styles.icon} /> Console
                        </button>
                    </div>

                    {/* Tab Content Area */}
                    <div className={styles.tabContent}>
                        {activeTab === 'testcase' && (
                            <div className={styles.testCasesContainer}>
                                {testResults.length > 0 ? (
                                    testResults.map((tc, index) => (
                                        <div key={tc.id || index} className={`${styles.testCaseItem} ${styles[`testStatusBorder_${tc.status}`]}`}>
                                            <div className={styles.testCaseHeader}>
                                                <h4>Test Case {index + 1}</h4>
                                                <span className={`${styles.testStatus} ${styles[`testStatus_${tc.status}`]}`}>
                                                    {tc.status.charAt(0).toUpperCase() + tc.status.slice(1)}
                                                </span>
                                            </div>
                                            {/* Show Input always */}
                                            <div className={styles.testCaseDetail}>
                                                <strong>Input:</strong>
                                                <pre>{tc.input !== null && tc.input !== undefined ? String(tc.input) : 'N/A'}</pre>
                                            </div>
                                            {/* Show Output only if not pending */}
                                            {tc.status !== 'pending' && (
                                                 <div className={styles.testCaseDetail}>
                                                    <strong>Output:</strong>
                                                    <pre className={tc.status === 'failed' ? styles.failedOutput : ''}>
                                                        {tc.output !== null && tc.output !== undefined ? String(tc.output) : (tc.status === 'running' ? 'Running...' : 'N/A')}
                                                    </pre>
                                                </div>
                                            )}
                                            {/* Show Expected only if failed or passed (not pending/running) */}
                                            {tc.status === 'failed' && tc.expected !== undefined && (
                                                 <div className={styles.testCaseDetail}>
                                                    <strong>Expected:</strong>
                                                    <pre className={styles.expectedOutput}>{String(tc.expected)}</pre>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noTestsMessage}>No test cases available for this problem or they haven't been run yet.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'console' && (
                            <pre className={styles.consoleOutput}>
                                {consoleOutput || 'Console output will appear here. Click "Run" to execute your code with sample input or "Submit" to run against all test cases.'}
                            </pre>
                        )}
                    </div>

                    {/* Action Buttons: Run and Submit */}
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.button} ${styles.runButton}`}
                            onClick={handleRunCode}
                            disabled={loading || !problem} // Disable if loading or no problem data
                            title="Run code with the first test case input"
                        >
                            <FontAwesomeIcon icon={faPlay} className={styles.icon} /> Run
                        </button>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={handleSubmitCode}
                            disabled={loading || !problem || !testResults || testResults.length === 0} // Disable if loading, no problem, or no test cases
                            title="Submit code to run against all test cases"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} /> Submit
                        </button>
                    </div>
                </div> {/* End Results Panel */}
            </div> {/* End Right Panel */}
        </div> // End Editor Layout
    );
};

export default CodeEditorPage;