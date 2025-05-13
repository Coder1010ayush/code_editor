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
  const problemId = new mongoose.Types.ObjectId(req.params.problemId);
  const { username } = req.query;
  console.log("Fetching submissions for problemId:", problemId, "and username:", username);

  const submissions = await Submission.find({
    problemId,
    username,
  }).sort({ date: -1 }); // newest first

  console.log("Submissions:", submissions);
  res.json(submissions);
});


module.exports = router;
