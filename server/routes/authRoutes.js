// server/routes/authRoutes.js
const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout); // Protect logout route
router.get('/me', protect, getMe);       // Protect getMe route

module.exports = router;