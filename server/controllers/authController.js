// server/controllers/authController.js
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, enrol_no , name, email, password } = req.body;

    console.log('--- Registration Attempt ---'); // Log registration attempt
    console.log('Request Body:', req.body); // Log the request body

    try {
        console.log('Checking if user already exists...'); // Log user existence check
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            console.log('Registration Failed: User already exists'); // Log if user exists
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Creating new user...'); // Log before user creation
        // Create new user (password will be hashed by pre-save hook)
        user = await User.create({
            username,
            enrol_no,
            name,
            email,
            password
        });
        console.log("user object is " , user); // Existing log

        console.log('Registration successful, creating session...'); // Log session creation
        // Log the user in immediately by creating a session
        req.session.userId = user._id;
        req.session.username = user.username; // Store other relevant info if needed
        console.log('Session created:', req.session); // Log created session

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: 'Registration successful',
        });
        console.log('Registration response sent successfully.'); // Log successful response

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
// server/controllers/authController.js - Inside the login function

exports.login = async (req, res) => {
    const { emailOrUsername, password } = req.body;
    console.log('--- Login Attempt ---'); // Add Log
    console.log('Request Body:', req.body); // Add Log (Careful with password in production logs)

    if (!emailOrUsername || !password) {
        console.log('Login Failed: Missing credentials'); // Add Log
        return res.status(400).json({ message: 'Please provide email/username and password' });
    }
    
    try {
        // Find user by email or username, explicitly select password
        console.log(`Searching for user: ${emailOrUsername}`); // Add Log
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).select('+password');

        

        console.log("user is ", user);

        if (!user) {
            console.log(`Login Failed: User not found - ${emailOrUsername} , password is ${password}`); // Add Log
            return res.status(401).json({ message: 'Invalid credentials' }); // Keep generic message for client
        }

        console.log(`User Found: ${user.username}, checking password...`); // Add Log

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log(`Password Match Result for ${user.username}: ${isMatch}`); // Add Log !!!

        if (!isMatch) {
            console.log(`Login Failed: Password mismatch for ${user.username}`); // Add Log
            return res.status(401).json({ message: 'Invalid credentials' , username : emailOrUsername , password : password }); // Keep generic message for client
        }

        // --- If password matches ---
        console.log(`Login Successful for ${user.username}, creating session...`); // Add Log

        // Create session
        req.session.userId = user._id;
        req.session.username = user.username;

        console.log('Session created:', req.session); // Add Log

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: 'Login successful',
        });

    } catch (error) {
        console.error('Login Server Error:', error); // Log the actual server error
        res.status(500).json({ message: 'Server error during login' });
    }
};
// @desc    Log user out / destroy session
// @route   POST /api/auth/logout
// @access  Private (user must be logged in)
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        // Clear the cookie on the client side
        res.clearCookie('connect.sid'); // Use the default session cookie name or your configured name
        res.status(200).json({ message: 'Logout successful' });
    });
};

// @desc    Get current logged-in user info
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // If the protect middleware ran successfully, req.user should be set
    if (req.user) {
         res.status(200).json(req.user);
    } else {
        // Fallback in case protect middleware wasn't used or failed unexpectedly
         try {
             const user = await User.findById(req.session.userId);
             if (!user) {
                 return res.status(404).json({ message: 'User not found' });
             }
             res.status(200).json({
                 _id: user._id,
                 username: user.username,
                 email: user.email,
             });
         } catch (error) {
             console.error('GetMe Error:', error);
             res.status(500).json({ message: 'Server Error' });
         }
    }
};