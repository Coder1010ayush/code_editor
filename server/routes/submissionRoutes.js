const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { username, question_id, submitted_code, result, lang } = req.body;

    const submission = new Submission({
      username,
      question_id,
      submitted_code,
      result,
      lang,
    });

    await submission.save();
    res.json({ _id: submission._id }); 
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ message: 'Failed to save submission.' });
  }
});

router.get("/:problemId", async (req, res) => {
  try { 
    const problemId = new mongoose.Types.ObjectId(req.params.problemId); 
    const { username } = req.query;

    console.log("Fetching submissions for question_id:", problemId, "and username:", username);

    const submissions = await Submission.find({
      question_id: problemId,
      username: username,
    })
    .sort({ timestamp: -1 }); 
    console.log(`Found ${submissions.length} submissions.`); 
    console.log(`Sumbmissions are ${submissions}`);

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    if (error.name === 'BSONTypeError') {
         res.status(400).json({ message: "Invalid Problem ID format" });
    } else {
         res.status(500).json({ message: "Internal Server Error" });
    }
  }
});


module.exports = router;
