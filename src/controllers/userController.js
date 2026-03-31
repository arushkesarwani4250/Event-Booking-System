const db = require('../db/db');

// GET /users/:id/bookings
const getUserBookings = async (req, res) => {
    try {
        const userId = req.params.id;

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

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
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
