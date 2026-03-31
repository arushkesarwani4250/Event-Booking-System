const db = require('../db/db');

const getEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Events');
        
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, date, total_capacity } = req.body;

        if (!title || !date || !total_capacity) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const query = `
            INSERT INTO Events (title, description, date, total_capacity, remaining_tickets) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [title, description, date, total_capacity, total_capacity]);

        res.status(201).json({
            success: true,
            data: { id: result.insertId, title, total_capacity }
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const markAttendance = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { ticket_code } = req.body;

        if (!ticket_code) {
            return res.status(400).json({ success: false, message: 'Ticket code required' });
        }

        // verify ticket exists for this event
        const [bookingRows] = await db.query(
            'SELECT user_id FROM Bookings WHERE event_id = ? AND ticket_code = ?',
            [eventId, ticket_code]
        );

        if (bookingRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid ticket code' });
        }

        const userId = bookingRows[0].user_id;

        // check if already scanned
        const [attendanceRows] = await db.query(
            'SELECT id FROM Event_Attendance WHERE ticket_code = ?',
            [ticket_code]
        );

        if (attendanceRows.length > 0) {
            return res.status(400).json({ success: false, message: 'Ticket already used' });
        }

        // record attendance
        await db.query(
            'INSERT INTO Event_Attendance (user_id, event_id, ticket_code) VALUES (?, ?, ?)',
            [userId, eventId, ticket_code]
        );

        // find total booked tickets
        const [eventRows] = await db.query('SELECT total_capacity, remaining_tickets FROM Events WHERE id = ?', [eventId]);
        const totalBooked = eventRows[0].total_capacity - eventRows[0].remaining_tickets;

        res.status(200).json({
            success: true,
            data: {
                ticket_valid: true,
                total_event_tickets_booked: totalBooked
            }
        });
    } catch (error) {
        console.error('Attendance error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getEvents,
    createEvent,
    markAttendance
};
