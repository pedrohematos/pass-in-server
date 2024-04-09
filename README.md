# ✋ Pass.in

Pass.in is an application for **managing participants in in-person events**.

The tool allows the organizer to register an event and open a public registration page.

Registered participants can generate a credential for check-in on the day of the event.

The system will scan the participant's credential to allow entry to the event.

## Requirements

### Functional Requirements

- [x] The organizer should be able to register a new event;
- [x] The organizer should be able to view event data;
- [x] The organizer should be able to view the list of participants;
- [x] Participants should be able to register for an event;
- [x] Participants should be able to view their registration badge;
- [x] Participants should be able to check-in to the event;

### Business Rules

- [x] Participants can only register for an event once;
- [x] Participants can only register for events with available spots;
- [x] Participants can only check-in to an event once;

### Non-functional Requirements

- [x] Event check-in will be performed through a QRCode;

## Local Deployment Instructions

### Prerequisites

- Node.js and npm installed
- Docker installed on your machine if you don't have a PostgreSQL database

### Setup

1. Clone the repository to your local machine:

```bash
git clone https://github.com/pedrohematos/pass-in-server.git
```

2. Navigate to the project directory:

```bash
cd pass-in-server
```

3. Create a `.env` file in the project root folder based on the provided `.env.example` file and fill in the necessary environment variables.

To run with Docker, only these variables are necessary:

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

To run without Docker, fill in the PORT (optional) and DATABASE_URL. DATABASE_URL is the connection string to access your PostgreSQL database.

4. Install project dependencies using npm:

```bash
npm install
```

### Running the application with Docker

1. Use Docker Compose to build the Docker image and start the application along with the PostgreSQL database:

```bash
docker-compose up --build -d
```

This command will create the PostgreSQL database container and set up a persistent volume. It will also run the database migrations to create the necessary tables.

2. Once the containers are up and running, you can access the application locally.

### Running the Application with an already created PostgreSQL database

1. Run the application in watch mode.

```bash
npm run dev
```

### Accessing the Application

To access locally using Docker, the exposed port will be 3001 `http://localhost:3001`.

For all other cases, the exposed port will be determined by the environment variable `PORT`.

### Notes

- Ensure that the specified port in your `.env` file does not conflict with other services running on your machine.
- If opting to run using Docker, Make sure Docker is running and properly configured on your system before running the Docker Compose command.

### API Documentation

To access the API documentation, visit the `/docs` route of the API host. For example, if the API is running locally, you can access the documentation at `http://localhost:{port}/docs`.

## Database

In this application, a relational database (SQL) is used.

### ERD Diagram

![ERD Diagram of the database](.github/erd.svg)

### Database Structure (SQL)

```sql
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendeeId" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendeeId_key" ON "check_ins"("attendeeId");

```

### Future Improvements

- Implement authentication.
- Add administrator user functionality.
