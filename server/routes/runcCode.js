const express = require('express');
const bodyParser = require('body-parser');
const vm = require('vm');
const app = express();
const port = 5001;

app.use(bodyParser.json());

app.post('/api/run-test', (req, res) => {
    console.log("in the forest ");
    console.log('Received /api/run-test request:', req.body);
    const userCode = req.body.code;
    const inputToRun = req.body.input; 

    try {
        const script = new vm.Script(`
            output = (function(input) {
                ${userCode}
                return twoSum(input.nums, input.target); // Call the 'twoSum' function with the correct arguments
            })(inputToRun);
        `);
        const context = { output: null };
        script.runInNewContext(context, { timeout: 1000 });
        console.log('Execution successful, sending response:', { actualOutput: context.output, error: null });

        res.json({ actualOutput: context.output, error: null });
    } catch (error) {
        console.error('Error running code:', error);
        res.status(500).json({ actualOutput: null, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

