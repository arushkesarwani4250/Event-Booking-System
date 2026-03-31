-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS event_booking_db;
USE event_booking_db;

-- 1. Users Table: Stores user basic info
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Events Table: Stores the event details and tracks capacity
CREATE TABLE IF NOT EXISTS Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    total_capacity INT NOT NULL,
    remaining_tickets INT NOT NULL,
    -- A CHECK constraint to ensure that remaining_tickets never drops below 0
    -- or goes above total_capacity at the database schema level as an extra safeguard
    CONSTRAINT chk_remaining_capacity CHECK (remaining_tickets >= 0 AND remaining_tickets <= total_capacity)
);

-- 3. Bookings Table: Links Users to Events and houses their unique ticket code
CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_code VARCHAR(100) NOT NULL UNIQUE,
    -- Foreign Keys enforce Data Integrity. 
    -- If a user/event is deleted, cascade the deletion
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
);

-- 4. Event Attendance Table: Records when a ticket is actually scanned/used
CREATE TABLE IF NOT EXISTS Event_Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    ticket_code VARCHAR(100) NOT NULL UNIQUE, 
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensure the ticket they are submitting actually exists in Bookings table
    FOREIGN KEY (ticket_code) REFERENCES Bookings(ticket_code) ON DELETE CASCADE
);
