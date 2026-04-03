const db = require('../db/db');

// GET /users/:id/bookings
const getUserBookings = async (req, res) => {
    try {
        const userId = req.params.id;

        // Input Validation
        if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid user ID is required' });
        }

        //  using a SQL JOIN to combine data from the Bookings table and the Events table 

        const query = `
            SELECT b.id AS booking_id, b.ticket_code, b.booking_date, 
                   e.id AS event_id, e.title, e.date
            FROM Bookings b
            JOIN Events e ON b.event_id = e.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `;

        const [bookings] = await db.query(query, [userId]);

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create a new user

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Input Validation
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Valid name is required' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Valid email is required' });
        }
        const query = 'INSERT INTO Users (name, email) VALUES (?, ?)';
        const [result] = await db.query(query, [name, email]);

        res.status(201).json({
            success: true,
            message: 'User created',
            data: { id: result.insertId, name, email }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getUserBookings,
    createUser
};
