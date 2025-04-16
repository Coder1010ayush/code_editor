// server/middleware/authMiddleware.js
const User = require('../models/User');

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            // Find the user based on the session userId and attach it to the request
            // Exclude the password field
            req.user = await User.findById(req.session.userId).select('-password');

            if (!req.user) {
                // If user not found (e.g., deleted after session creation)
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next(); // User is authenticated, proceed to the next middleware/route handler
        } catch (error) {
            console.error('Authentication middleware error:', error);
             return res.status(401).json({ message: 'Not authorized, token failed' }); // Generic error
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no session' });
    }
};