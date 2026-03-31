const express = require('express');

// We use an Express Router to cleanly organize our URLs
const router = express.Router();

// Import the logic functions from our Controller
const { getEvents, createEvent, markAttendance } = require('../controllers/eventController');

// Map the HTTP Methods to their specific controller functions
// If someone sends a GET request to '/', run getEvents
// If someone sends a POST request to '/', run createEvent
router.route('/')
    .get(getEvents)
    .post(createEvent);

// Route for marking attendance using a dynamic event ID in the URL
router.route('/:id/attendance')
    .post(markAttendance);

module.exports = router;
