const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET /api/problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find({}, 'title difficulty category'); // Return only necessary fields
        res.json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});


// router.get('/', async (req, res) => {
//     try {
//         console.log('GET /api/problems route hit');
//         const problems = await Problem.find({}, 'title difficulty category');
//         console.log('Fetched problems:', problems);
//         res.json(problems);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch problems' });
//     }
// });



module.exports = router;
