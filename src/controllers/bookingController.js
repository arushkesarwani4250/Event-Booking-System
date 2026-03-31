const db = require('../db/db');
const crypto = require('crypto');

const createBooking = async (req, res) => {
    let connection;
    try {
        const { user_id, event_id } = req.body;

        if (!user_id || !event_id) {
            return res.status(400).json({ success: false, message: 'user_id and event_id are required' });
        }

        connection = await db.getConnection();
        
        // start transaction
        await connection.beginTransaction();

        // fetch event capacity and lock the row to avoid race conditions
        const [eventRows] = await connection.query(
            'SELECT total_capacity, remaining_tickets FROM Events WHERE id = ? FOR UPDATE',
            [event_id]
        );

        if (eventRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const remaining_tickets = eventRows[0].remaining_tickets;

        if (remaining_tickets <= 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Event sold out' });
        }

        // generate random ticket code for the user
        const ticketCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // create booking record
        await connection.query(
            'INSERT INTO Bookings (user_id, event_id, ticket_code) VALUES (?, ?, ?)',
            [user_id, event_id, ticketCode]
        );

        // decrease available tickets
        await connection.query(
            'UPDATE Events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?',
            [event_id]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Booking successful',
            ticket_code: ticketCode
        });

    } catch (error) {
        if (connection) {
            await connection.rollback(); // undo on error
        }
        console.error('Booking error: ', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release(); // return connection to pool
        }
    }
};

module.exports = {
    createBooking
};
