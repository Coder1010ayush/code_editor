const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

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
    res.json({ _id: newSubmission._id }); // 👈 send back the _id
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ message: 'Failed to save submission.' });
  }
});

module.exports = router;
