import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/mode/python";
import "brace/mode/c_cpp";
import "brace/theme/monokai";
import "brace/theme/github";
import "brace/theme/dracula";
import "brace/theme/eclipse";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import { useAuth } from "../context/AuthContext";

import styles from "./Editor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTerminal,
  faListAlt,
  faPlay,
  faPaperPlane,
  faSync,
  faExclamationTriangle,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

const supportedLanguages = ["javascript", "python", "c++"];

const languageMap = {
  javascript: "javascript",
  python: "python",
  "c++": "c_cpp",
};

const parseDescription = (description) => {
  if (typeof description === "object" && description !== null) {
    return description;
  }
  if (typeof description === "string") {
    try {
      const parsed = JSON.parse(description);
      if (typeof parsed === "object" && parsed !== null && parsed.header) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse description JSON:", e);
    }
  }
  return { header: description };
};

const CodeEditorPage = ({ problemId: propProblemId , _contest_id }) => {

  const { problemId: paramProblemId} = useParams();
  const problemId = propProblemId || paramProblemId;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("testcase");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [testResults, setTestResults] = useState([]);

  const [isWhiteMode, setIsWhiteMode] = useState(false);
  const editorRef = useRef(null);

  const [arguments_in_function , setArgumentFunc] = useState("");
  const{ user } = useAuth();

  const [selectedCode, setSelectedCode] = useState(null); 
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [errorSubmissions, setErrorSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]); 
  const [showSubmissions, setShowSubmissions] = useState(false); 



  useEffect(() => {
    if (showSubmissions && user?.username && problemId) {
      setLoadingSubmissions(true);
      fetch(`/api/submit/${problemId}?username=${user.username}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch submissions");
          return res.json();
        })
        .then((data) => {
          const latest = data?.[0]; 
          setSubmissions(latest ? [latest] : []); 
          setLoadingSubmissions(false);
        })
        .catch((err) => {
          setErrorSubmissions(err.message);
          setLoadingSubmissions(false);
        });
    }
  }, [showSubmissions, user?.username, problemId]);
  

  useEffect(() => {
    if (!problemId) {
      setError("Problem ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProblem(null);
    setCode("");
    setConsoleOutput("");
    setTestResults([]);
    setActiveTab("testcase");

    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/${problemId}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Problem not found.");
          }
          throw new Error(`Failed to fetch problem data: ${res.statusText}`);
        }
        const data = await res.json();
        const parsedDescription = parseDescription(data.description);
        const processedData = { ...data, description: parsedDescription };

        setProblem(processedData);

        const initialLang =
          supportedLanguages.find(
            (lang) => processedData.defaultCode?.[lang]
          ) || "javascript";
        setSelectedLanguage(initialLang);
        
        let arguments_in_function_local = null;
        const testCasesInput = processedData.testCases;
        // console.log("test cases are ", testCasesInput);
        let formattedTestCases = [];
        if (Array.isArray(testCasesInput)) {
          formattedTestCases = testCasesInput.map((tc, index) => {
            const { output, keys, ...rest } = tc;
            arguments_in_function_local = keys;
            // console.log("output is ", output);
            return {
              id: index,
              status: "pending",
              input: rest,
              expected: output,
              output: null,
              keys: keys,
            };
          });

        } else if (testCasesInput && typeof testCasesInput === "object") {
          console.warn("Processing potentially older test case structure.");
          formattedTestCases = Object.values(testCasesInput).map(
            (tc, index) => ({
              id: index,
              status: "pending",
              output: null,
              expected: tc.ans,
              input: tc.tc,
            })
          );
        }

        setArgumentFunc(arguments_in_function_local);
        setCode(
          processedData.defaultCode?.[initialLang] ||
            getDefaultCodeComment(initialLang)
        );

        setTestResults(formattedTestCases);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);
  useEffect(() => {
    if (problem) {
      setCode(
        problem.defaultCode?.[selectedLanguage] ||
          getDefaultCodeComment(selectedLanguage , )
      );
    }
  }, [selectedLanguage, problem]);

  const getDefaultCodeComment = (lang ) => {
    let objTemplate = "";
    switch (lang) {
      case "python":
        objTemplate = "# Write your Python code here\n";
        if (arguments_in_function != "" && arguments_in_function != null){
          const args = arguments_in_function.join(', ');
          objTemplate = `def server_side_runner(${args}):\n\t# Write your Python code here\n`;

        }
        return objTemplate;
      case "c++":
        return "// Write your C++ code here\n";
      case "javascript":
        objTemplate = "// Write your Javascript code here\n";
        if (arguments_in_function != ""  && arguments_in_function != null){
          const args = arguments_in_function.join(', ');
          objTemplate = `function server_side_runner(${args}){\n\t// Write your Javascript code here\n}`;

        }
        return objTemplate;
      default:
        return "// Write your JavaScript code here\n";
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
        editorRef.current.editor
          .getSession()
          .setMode(`ace/mode/${aceLanguage}`);
      }
    }
  };

  const toggleTheme = () => {
    setIsWhiteMode((prevMode) => !prevMode);
  };

  const handleRunCode = async (limit = true) => {
    if (!problem) {
      setConsoleOutput("Cannot run: Problem data is not loaded.");
      setActiveTab("console");
      return 0;
    }

    const totalInputs = testResults.map((result) => result.input);
    const vps = testResults[0]?.keys;

    if (!totalInputs) {
      setConsoleOutput("No input available from test cases to run.");
      setActiveTab("console");
      return 0;
    }

    const inputsToRun = limit ? totalInputs.slice(0, 3) : totalInputs;

    setConsoleOutput(
      `Running code with input:\n${JSON.stringify(inputsToRun)}\n...\n`
    );
    setActiveTab("console");

    let passCount = 0;

    try {
      let response = null;
      if (selectedLanguage == "python"){
          response = await fetch("/api/run-python-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            input: inputsToRun,
            keys: vps,
          }),
        });
      }
      else{
          response = await fetch("/api/run-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            input: inputsToRun,
            keys: vps,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Server error: ${response.status} - ${
            errorData?.message || "Failed to run code on server."
          }`
        );
      }

      const result = await response.json();

      if (result.error) {
        setConsoleOutput((prev) => prev + `Execution Error:\n${result.error}`);
      } else if (result.results) {
        let outputString = "Execution Finished:\n";
        const updatedTestResults = [...testResults];

        result.results.forEach((testResult, index) => {
          const expected = testResults[index]?.expected;
          const actual = testResult.actualOutput;

          const passed = JSON.stringify(actual) === JSON.stringify(expected);
          if (passed) passCount++;

          updatedTestResults[index].status = passed ? "passed" : "failed";

          outputString += `\nTest Case ${index + 1}:\n`;
          if(limit){
          outputString += `  Input: ${JSON.stringify(testResult.input, null, 2)}\n`;
          outputString += `  Expected: ${JSON.stringify(expected, null, 2)}\n`;
          outputString += `  Actual: ${JSON.stringify(actual, null, 2)}\n`;
          }
          outputString += `  Status: ${passed ? "✅ Passed" : "❌ Failed"}\n`;
        });

        setTestResults(updatedTestResults);
        setConsoleOutput((prev) => prev + outputString);
      } else {
        setConsoleOutput(
          (prev) =>
            prev +
            `Execution Finished:\nUnexpected result format: ${JSON.stringify(result)}`
        );
      }
    } catch (err) {
      console.error("Run Error:", err);
      setConsoleOutput(
        (prev) =>
          prev +
          `Execution Error:\n${err.message || "Failed to communicate with the server."}`
      );
    }

    return passCount;
  };

  function updateContestObject(contest, { sid, qid, kind, marks, username }) {
    // can be more optimised to O(n) , for now it is fine not too slow
    const kindWeight = {
        Easy: 1,
        Medium: 2,
        Hard: 3
    };

    if (!kindWeight[kind]) {
        throw new Error(`Invalid kind: ${kind}`);
    }

    const participant = contest.participants.find(p => p.username === username);
    if (!participant) {
        throw new Error(`Participant with username "${username}" not found`);
    }
    console.log("it is fine");

    // javascript util function shines 
    let attemptedEntry = participant.attempted.find(attempt => attempt.qid.toString() === qid.toString());
    console.log("it is fine also");
    if (attemptedEntry) {
        // simple hack
        if (marks > attemptedEntry.marks) {
            attemptedEntry.marks = marks;
            attemptedEntry.sid = sid;
        }
    } else {
        participant.attempted.push({ qid, sid, kind, marks });
    }

    let newScore = 0;
    for (const attempt of participant.attempted) {
        const weight = kindWeight[attempt.kind];
        newScore += (attempt.marks * weight) / 100;
    }

    participant.curr_score = newScore;

    return contest;
  }



  const handleSubmitCode = async () => {
    if (!problem || !testResults || testResults.length === 0) {
      setConsoleOutput("Cannot submit: Problem data or test cases are missing.");
      setError("Cannot submit: Problem data or test cases are missing.");
      setActiveTab("console");
      return;
    }

    // setting up test cases and tab setup here 
    setConsoleOutput("Submitting code and running test cases...\n");
    setActiveTab("testcase");

    const runningTests = testResults.map((tc) => ({
      ...tc,
      status: "running",
      output: "Running...",
    }));
    setTestResults(runningTests);
    // contest submission will be handled here
    if (_contest_id != null){
      try {
        const passedCount = await handleRunCode(false); 
        const isSuccess = passedCount === testResults.length;

        let response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,     
            question_id: problem._id,
            submitted_code: code,
            result: isSuccess ? 'Success' : 'Failed',
            lang: selectedLanguage,
          }),
        });
        alert("Code submitted successfully!");
        const data = await response.json();
        const submissionId = data._id; 

        // fetching contest data 
        let new_contest = null;
        try {
          const contest_res = await fetch(`/api/contests/${_contest_id}`); 
          const oldcontest = await contest_res.json();
          console.log("old contest is ", oldcontest);
          const marks  = parseInt(passedCount/testResults.length * 100);

          try {
            new_contest = updateContestObject(oldcontest , {
              sid: submissionId,
              qid: problem._id,
              kind: problem.difficulty, 
              marks: marks,
              username: user.username
            })
          } catch (error) {
            console.log("error in updateContestObject fnc is " , error);
          }
          try {
            fetch(`/api/contests/${_contest_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(new_contest),
            })
              .then(res => res.json())
              .then(data => console.log("Updated contest:", data))
              .catch(err => console.error("Update failed:", err));

            alert("successfully added to the contest")
    
          } catch (error) {
            alert("failed to added to the contest")
          }
          console.log("new contest data is ", new_contest);
        } catch (error) {
          alert("test cases failed to run");
        }

      } catch (error) {
        alert("test cases failed to run");
      }

    }else{
      // normal submission will be handled here.
      console.log("jsab hfcufy yt jkvsbhc  sgyh hxjhdfsbxdsghhbn ");
      const passedCount = await handleRunCode(false); 
      const isSuccess = passedCount === testResults.length;

      let response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,     
          question_id: problem._id,
          submitted_code: code,
          result: isSuccess ? 'Success' : 'Failed',
          lang: selectedLanguage,
        }),
      });
      alert("Code submitted successfully!");

    }
  };
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSync} spin className={styles.icon} /> Loading
        Problem...
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.icon}
          />{" "}
          Error: {error}
        </div>
        <Link to="/" className={styles.backLink}>
          Go back to Problems List
        </Link>
      </div>
    );
  }
  if (!problem) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.icon}
          />{" "}
          Problem data could not be loaded or is not available.
        </div>
        <Link to="/" className={styles.backLink}>
          Go back to Problems List
        </Link>
      </div>
    );
  }

  const difficultyClass =
    styles[`difficulty${problem.difficulty?.toLowerCase()}`] ||
    styles.difficultyDefault;
  const editorTheme = isWhiteMode ? "github" : "monokai";

  return (
    <div
      className={`${styles.editorLayout} ${
        isWhiteMode ? styles.whiteMode : styles.darkMode
      }`}
    >
      {/* Left Panel: Problem Description */}
      <div className={styles.leftPanel}>


      <button
        onClick={() => setShowSubmissions(!showSubmissions)}
        style={{
          padding: '10px 20px', // Add padding
          backgroundColor: '#007bff', // A pleasant blue background
          color: 'white', // White text color
          border: 'none', // Remove default border
          borderRadius: '5px', // Slightly rounded corners
          cursor: 'pointer', // Show pointer cursor on hover
          fontSize: '16px', // Slightly larger font
          margin: '10px 0', // Add some margin top and bottom
          // Add more styles as you like!
        }}
      >
        Your Submissions
      </button>

        {/* Place the submission list right below the button */}
        {showSubmissions && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#121212' }}>
            {!loadingSubmissions &&
              submissions.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => {
                    setSelectedLanguage(sub.lang)
                    setCode(sub.submitted_code)
                  }}
                  style={{
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#1e1e1e',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, background 0.2s',
                    color: '#e0e0e0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a'
                    e.currentTarget.style.transform = 'scale(1.01)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e1e1e'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem', color: '#ffffff' }}>
                    {new Date(sub.timestamp).toLocaleString()}
                  </p>
                  <p style={{ margin: '0.5rem 0', color: '#aaaaaa' }}>Language: {sub.lang}</p>
                  <p
                    style={{
                      margin: 0,
                      color: sub.result === 'Accepted' ? '#4caf50' : '#f44336',
                    }}
                  >
                    Status: {sub.result}
                  </p>
                </div>
              ))}
          </div>
        )}

        <h1 className={styles.title}>{problem.title || "Problem Title"}</h1>
        <div className={styles.meta}>
          <span className={`${styles.difficulty} ${difficultyClass}`}>
            {problem.difficulty || "N/A"}
          </span>
          {problem.category && (
            <span className={styles.category}>{problem.category}</span>
          )}
        </div>

        {/* Structured Description Rendering */}
        <div className={styles.descriptionContainer}>
          {problem.question && (
            <p
              className={styles.Question}
              dangerouslySetInnerHTML={{
                __html: problem.question.replace(
                  /`([^`]+)`/g,
                  "<code>$1</code>"
                ),
              }}
            >
              {/* Using dangerouslySetInnerHTML here ONLY for simple inline code formatting */}
            </p>
          )}

          {problem.description?.header && (
            <p
              className={styles.descriptionHeader}
              dangerouslySetInnerHTML={{
                __html: problem.description.header.replace(
                  /`([^`]+)`/g,
                  "<code>$1</code>"
                ),
              }}
            >
            </p>
          )}

          {Array.isArray(problem.description?.example) &&
            problem.description.example.length > 0 && (
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
                {problem.description.constraints
                  .split("\n")
                  .map(
                    (constraint, index) =>
                      constraint.trim() && (
                        <li key={index}>{constraint.trim()}</li>
                      )
                  )}
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
          {typeof problem.description !== "object" && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />
          )}
        </div>
      </div>{" "}
      {/* End Left Panel */}
      {/* Right Panel: Editor and Results */}
      <div className={styles.rightPanel}>
        {/* Editor Controls: Theme Toggle, Language Selector */}
        <div className={styles.editorControls}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={isWhiteMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label={
              isWhiteMode ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
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
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}{" "}
                  {/* Capitalize */}
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
              useWorker: false,
            }}
          />
        </div>
        {/* Results Panel: Tabs for Test Cases and Console */}
        <div className={styles.resultsPanel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "testcase" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("testcase")}
              aria-selected={activeTab === "testcase"}
            >
              <FontAwesomeIcon icon={faListAlt} className={styles.icon} /> Test
              Cases (3)
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "console" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("console")}
              aria-selected={activeTab === "console"}
            >
              <FontAwesomeIcon icon={faTerminal} className={styles.icon} />{" "}
              Console
            </button>
          </div>

          {/* Tab Content Area */}
          <div className={styles.tabContent}>
            {/* {console.log("test case is " , testResults)} */}
            {activeTab === "testcase" && (
              <div className={styles.testCasesContainer}>
                {testResults.length > 0 ? (
                  testResults.slice(0,3).map((tc, index) => (
                    <div
                      key={tc.id || index}
                      className={`${styles.testCaseItem} ${
                        styles[`testStatusBorder_${tc.status}`]
                      }`}
                    >
                      <div className={styles.testCaseHeader}>
                        <h4>Test Case {index + 1}</h4>
                        <span
                          className={`${styles.testStatus} ${
                            styles[`testStatus_${tc.status}`]
                          }`}
                        >
                          {tc.status.charAt(0).toUpperCase() +
                            tc.status.slice(1)}
                        </span>
                      </div>
                      {/* Show Input always */}
                      <div className={styles.testCaseDetail}>
                        <strong>Input:</strong>
                        <pre>
                          {/* {console.log("tc.input is ", tc.input)} */}
                          {tc.input && JSON.stringify(tc.input, null, 2)}
                        </pre>
                      </div>

                      {/* Show Output only if not pending */}
                      {tc.status !== "pending" && (
                        <div className={styles.testCaseDetail}>
                          <strong>Output:</strong>
                          <pre
                            className={
                              tc.status === "failed" ? styles.failedOutput : ""
                            }
                          >
                            {tc.output !== null && tc.output !== undefined
                              ? String(tc.output)
                              : tc.status === "running"
                              ? "Running..."
                              : "N/A"}
                          </pre>
                        </div>
                      )}
                      {/* Show Expected only if failed or passed (not pending/running) */}
                      {tc.expected !== undefined && (
                        <div className={styles.testCaseDetail}>
                          <strong>Expected Output :</strong>
                          <pre className={styles.expectedOutput}>
                            {String(tc.expected)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className={styles.noTestsMessage}>
                    No test cases available for this problem or they haven't
                    been run yet.
                  </p>
                )}
              </div>
            )}
            {activeTab === "console" && (
              <pre className={styles.consoleOutput}>
                {consoleOutput ||
                  'Console output will appear here. Click "Run" to execute your code with sample input or "Submit" to run against all test cases.'}
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
              onClick={() => handleSubmitCode()}
              disabled={
                loading || !problem || !testResults || testResults.length === 0
              }
              title="Submit code to run against all test cases"
            >
              <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />{" "}
              Submit
            </button>
          </div>
        </div>{" "}
        {/* End Results Panel */}
      </div>{" "}
      {/* End Right Panel */}
    </div>
  );
};

export default CodeEditorPage;
