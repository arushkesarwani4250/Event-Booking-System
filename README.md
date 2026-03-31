# Event Booking API

This is a backend RESTful API built with Node.js, Express, and MySQL for the Event Booking System selection test.

It allows users to create events, register users, book tickets, and manage event attendance. One of the main challenges of the project was handling concurrent bookings, which I managed by using database-level transaction locks.

## Tech Stack
- **Node.js**: The runtime environment.
- **Express.js**: For structuring the API routes.
- **MySQL2**: As the database driver. I used raw SQL queries instead of an ORM to demonstrate control over specific edge-cases.
- **Docker**: Included a `docker-compose` setup to run the app easily.

## Key Features
- **Handling Race Conditions**: During the ticket booking process (`POST /bookings`), I implemented a database transaction using `SELECT ... FOR UPDATE`. This mathematically locks the specific event row while the user is booking, ensuring that if two concurrent users book at the exact same millisecond, the total capacity never drops below zero.
- **Relational Integrity**: Set up strict foreign keys and `ON DELETE CASCADE` constraints in the schema to ensure data stays clean if a user or event is deleted.
- **Attendance Tracking**: Users receive a unique ticket code after booking, which can be verified at the door.

## How to Run Locally

### Scenario A: Using Docker
This is the easiest method. It requires zero configuration on your part.
1. Ensure Docker Desktop is installed.
2. Run `docker-compose up -d` in the terminal.
3. Docker will automatically pull the MySQL image, instantiate the tables using `schema.sql`, and start the Node.js API.
4. Server will be active on port `3000`.

### Scenario B: Manual Node & MySQL Setup
1. Open MySQL Workbench and run the queries inside the `schema.sql` file to create the tables.
2. Create or rename a `.env` file in the main folder with your database credentials:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=event_booking_db
   PORT=3000
   ```
3. Run `npm install` in your terminal to get the dependencies.
4. Run `npm start` to boot the server.

## Endpoints Overview
Below is a quick reference for the available REST routes in this application.

### Users
- `POST /users` - Register a new user in the system.
- `GET /users/:id/bookings` - Retrieve all bookings mapped to a specific user.

### Events
- `GET /events` - List all upcoming events and their capacity.
- `POST /events` - Create a new event (requires title, date, and total capacity).
- `POST /events/:id/attendance` - Validates a unique ticket code and marks the user as attended.

### Bookings
- `POST /bookings` - Book a ticket for an event. **Note**: This endpoint uses a strict SQL transaction (`BEGIN`, `SELECT ... FOR UPDATE`, `COMMIT`) to block race conditions.

## API Documentation & Testing
I have provided two exact ways to test the API functions above:
- **Swagger**: Open the `swagger.yaml` file into [editor.swagger.io](https://editor.swagger.io/) to view the fully interactive OpenAPI documentation.
- **Postman**: Import the `Event_Booking_API.postman_collection.json` file directly into Postman. It contains pre-filled request bodies to quickly test all the endpoints sequentially without typing.
