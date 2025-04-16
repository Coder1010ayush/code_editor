// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

// Connect to database and get connection object
const dbConnectionPromise = connectDB();

const app = express();

// --- Middleware ORDER MATTERS! ---

// 1. CORS Middleware (allow requests from React frontend)
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow frontend origin
    credentials: true, // Crucial for cookies/sessions
}));

// 2. Body Parsers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 3. Cookie Parser (needed before express-session)
app.use(cookieParser());

// 4. Express Session Middleware
// Ensure DB connection is ready before setting up session store
dbConnectionPromise.then(mongooseConnection => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        store: MongoStore.create({
            client: mongooseConnection.connection.getClient(), // Use the underlying client from Mongoose connection
            collectionName: 'sessions', // Optional: specify collection name for sessions
            ttl: 14 * 24 * 60 * 60, // Session TTL (14 days)
            autoRemove: 'interval',
            autoRemoveInterval: 10, // Check every 10 minutes to remove expired sessions
        }),
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiry (14 days), match TTL
            httpOnly: true, // Prevent client-side JS access (security)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // Adjust as needed ('strict', 'lax', 'none')
            // If using 'none', secure must be true. 'lax' is a good default.
        }
    }));

    // --- Mount Routers ---
    app.use('/api/auth', authRoutes);
    // Add other routes here (e.g., for problems, submissions)
    // app.use('/api/problems', problemRoutes);

    // Simple Root Route (Optional)
    app.get('/', (req, res) => {
        res.send('API is running...');
    });

    // --- Start Server ---
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
    console.log("connect to db");

}).catch(err => {
    console.error("Failed to connect to MongoDB, server not started", err);
    process.exit(1);
});