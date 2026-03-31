const express = require('express');
const cors = require('cors');
require('dotenv').config();
// We import our database connection to ensure it connects when the server starts
const db = require('./src/db/db');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to allow cross-origin requests from browsers
app.use(cors());
// Middleware to automatically parse incoming JSON data from requests
app.use(express.json());

// Import Route Files
const eventRoutes = require('./src/routes/eventRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const userRoutes = require('./src/routes/userRoutes');

// A simple health route for checking if the server is running
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running '
    });
});

// Mount routes
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);

// Start listening
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
