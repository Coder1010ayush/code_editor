// routes/addContestRoutes.js

const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');

// POST /api/add-contest
router.post('/', async (req, res) => {
    try {
        const {
            name,
            start_time,
            end_time,
            participants,
            questions,
            contest_no,
            descr,
            rules,
            marking,
            status,
            visibility
        } = req.body;

        const newContest = new Contest({
            name,
            start_time,
            end_time,
            participants,
            questions,
            contest_no,
            descr,
            rules,
            marking,
            status,
            visibility
        });

        const savedContest = await newContest.save();
        res.status(201).json({ message: 'Contest added successfully', contest: savedContest });
    } catch (error) {
        console.error('Error adding contest:', error);
        res.status(500).json({ error: 'Failed to add contest' });
    }
});

module.exports = router;
