# Ticket Booking System

A highly concurrent, real-time full-stack ticket booking system for movies and concerts. This application allows users to browse events, select seats on an interactive map with live updates, securely hold seats to prevent double-booking, and join waitlists for sold-out events.

## 🚀 Tech Stack

### Backend
- **Java 21** & **Spring Boot 3.3.x**
- **Spring Security (JWT)** for role-based authentication
- **Spring Data JPA** for data access
- **Spring WebSockets (STOMP over SockJS)** for real-time seat status broadcasting
- **ZXing** for QR code generation
- **JavaMailSender** for transactional email stubbing

### Frontend
- **React 18** & **TypeScript** (via Vite)
- **Tailwind CSS** for a dark, premium visual aesthetic
- **Framer Motion** for micro-animations and UI transitions
- **Lucide React** for iconography

### Infrastructure & Data
- **PostgreSQL 15** for persistent transactional storage
- **Redis 7** for ephemeral, high-speed seat hold caching

---

## 📋 Prerequisites
Ensure you have the following installed on your machine before running the project locally:
- **JDK 21** or newer
- **Node.js 18+** (with `npm`)
- **Docker & Docker Compose** (for running PostgreSQL and Redis)

---

## ⚙️ Local Setup

### 1. Database & Cache Infrastructure
Start the required PostgreSQL and Redis containers using Docker Compose from the root directory:
```bash
docker-compose up -d
```
*This starts Postgres on port `5432` and Redis on port `6379`.*

### 2. Backend Environment Variables
Create an `.env` file inside the `backend/` directory using the provided `.env.example` as a template:

```properties
# backend/.env.example
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ticket_db
SPRING_DATASOURCE_USERNAME=ticket_user
SPRING_DATASOURCE_PASSWORD=ticket_password

SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=ticket_redis_pass

SPRING_MAIL_HOST=localhost
SPRING_MAIL_PORT=1025
SPRING_MAIL_USERNAME=
SPRING_MAIL_PASSWORD=

JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
SERVER_PORT=8080
```

### 3. Run the Backend
Navigate to the `backend` directory and run the Spring Boot application using the Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend API will be available at `http://localhost:8080`.*

### 4. Frontend Environment Variables
Create an `.env` file inside the `frontend/` directory using the provided `.env.example`:

```properties
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=http://localhost:8080/ws
```

### 5. Run the Frontend
Navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## 🔌 API Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new User/Organiser/Admin.
- `POST /login` - Authenticate and receive a JWT.

### Events (`/api/v1/events`)
- `GET /` - List all active events with filtering (type, city).
- `GET /{id}` - Get detailed information about a specific event.
- `GET /{id}/seat-map` - Retrieve all seats for an event with their current statuses.

### Bookings (`/api/v1/bookings`)
- `POST /hold` - Place a temporary 10-minute hold on a list of seats.
- `POST /confirm` - Confirm a held booking, process payment, and generate a QR ticket.
- `GET /my` - Retrieve all past and upcoming bookings for the authenticated user.
- `DELETE /{id}` - Cancel an active booking and release the seats.

### Waitlist (`/api/v1/waitlist`)
- `POST /join` - Join the waitlist for a specific event and seat category.
- `GET /status/{eventId}` - Check the current position in the waitlist.

### WebSockets (`/ws`)
- **Topic:** `/topic/event/{eventId}/seats` - Broadcasts real-time `SeatStatusUpdateEvent` payloads to update client UI instantly when a seat changes status (AVAILABLE ↔ HELD ↔ BOOKED).

---

## 🗄️ Database Schema Summary
- **User**: Authentication, authorization (Role: ADMIN, ORGANISER, CUSTOMER).
- **Venue**: Physical location details containing grid layouts (`totalRows`, `totalCols`).
- **SeatCategory**: Links to a venue, defining pricing tiers (Premium, Gold, Standard) and UI color codes.
- **Seat**: Represents a physical chair (`rowLabel`, `colNumber`) linked to a category.
- **Event**: Specific instance (Movie/Concert) hosted by an Organiser at a Venue.
- **EventSeatPrice**: Maps dynamic pricing for a specific Event based on Seat Categories.
- **ShowSeatStatus**: High-contention table tracking the exact state (`AVAILABLE`, `HELD`, `BOOKED`) of every Seat for a specific Event. Tracks who holds the seat and expiration time.
- **Booking / BookingSeat**: Immutable records of finalized transactions containing payment totals and QR references.
- **Waitlist**: FIFO queue tracking users waiting for sold-out categories.

---

## 🏗️ System Architecture & Design Concepts

### ⏱️ Seat Hold TTL Mechanism
When a user selects a seat, they are granted a temporary 10-minute window to complete checkout. This prevents seats from being indefinitely blocked by abandoned sessions.
1. **Redis Caching**: A key (`seat_hold:{eventId}:{seatId}`) is immediately set in Redis with an exact 10-minute Time-to-Live (TTL). Redis handles the expiration automatically in memory.
2. **Database Mirroring**: The database `ShowSeatStatus` row is simultaneously updated to `HELD` with an expiration timestamp.
3. **Scheduled Cleanup**: A Spring `@Scheduled` job runs every 30 seconds. It sweeps the database for any `HELD` seats where the expiration timestamp has passed, reverts them to `AVAILABLE`, and fires a WebSocket event to notify all active clients that the seat is free again.

### 🔒 Concurrency Prevention
In highly sought-after events (like a major concert), hundreds of users might click the same seat at the exact same millisecond.
1. **Redis Fast-Fail**: Before hitting the database, the system checks if the hold key exists in Redis. If it does, the request is instantly rejected (low latency).
2. **Pessimistic Locking**: When modifying the seat status in the database, the application utilizes JPA's `@Lock(LockModeType.PESSIMISTIC_WRITE)`. This translates to a `SELECT ... FOR UPDATE` SQL query in PostgreSQL.
3. **Result**: The database physically locks the specific row. If two threads bypass Redis at the exact same moment, the database forces them to queue sequentially. The first thread acquires the lock and marks the seat as `HELD`. The second thread then acquires the lock, sees the state is no longer `AVAILABLE`, and safely aborts.

### 🔄 Waitlist Auto-Assignment Flow
When an event category is fully booked, customers can join a Waitlist.
1. **Queueing**: Users are added to the `Waitlist` table with an incrementing `position` number.
2. **Triggering**: If a confirmed `Booking` is cancelled, or an `OFFERED` waitlist window expires, the system finds the *first* person in line for that specific category.
3. **Time-Limited Offers**: The selected user's waitlist status updates to `OFFERED`, and an expiration timestamp (e.g., Now + 15 minutes) is set.
4. **Notification**: An email containing a secure booking link (with a dummy token) is dispatched to the user.
5. **Expiration Sweep**: A Spring `@Scheduled` job polls the database every 60 seconds. If a user fails to claim their offer within the 15-minute window, their status changes to `EXPIRED`, and the system recursively assigns the offer to the *next* person in the queue.
