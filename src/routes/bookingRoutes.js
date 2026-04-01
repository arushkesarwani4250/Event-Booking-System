const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
//

// Handles POST requests to /bookings
router.route('/')
    .post(createBooking);

module.exports = router;
