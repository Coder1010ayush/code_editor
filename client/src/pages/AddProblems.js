// import React, { useState } from 'react';
// import styles from './AddProblems.module.css';

// const AddProblems = () => {
//   const [title, setTitle] = useState('');
//   const [question, setQuestion] = useState('');
//   const [difficulty, setDifficulty] = useState('Easy');
//   const [category, setCategory] = useState('');

//   const [extra, setExtra] = useState('');
//   const [header, setHeader] = useState('');
//   const [constraints, setConstraints] = useState('');
//   const [numTestCases, setNumTestCases] = useState(0);
//   const [testCases, setTestCases] = useState([]);
//   const [numExamples, setNumExamples] = useState(0);
//   const [examples, setExamples] = useState([]);
//   const argumentTypes = ['String', 'Number', 'Array', 'Object', 'Boolean', 'Null', 'Other'];

//   // Handles changes to individual arguments within a test case
//   const handleArgumentChange = (testCaseIndex, argumentIndex, field, value) => {
//     const newTestCases = [...testCases];
//     newTestCases[testCaseIndex].arguments[argumentIndex][field] = value;
//     setTestCases(newTestCases);
//   };

//   // Handles changes to the number of arguments for a specific test case
//   const handleNumArgumentsChange = (testCaseIndex, count) => {
//     const newTestCases = [...testCases];
//     newTestCases[testCaseIndex].numArguments = count;
//     // Initialize arguments array based on the new count
//     newTestCases[testCaseIndex].arguments = Array.from({ length: count }, () => ({ name: '', type: 'String', value: '' }));
//     setTestCases(newTestCases);
//   };

//   // Handles changes to the total number of test cases
//   const handleNumTestCasesChange = (e) => {
//     const count = parseInt(e.target.value, 10);
//     setNumTestCases(count);
//     // Initialize testCases array based on the new count
//     setTestCases(Array.from({ length: count }, () => ({ numArguments: 1, arguments: [{ name: '', type: 'String', value: '' }] })));
//   };

//   // Handles changes to the total number of examples
//   const handleNumExamplesChange = (e) => {
//     const count = parseInt(e.target.value, 10);
//     setNumExamples(count);
//     // Initialize examples array based on the new count
//     setExamples(Array.from({ length: count }, () => ({ input: '', output: '' })));
//   };

//   // **FIXED:** Handles changes to individual example input or output fields
//   const handleExampleChange = (index, field, value) => {
//     const newExamples = [...examples];
//     newExamples[index][field] = value;
//     setExamples(newExamples);
//   };


//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const problemData = {
//       title,
//       question,
//       difficulty,
//       category,
//       descr: {
//         extra,
//         header,
//         constraints,
//       },
//       test_cases: testCases,
//       example: examples,
//     };
//     console.log('Problem Data:', problemData);
//     // Here you would typically send problemData to your backend API
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Add Coding Problem</h1>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* Basic Problem Details */}
//         <div className={styles.section}>
//           <label htmlFor="title" className={styles.label}>Title:</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className={styles.input}
//             required
//           />
//         </div>

//         <div className={styles.section}>
//           <label htmlFor="question" className={styles.label}>Question:</label>
//           <textarea
//             id="question"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className={`${styles.input} ${styles.textarea}`}
//             required
//           ></textarea>
//         </div>

//         <div className={styles.section}>
//           <label htmlFor="difficulty" className={styles.label}>Difficulty:</label>
//           <select
//             id="difficulty"
//             value={difficulty}
//             onChange={(e) => setDifficulty(e.target.value)}
//             className={styles.select}
//           >
//             <option value="Easy">Easy</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//         </div>

//         <div className={styles.section}>
//           <label htmlFor="category" className={styles.label}>Category:</label>
//           <input
//             type="text"
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className={styles.input}
//             required
//           />
//         </div>

//         {/* Description Section */}
//         <div className={styles.section}>
//           <h2 className={styles.subTitle}>Description</h2>
//           <div className={styles.subSection}>
//             <label htmlFor="extra" className={styles.label}>Extra:</label>
//             <textarea
//               id="extra"
//               value={extra}
//               onChange={(e) => setExtra(e.target.value)}
//               className={`${styles.input} ${styles.textarea}`}
//             ></textarea>
//           </div>

//           <div className={styles.subSection}>
//             <label htmlFor="header" className={styles.label}>Header:</label>
//             <textarea
//               id="header"
//               value={header}
//               onChange={(e) => setHeader(e.target.value)}
//               className={`${styles.input} ${styles.textarea}`}
//             ></textarea>
//           </div>

//           <div className={styles.subSection}>
//             <label htmlFor="constraints" className={styles.label}>Constraints:</label>
//             <textarea
//               id="constraints"
//               value={constraints}
//               onChange={(e) => setConstraints(e.target.value)}
//               className={`${styles.input} ${styles.textarea}`}
//             ></textarea>
//           </div>
//         </div>

//         {/* Test Cases Section - Updated for multiple arguments with name */}
//         <div className={styles.section}>
//           <h2 className={styles.subTitle}>Test Cases</h2>
//           <div className={styles.subSection}>
//             <label htmlFor="numTestCases" className={styles.label}>Number of Test Cases:</label>
//             <select
//               id="numTestCases"
//               value={numTestCases}
//               onChange={handleNumTestCasesChange}
//               className={styles.select}
//             >
//               {[...Array(11).keys()].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>

//           {testCases.map((testCase, testCaseIndex) => (
//             <div key={testCaseIndex} className={styles.testCaseInput}>
//               <h3 className={styles.inputGroupTitle}>Test Case {testCaseIndex + 1}</h3>

//               {/* Dropdown for number of arguments for this test case */}
//               <div className={styles.testCaseRow}>
//                  <label htmlFor={`numArguments${testCaseIndex}`} className={styles.label}>Number of Arguments:</label>
//                  <select
//                     id={`numArguments${testCaseIndex}`}
//                     value={testCase.numArguments}
//                     onChange={(e) => handleNumArgumentsChange(testCaseIndex, parseInt(e.target.value, 10))}
//                     className={styles.select}
//                  >
//                     {[...Array(6).keys()].map(num => ( // Options from 0 to 5
//                        <option key={num} value={num}>{num}</option>
//                     ))}
//                  </select>
//               </div>

//               {/* Render inputs for each argument */}
//               {testCase.arguments.map((argument, argumentIndex) => (
//                  <div key={argumentIndex} className={styles.argumentInputContainer}>
//                     <h4>Argument {argumentIndex + 1}</h4>
//                     <div className={styles.argumentDetailsRow}> {/* Use new class for argument details row */}
//                        <div className={styles.inputGroup}>
//                           <label htmlFor={`argName${testCaseIndex}-${argumentIndex}`} className={styles.label}>Name:</label>
//                           <input
//                              type="text"
//                              id={`argName${testCaseIndex}-${argumentIndex}`}
//                              value={argument.name}
//                              onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'name', e.target.value)}
//                              className={styles.input}
//                              required
//                           />
//                        </div>
//                        <div className={styles.inputGroup}>
//                           <label htmlFor={`argType${testCaseIndex}-${argumentIndex}`} className={styles.label}>Type:</label>
//                           <select
//                              id={`argType${testCaseIndex}-${argumentIndex}`}
//                              value={argument.type}
//                              onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'type', e.target.value)}
//                              className={styles.select}
//                           >
//                              {argumentTypes.map(type => (
//                                 <option key={type} value={type}>{type}</option>
//                              ))}
//                           </select>
//                        </div>
//                        <div className={styles.inputGroup}>
//                           <label htmlFor={`argValue${testCaseIndex}-${argumentIndex}`} className={styles.label}>Value:</label>
//                           <input
//                              type="text"
//                              id={`argValue${testCaseIndex}-${argumentIndex}`}
//                              value={argument.value}
//                              onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'value', e.target.value)}
//                              className={styles.input}
//                              required
//                           />
//                        </div>
//                     </div>
//                  </div>
//               ))}
              

            
              
//             </div>
//           ))}
//         </div>

//         {/* Examples Section - Using 'input' and 'output' */}
//         <div className={styles.section}>
//           <h2 className={styles.subTitle}>Examples</h2>
//           <div className={styles.subSection}>
//             <label htmlFor="numExamples" className={styles.label}>Number of Examples:</label>
//             <select
//               id="numExamples"
//               value={numExamples}
//               onChange={handleNumExamplesChange} // This handles changing the COUNT of examples
//               className={styles.select}
//             >
//               {[...Array(6).keys()].map(num => ( // Options from 0 to 5
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>

//           {examples.map((example, index) => (
//             <div key={index} className={styles.exampleInput}>
//               <h3 className={styles.inputGroupTitle}>Example {index + 1}</h3>
//               <div className={styles.inputGroup}>
//                 <label htmlFor={`exampleInput${index}`} className={styles.label}>Input:</label>
//                 <input
//                   type="text"
//                   id={`exampleInput${index}`}
//                   value={example.input}
//                   // **FIXED:** Use the new handleExampleChange function
//                   onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
//                   className={styles.input}
//                   required
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor={`exampleOutput${index}`} className={styles.label}>Output:</label>
//                 <input
//                   type="text"
//                   id={`exampleOutput${index}`}
//                   value={example.output}
//                   // **FIXED:** Use the new handleExampleChange function
//                   onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
//                   className={styles.input}
//                   required
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <button type="submit" className={styles.submitButton}>Add Problem</button>
//       </form>
//     </div>
//   );
// };

// export default AddProblems;






import axios from "axios";
import React, { useState } from 'react';
import styles from './AddProblems.module.css';

const AddProblems = () => {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('');

  const [extra, setExtra] = useState('');
  const [header, setHeader] = useState('');
  const [constraints, setConstraints] = useState('');
  const [numTestCases, setNumTestCases] = useState(0);
  // Update testCases state structure to include expectedOutput
  const [testCases, setTestCases] = useState([]);
  const [numExamples, setNumExamples] = useState(0);
  const [examples, setExamples] = useState([]);
  const argumentTypes = ['String', 'Number', 'Array', 'Object', 'Boolean', 'Null', 'Other'];

  // Handles changes to individual arguments within a test case
  const handleArgumentChange = (testCaseIndex, argumentIndex, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].arguments[argumentIndex][field] = value;
    setTestCases(newTestCases);
  };

  // Handles changes to the number of arguments for a specific test case
  const handleNumArgumentsChange = (testCaseIndex, count) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].numArguments = count;
    // Initialize arguments array based on the new count
    newTestCases[testCaseIndex].arguments = Array.from({ length: count }, () => ({ name: '', type: 'String', value: '' }));
    setTestCases(newTestCases);
  };

  // Handles changes to the total number of test cases
  const handleNumTestCasesChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumTestCases(count);
    // Initialize testCases array based on the new count
    // Include expectedOutput structure for each new test case
    setTestCases(Array.from({ length: count }, () => ({
      numArguments: 1,
      arguments: [{ name: '', type: 'String', value: '' }],
      expectedOutput: { type: 'String', value: '' } // Added expectedOutput
    })));
  };

  // Handles changes to the expected output for a specific test case
  const handleExpectedOutputChange = (testCaseIndex, field, value) => {
      const newTestCases = [...testCases];
      newTestCases[testCaseIndex].expectedOutput[field] = value;
      setTestCases(newTestCases);
  };


  // Handles changes to the total number of examples
  const handleNumExamplesChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumExamples(count);
    // Initialize examples array based on the new count
    setExamples(Array.from({ length: count }, () => ({ input: '', output: '' })));
  };

  // Handles changes to individual example input or output fields
  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  function transformTestCases(testCases) {
    return testCases.map(testCase => {
      const entry = {};
  
      // Add each argument as key-value pair (parsing by type)
      testCase.arguments.forEach(arg => {
        let value = arg.value;
        switch (arg.type) {
          case 'String':
            value = String(value);
            break;
          case 'Number':
            value = Number(value);
            break;
          case 'Boolean':
            value = value === 'true';
            break;
          case 'Array':
            value = JSON.parse(value);
            break;
          case 'Object':
            value = JSON.parse(value);
            break;
          default:
            // fallback as string
            value = String(value);
        }
        entry[arg.name] = value;
      });
  
      // Parse output based on its type
      let outputValue = testCase.expectedOutput.value;
      switch (testCase.expectedOutput.type) {
        case 'Array':
        case 'Object':
          outputValue = JSON.parse(outputValue);
          break;
        case 'Number':
          outputValue = Number(outputValue);
          break;
        case 'Boolean':
          outputValue = outputValue === 'true';
          break;
        case 'String':
        default:
          outputValue = String(outputValue);
      }
  
      entry.output = outputValue;
      entry.keys = testCase.arguments.map(arg => arg.name);
      return entry;
    });
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const problemData = {
      title,
      question,
      difficulty,
      category,
      descr: {
        header,
        examples,
        extra,
        constraints,
      },
      test_cases: transformTestCases(testCases),
    };
    console.log('Problem Data:', problemData);
    console.log('testcases are : ' , testCases);
    // /api/log
    try {
      const response = await fetch('/api/problems', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(problemData),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to add problem:', errorData);
          alert(`Error: ${errorData.error || 'Could not add problem'}`); 
          return;
      }

      const addedProblem = await response.json();
      console.log('Problem added successfully:', addedProblem);
      alert('Problem added successfully!'); 
    } catch (error) {
        console.error('Error sending problem data:', error);
        alert('An unexpected error occurred while adding the problem.');
    }

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

        {/* Test Cases Section - Updated for multiple arguments with name and Expected Output */}
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
              {[...Array(11).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {testCases.map((testCase, testCaseIndex) => (
            <div key={testCaseIndex} className={styles.testCaseInput}>
              <h3 className={styles.inputGroupTitle}>Test Case {testCaseIndex + 1}</h3>

              {/* Dropdown for number of arguments for this test case */}
              <div className={styles.testCaseRow}>
                 <label htmlFor={`numArguments${testCaseIndex}`} className={styles.label}>Number of Arguments:</label>
                 <select
                    id={`numArguments${testCaseIndex}`}
                    value={testCase.numArguments}
                    onChange={(e) => handleNumArgumentsChange(testCaseIndex, parseInt(e.target.value, 10))}
                    className={styles.select}
                 >
                    {[...Array(6).keys()].map(num => ( // Options from 0 to 5
                       <option key={num} value={num}>{num}</option>
                    ))}
                 </select>
              </div>

              {/* Render inputs for each argument */}
              {testCase.arguments.map((argument, argumentIndex) => (
                 <div key={argumentIndex} className={styles.argumentInputContainer}>
                    <h4>Argument {argumentIndex + 1}</h4>
                    <div className={styles.argumentDetailsRow}> {/* Use new class for argument details row */}
                       <div className={styles.inputGroup}>
                          <label htmlFor={`argName${testCaseIndex}-${argumentIndex}`} className={styles.label}>Name:</label>
                          <input
                             type="text"
                             id={`argName${testCaseIndex}-${argumentIndex}`}
                             value={argument.name}
                             onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'name', e.target.value)}
                             className={styles.input}
                             required
                          />
                       </div>
                       <div className={styles.inputGroup}>
                          <label htmlFor={`argType${testCaseIndex}-${argumentIndex}`} className={styles.label}>Type:</label>
                          <select
                             id={`argType${testCaseIndex}-${argumentIndex}`}
                             value={argument.type}
                             onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'type', e.target.value)}
                             className={styles.select}
                          >
                             {argumentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                             ))}
                          </select>
                       </div>
                       <div className={styles.inputGroup}>
                          <label htmlFor={`argValue${testCaseIndex}-${argumentIndex}`} className={styles.label}>Value:</label>
                          <input
                             type="text"
                             id={`argValue${testCaseIndex}-${argumentIndex}`}
                             value={argument.value}
                             onChange={(e) => handleArgumentChange(testCaseIndex, argumentIndex, 'value', e.target.value)}
                             className={styles.input}
                             required
                          />
                       </div>
                    </div>
                 </div>
              ))}

              {/* Expected Output Section for this Test Case */}
              <div className={styles.argumentInputContainer}> {/* Reuse container class for consistent spacing */}
                 <h4>Expected Output</h4>
                 <div className={styles.argumentDetailsRow}> {/* Reuse class for layout */}
                    <div className={styles.inputGroup}>
                       <label htmlFor={`expectedOutputType${testCaseIndex}`} className={styles.label}>Type:</label>
                       <select
                          id={`expectedOutputType${testCaseIndex}`}
                          value={testCase.expectedOutput.type} // Bind value to state
                          onChange={(e) => handleExpectedOutputChange(testCaseIndex, 'type', e.target.value)} // Use new handler
                          className={styles.select}
                       >
                          {argumentTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                          ))}
                       </select>
                    </div>
                    <div className={styles.inputGroup}>
                       <label htmlFor={`expectedOutputValue${testCaseIndex}`} className={styles.label}>Value:</label>
                       <input
                          type="text"
                          id={`expectedOutputValue${testCaseIndex}`}
                          value={testCase.expectedOutput.value} // Bind value to state
                          onChange={(e) => handleExpectedOutputChange(testCaseIndex, 'value', e.target.value)} // Use new handler
                          className={styles.input}
                          required
                       />
                    </div>
                 </div>
              </div>


            </div>
          ))}
        </div>

        {/* Examples Section - Using 'input' and 'output' */}
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Examples</h2>
          <div className={styles.subSection}>
            <label htmlFor="numExamples" className={styles.label}>Number of Examples:</label>
            <select
              id="numExamples"
              value={numExamples}
              onChange={handleNumExamplesChange} // This handles changing the COUNT of examples
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
                <label htmlFor={`exampleInput${index}`} className={styles.label}>Input:</label>
                <input
                  type="text"
                  id={`exampleInput${index}`}
                  value={example.input}
                  onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={`exampleOutput${index}`} className={styles.label}>Output:</label>
                <input
                  type="text"
                  id={`exampleOutput${index}`}
                  value={example.output}
                  onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
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