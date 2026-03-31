const express = require('express');
const router = express.Router();
const { getUserBookings, createUser } = require('../controllers/userController');

// Route to create a new user
router.route('/')
    .post(createUser);

// The :id syntax tells Express that 'id' is a dynamic variable (like /users/5/bookings)
router.route('/:id/bookings')
    .get(getUserBookings);

module.exports = router;
