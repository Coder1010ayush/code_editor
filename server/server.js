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
const addContestRoutes = require('./routes/addContestRoutes');
const vm = require('vm'); 
const Problem = require('./models/Problem'); 
dotenv.config();
const dbConnectionPromise = connectDB();

const app = express();

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