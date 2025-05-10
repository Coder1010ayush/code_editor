import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/c_cpp';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/ext/language_tools'; 
import 'brace/ext/searchbox'; 

import styles from './Editor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faListAlt, faPlay, faPaperPlane, faSync, faExclamationTriangle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const supportedLanguages = ['javascript', 'python', 'c++'];

const languageMap = {
    javascript: 'javascript',
    python: 'python',
    'c++': 'c_cpp', 
};

const parseDescription = (description) => {
    if (typeof description === 'object' && description !== null) {
        return description; 
    }
    if (typeof description === 'string') {
        try {
            const parsed = JSON.parse(description);
            if (typeof parsed === 'object' && parsed !== null && parsed.header) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse description JSON:", e);
        }
    }
    return { header: description }; 
};


const CodeEditorPage = () => {
    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('testcase'); 
    const [consoleOutput, setConsoleOutput] = useState('');
    const [testResults, setTestResults] = useState([]);

    const [isWhiteMode, setIsWhiteMode] = useState(false); 
    const editorRef = useRef(null);

    useEffect(() => {
        if (!problemId) {
            setError('Problem ID is missing.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setProblem(null);
        setCode('');
        setConsoleOutput('');
        setTestResults([]);
        setActiveTab('testcase'); 


        const fetchProblem = async () => {
            try {
                const res = await fetch(`/api/problems/${problemId}`);
                // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                // const mockData = getMockProblemData(problemId);
                // if (!mockData) {
                //      throw new Error('Problem not found (Mock).');
                // }
                // const data = res; // Use mock data

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Problem not found.');
                    }
                    throw new Error(`Failed to fetch problem data: ${res.statusText}`);
                }
                const data = await res.json();
                const parsedDescription = parseDescription(data.description);
                const processedData = { ...data, description: parsedDescription };

                setProblem(processedData);

                const initialLang = supportedLanguages.find(lang => processedData.defaultCode?.[lang]) || 'javascript';
                setSelectedLanguage(initialLang);
                setCode(processedData.defaultCode?.[initialLang] || getDefaultCodeComment(initialLang));

                const testCasesInput = processedData.testCases; 
                console.log("test cases are " , testCasesInput);
                let formattedTestCases = [];
                if (Array.isArray(testCasesInput)) {
                    formattedTestCases = testCasesInput.map((tc, index) => {
                        const { output, keys, ...rest } = tc;                
                        return {
                            id: index,
                            status: 'pending',
                            input: rest,
                            expected: output,
                            output: null,
                            keys : keys
                        };
                    });
                    console.log("formattedTestCases is looking like this " , formattedTestCases);
                }
                
                 else if (testCasesInput && typeof testCasesInput === 'object') {
                     console.warn("Processing potentially older test case structure.");
                     formattedTestCases = Object.values(testCasesInput).map((tc, index) => ({
                        id: index,
                        status: 'pending',
                        output: null,
                        expected: tc.ans, 
                        input: tc.tc, 
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

    }, [problemId]); 
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
            const aceLanguage = languageMap[newLanguage];
            if (aceLanguage) {
                editorRef.current.editor.getSession().setMode(`ace/mode/${aceLanguage}`);
            }
        }
    };

    const toggleTheme = () => {
        setIsWhiteMode(prevMode => !prevMode);
    };

    const handleRunCode = async () => {
        if (!problem) {
            setConsoleOutput('Cannot run: Problem data is not loaded.');
            setActiveTab('console');
            return;
        }
    
        // let firstInput = testResults[0]?.input;
        const firstInput = testResults.map(result => result.input);
        let vps = testResults[0]?.keys;
        console.log("first input is " , firstInput);
        if (!firstInput) {
            setConsoleOutput('No input available from test cases to run.');
            setActiveTab('console');
            return;
        }

        
    
        console.log('Running code:', selectedLanguage, code, 'with input:', firstInput);
        setConsoleOutput(`Running code with input:\n${JSON.stringify(firstInput)}\n...\n`); 
        setActiveTab('console');
    
        try {
            const response = await fetch('/api/run-python-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    input: firstInput,
                    keys: vps
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${response.status} - ${errorData?.message || 'Failed to run code on server.'}`);
            }
            const result = await response.json();
            if (result.error) {
                setConsoleOutput(prev => prev + `Execution Error:\n${result.error}`);
            } else if (result.results) { // Assuming the backend sends back { results: [...] }
                 let outputString = 'Execution Finished:\n';
                 result.results.forEach((testResult, index) => {
                     outputString += `\nTest Case ${index + 1}:\n`;
                     outputString += `  Input: ${JSON.stringify(testResult.input, null, 2)}\n`;
                     if (testResult.error) {
                         outputString += `  Error: ${testResult.error}\n`;
                     } else {
                         outputString += `  Output: ${JSON.stringify(testResult.actualOutput, null, 2)}\n`;
                     }
                 });
                 setConsoleOutput(prev => prev + outputString);
    
            } else {
                 setConsoleOutput(prev => prev + `Execution Finished:\nUnexpected result format: ${JSON.stringify(result)}`);
            }
    
    
        } catch (err) {
            console.error('Run Error:', err);
            setConsoleOutput(prev => prev + `Execution Error:\n${err.message || 'Failed to communicate with the server.'}`);
        }
    
    };

    const handleSubmitCode = async () => {
        if (!problem || !testResults || testResults.length === 0) {
            setConsoleOutput('Cannot submit: Problem data or test cases are missing.');
            setError('Cannot submit: Problem data or test cases are missing.'); 
            setActiveTab('console');
            return;
        }

        console.log('Submitting code:', selectedLanguage, code);
        setConsoleOutput('Submitting code and running test cases...\n'); 
        setActiveTab('testcase'); 

        const runningTests = testResults.map(tc => ({ ...tc, status: 'running', output: 'Running...' }));
        setTestResults(runningTests);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(`/api/submit/${problemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: selectedLanguage, code })
            });
            const submissionResult = await response.json(); 
            setTestResults(submissionResult);
            setConsoleOutput(prev => prev + 'Finished running all test cases.\nSee Testcase tab for results.\n');

        } catch (err) {
            console.error('Submit Error:', err);
            setConsoleOutput(prev => prev + `Submission Error:\n${err.message || 'Failed to submit code.'}`);
            setTestResults(prev => prev.map(tc =>
                tc.status === 'running' ? { ...tc, status: 'error', output: `Submission failed: ${err.message}` } : tc
            ));
        }
    };


    const runMockTests = async (userCode, tests) => {
         const results = [];
         for (const testCase of tests) {
             await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); 

             let status = 'failed';
             let output = `Mock Output for Input: ${testCase.input?.substring(0,30)}...`;

             if (testCase.expected) {
                 if (Math.random() > 0.35) { 
                     status = 'passed';
                     output = testCase.expected; 
                 } else {
                     status = 'failed';
                     output = `Wrong Answer. Got: "${testCase.expected.split('').reverse().join('').substring(0,15)}..."`;
                 }
             } else {
                 status = 'passed';
                 output = 'Execution Completed (No specific output check)';
             }

             results.push({
                 ...testCase, 
                 status: status,
                 output: output,
             });
         }
         return results;
    };
    const getMockProblemData = (id) => {
        const problems = {
            '1': {
                _id: '1',
                title: 'Two Sum',
                difficulty: 'Easy',
                category: 'Array',
                description: { 
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
        };
        return problems[id];
    };
    if (loading) {
        return <div className={styles.loading}><FontAwesomeIcon icon={faSync} spin className={styles.icon} /> Loading Problem...</div>;
    }
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Error: {error}
                </div>
                <Link to="/" className={styles.backLink}>Go back to Problems List</Link>
            </div>
        );
    }
    if (!problem) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Problem data could not be loaded or is not available.
                </div>
                <Link to="/" className={styles.backLink}>Go back to Problems List</Link>
            </div>
        );
    }

    const difficultyClass = styles[`difficulty${problem.difficulty?.toLowerCase()}`] || styles.difficultyDefault;
    const editorTheme = isWhiteMode ? 'github' : 'monokai'; 

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
                </div>
                
                {/* Structured Description Rendering */}
                <div className={styles.descriptionContainer}>
                    {problem.question && (
                        <p className={styles.Question} dangerouslySetInnerHTML={{ __html: problem.question.replace(/`([^`]+)`/g, '<code>$1</code>') }}>
                           {/* Using dangerouslySetInnerHTML here ONLY for simple inline code formatting */}
                        </p>
                    )}

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
                                     {ex.explanation ? (
                                        <div className={styles.exampleExplanation}>
                                            <strong>Explanation:</strong>
                                            <p>{ex.explanation}</p>
                                        </div>
                                    ) : null}
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
                            <h3>Follow-up</h3>
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
                        name="UNIQUE_ID_OF_DIV" 
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="100%" 
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                            enableBasicAutocompletion: true, 
                            enableLiveAutocompletion: true, 
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 4, 
                            useWorker: false 
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
                        {/* {console.log("test case is " , testResults)} */}
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
                                                <pre>
                                                    {console.log("tc.input is " , tc.input)}
                                                    {tc.input && 
                                                        JSON.stringify(tc.input, null, 2)
                                                        }
                                                </pre>
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
                            disabled={loading || !problem}
                            title="Run code with the first test case input"
                        >
                            <FontAwesomeIcon icon={faPlay} className={styles.icon} /> Run
                        </button>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={handleSubmitCode}
                            disabled={loading || !problem || !testResults || testResults.length === 0} 
                            title="Submit code to run against all test cases"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} /> Submit
                        </button>
                    </div>
                </div> {/* End Results Panel */}
            </div> {/* End Right Panel */}
        </div> 
    );
};

export default CodeEditorPage;