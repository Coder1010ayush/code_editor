// server/routes/problems.js
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); 

// GET /api/problems
// Fetches a list of problems with limited fields
router.get('/', async (req, res) => {
    try {
        // Adjust fields here based on what you need for the list view
        const problems = await Problem.find({}, 'title difficulty category');
        res.json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch problems list' });
    }
});

// GET /api/problems/:problemId
router.get('/:problemId', async (req, res) => {
    const problemId = req.params.problemId; 

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        const problemForClient = {
             _id: problem._id,
             title: problem.title,
             question: problem.question,
             difficulty: problem.difficulty,
             category: problem.category,
             description: problem.descr, 
             testCases: problem.test_cases, 
        };
        console.log("problem fetched is ", problemForClient);

        res.json(problemForClient); 
    } catch (error) {
        console.error(`Error fetching problem ${problemId}:`, error);
        if (error.name === 'CastError') {
             return res.status(400).json({ error: 'Invalid problem ID format' });
        }
        res.status(500).json({ error: 'Failed to fetch problem details' });
    }
});


module.exports = router;