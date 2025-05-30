const express = require("express");
const router = express.Router();
const Contest = require("../models/Contest");

// Get all contests
router.get("/", async (req, res) => {
  try {
    const contests = await Contest.find().sort({ start_time: -1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contests." });
  }
});

// Get a specific contest by ID
router.get('/:id', async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        console.log("in server side contest data is " , contest);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        res.json(contest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a new contest
router.post("/", async (req, res) => {
  try {
    const contest = new Contest(req.body);
    const saved = await contest.save();
    res.status(201).json(saved);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create contest.", details: error.message });
  }
});

// Update an existing contest
router.put("/:id", async (req, res) => {
  try {
    const updated = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Contest not found." });
    }
    res.json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update contest.", details: error.message });
  }
});

router.put('/:id/join', async (req, res) => {
  const { username } = req.body;

  if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
  }

  try {
      const contest = await Contest.findById(req.params.id);
      if (!contest) {
          return res.status(404).json({ error: 'Contest not found.' });
      }

      // Check if the user has already joined
      const alreadyJoined = contest.participants.some(
          participant => participant.username === username
      );

      if (!alreadyJoined) {
          contest.participants.push({ username, attempted: [] , curr_score: 0.0, latest_time: new Date()});
          await contest.save();
      }

      res.json(contest);
  } catch (error) {
      console.error('Join contest error:', error);
      res.status(500).json({ error: 'Failed to join contest.' });
  }
});



// Delete a contest
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Contest not found." });
    }
    res.json({ message: "Contest deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contest." });
  }
});

  // Update contest route
  router.put('/update-contest/:id', async (req, res) => {
    const contestId = req.params.id;
    const updates = req.body; // Expecting JSON with fields to update

    try {
      const result = await Contest.findByIdAndUpdate(
        contestId,
        { $set: updates },
        { new: true } // return updated document
      );

      if (!result) {
        return res.status(404).json({ error: 'Contest not found' });
      }

      res.json({ message: 'Contest updated successfully', contest: result });
    } catch (error) {
      console.error('Error updating contest:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


module.exports = router;
