const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const contestRoutes = require('./routes/contestRoutes');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const addContestRoutes = require('./routes/addContestRoutes');
const vm = require('vm'); 
const Problem = require('./models/Problem'); 
const fs = require('fs').promises; // Using promises for async file operations
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const util = require('util');

dotenv.config();
const dbConnectionPromise = connectDB();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnectionPromise.then(mongooseConnection => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client: mongooseConnection.connection.getClient(),
            collectionName: 'sessions',
            ttl: 14 * 24 * 60 * 60,
            autoRemove: 'interval',
            autoRemoveInterval: 10,
        }),
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        }
    }));


const pythonHarnessCode = `
import sys
import json
import traceback

# --- User's Python code (userCode) will be dynamically prepended here by Node.js ---
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Example User Code (would be replaced by req.body.code):
#
# def server_side_runner(arg1, arg2):
#     # Simple example: concatenate strings or sum numbers
#     if isinstance(arg1, str) and isinstance(arg2, str):
#         return arg1 + " " + arg2
#     elif isinstance(arg1, (int, float)) and isinstance(arg2, (int, float)):
#         return arg1 + arg2
#     else:
#         return "Unsupported argument types"
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def _run_python_test_case_main():
    if len(sys.argv) < 4:
        # sys.argv in 'python3 -c "<code>" arg1 arg2 arg3' is ['-c', 'arg1', 'arg2', 'arg3']
        error_message = "Internal Error: Python runner script expects 3 arguments (input_json_string, keys_json_string, target_function_name)."
        print(json.dumps({"output": None, "error": {"type": "RunnerArgumentError", "message": error_message, "traceback": ""}}))
        sys.exit(1) # Exit with error code

    input_json_str = sys.argv[1]
    keys_json_str = sys.argv[2]
    target_function_name = sys.argv[3]

    try:
        current_input = json.loads(input_json_str)
        keys = json.loads(keys_json_str)

        if not isinstance(keys, list) or not keys:
             raise ValueError("Keys must be a non-empty list.") # Should be caught by Node.js validation too

        if target_function_name not in globals() or not callable(globals()[target_function_name]):
            raise NameError(f"User code must define a callable function named '{target_function_name}'. Make sure it's defined at the top level.")

        args_to_pass = []
        for key in keys:
            if key not in current_input:
                raise KeyError(f"Key '{key}' not found in the input object: {current_input}")
            args_to_pass.append(current_input[key])
        
        # Call the user's function (e.g., server_side_runner)
        result_value = globals()[target_function_name](*args_to_pass)
        
        # Ensure output is JSON serializable
        try:
            json.dumps({"output": result_value, "error": None}) # Test serialization
            print(json.dumps({"output": result_value, "error": None}))
        except TypeError as te:
            raise TypeError(f"The output of the function '{target_function_name}' is not JSON serializable: {str(te)}. Output was: {repr(result_value)}")


    except Exception as e:
        tb_str = traceback.format_exc()
        error_details = {
            "type": type(e).__name__,
            "message": str(e),
            "traceback": tb_str
        }
        # Attempt to print JSON error, but script might fail before this if error is severe
        try:
            print(json.dumps({"output": None, "error": error_details}))
        except Exception: # Fallback if printing JSON error fails
            sys.stderr.write(f"Fallback Error: {type(e).__name__}: {str(e)}\\n{tb_str}")
        sys.exit(0) # Exit 0 as we've reported the error in JSON format via stdout (if possible)

if __name__ == "__main__":
    _run_python_test_case_main()
`;

    app.post('/api/run-python-test', async (req, res) => {
        console.log("Received /api/run-python-test request:", req.body);

        const userCode = req.body.code;
        const inputsToRun = req.body.input; // Renamed for clarity, was req.body.input in JS example
        const keys = req.body.keys;
        const functionName = req.body.functionName || 'server_side_runner'; // Configurable function name, defaults to server_side_runner
        const pythonExecutable = req.body.pythonExecutable || 'python3'; // Configurable Python executable
        const timeoutMs = req.body.timeoutMs || 5000; // Default 5 seconds timeout

        if (!userCode) {
            return res.status(400).json({ error: 'Expected "code" (Python code) in the request body.' });
        }
        if (!Array.isArray(inputsToRun)) {
            return res.status(400).json({ error: 'Expected "input" to be an array of objects in the request body.' });
        }
        if (!Array.isArray(keys) || keys.length === 0) {
            // If keys can be empty to pass the whole input object, adjust this validation and the Python harness.
            // For now, maintaining similarity with the JS example's strict key requirement.
            return res.status(400).json({ error: 'Expected "keys" to be a non-empty array of strings in the request body.' });
        }

        const results = [];
        const fullPythonScript = `${userCode}\n\n${pythonHarnessCode}`;

        for (let i = 0; i < inputsToRun.length; i++) {
            const inputObject = inputsToRun[i];
            console.log(`Running Python test case ${i + 1} with input:`, inputObject);

            const promise = new Promise((resolve) => {
                let stdoutData = '';
                let stderrData = '';

                const scriptArgs = [
                    '-c',
                    fullPythonScript,
                    JSON.stringify(inputObject),
                    JSON.stringify(keys),
                    functionName
                ];
                
                const pythonProcess = spawn(pythonExecutable, scriptArgs, { timeout: timeoutMs });

                pythonProcess.stdout.on('data', (data) => {
                    stdoutData += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    stderrData += data.toString();
                });

                pythonProcess.on('error', (err) => {
                    // Errors in spawning the process itself (e.g., python3 not found)
                    console.error(`Failed to start Python process for test case ${i + 1}:`, err);
                    results.push({
                        input: inputObject,
                        actualOutput: null,
                        error: `Failed to start subprocess: ${err.message}`
                    });
                    resolve();
                });

                pythonProcess.on('close', (code, signal) => {
                    console.log(`Python process for test case ${i + 1} exited with code ${code}, signal ${signal}`);
                    console.log(`Test Case ${i + 1} STDOUT:`, stdoutData);
                    if (stderrData) {
                        console.error(`Test Case ${i + 1} STDERR:`, stderrData);
                    }

                    if (signal === 'SIGTERM' || (code !== 0 && !stdoutData && stderrData)) { // SIGTERM due to timeout or other crash
                        results.push({
                            input: inputObject,
                            actualOutput: null,
                            error: signal === 'SIGTERM' ? `Execution timed out after ${timeoutMs}ms.` : `Python script error (exit code ${code}): ${stderrData || 'No stderr output.'}`
                        });
                    } else {
                        try {
                            const outputJson = JSON.parse(stdoutData);
                            if (outputJson.error) {
                                results.push({
                                    input: inputObject,
                                    actualOutput: null,
                                    error: outputJson.error // This can be a string or an object {type, message, traceback}
                                });
                            } else {
                                results.push({
                                    input: inputObject,
                                    actualOutput: outputJson.output,
                                    error: null
                                });
                            }
                        } catch (parseError) {
                            results.push({
                                input: inputObject,
                                actualOutput: stdoutData, // Could be partial or non-JSON output
                                error: `Failed to parse Python output as JSON. STDERR: ${stderrData || 'None'}. Raw STDOUT: ${stdoutData}`
                            });
                        }
                    }
                    resolve();
                });
            });
            await promise; // Process test cases sequentially
        }

        console.log('Python test execution completed, sending response:', { results });
        res.json({ results });
    });



    // --- Define the /api/run-test route here ---
    app.post('/api/run-test', (req, res) => {
        console.log("Received /api/run-test request:", req.body);
    
        const userCode = req.body.code;
        const inputsToRun = req.body.input;
        const keys = req.body.keys;
    
        if (!userCode) {
            return res.status(400).json({ error: 'Expected "code" in the request body.' });
        }
        if (!Array.isArray(inputsToRun)) {
            return res.status(400).json({ error: 'Expected "input" to be an array of objects in the request body.' });
        }
        if (!Array.isArray(keys) || keys.length === 0) {
            return res.status(400).json({ error: 'Expected "keys" to be a non-empty array of strings in the request body.' });
        }
    
        const results = [];
    
        inputsToRun.forEach((inputObject, index) => {
            try {
                const argsString = keys.map(key => `currentInput['${key}']`).join(', ');
    
                const scriptContent = `
                    ${userCode}
                    const currentInput = ${JSON.stringify(inputObject)};
                    try {
                        output = server_side_runner(${argsString});
                    } catch (runnerError) {
                        throw new Error('Error in server_side_runner: ' + runnerError.message);
                    }
                `;
    
                const context = {
                    output: undefined,
                    console 
                };
    
                const script = new vm.Script(scriptContent);
    
                console.log(`Running test case ${index + 1} with input:`, inputObject);
                script.runInNewContext(context, { timeout: 1000 });
    
                console.log(`Execution successful for test case ${index + 1}, output:`, context.output);
                results.push({ input: inputObject, actualOutput: context.output, error: null });
    
            } catch (error) {
                console.error(`Error running code for test case ${index + 1}:`, error);
                results.push({ input: inputObject, actualOutput: null, error: error.message });
            }
        });
    
        console.log('Test execution completed, sending response:', { results });
        res.json({ results });
    });


    app.post('/api/log', (req, res) => {
        const userCode = req.body;
        console.log("data received is", util.inspect(userCode, { depth: null, colors: true }));
        res.sendStatus(200);
    });
    

    // --- Mount Routers ---
    app.use('/api/auth', authRoutes);
    app.use('/api/problems', problemRoutes);
    app.use('/api/contests', contestRoutes);
    app.use('/api/add-contest', addContestRoutes);


    // Simple Root Route (Optional)
    app.get('/', (req, res) => {
        res.send('API is running...');
    });

    // --- Start Server ---
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
    console.log("connect to db");

}).catch(err => {
    console.error("Failed to connect to MongoDB, server not started", err);
    process.exit(1);
});