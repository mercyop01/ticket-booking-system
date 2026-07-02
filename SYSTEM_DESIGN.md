# System Design Document: Ticket Booking System

This document outlines the core architectural and concurrency patterns implemented in the Ticket Booking System to handle high-traffic, real-time ticket sales for movies and concerts. The system is designed to handle thousands of concurrent users attempting to book the same limited resource (seats) simultaneously.

## 1. Seat Hold TTL Mechanism
The seat hold mechanism is a critical component designed to prevent seats from being indefinitely locked by abandoned user sessions. When a user selects a seat to purchase, they are granted a temporary "hold" window to complete their payment. If the payment is not completed within this window, the seat is released back to the general pool.

### Implementation Details
The system utilizes a dual-layer approach for managing Time-to-Live (TTL) on seat holds:
1. **Redis Caching for Ephemeral State:** When a user initiates a hold via the `/api/v1/bookings/hold` endpoint, the system immediately records the hold in Redis. A key formatted as `seat_hold:{eventId}:{seatId}` is created with an exact 10-minute Time-to-Live. Redis inherently manages this memory and will automatically evict the key when the 10-minute window expires. This allows for extremely fast, low-latency checks before hitting the persistent database.
2. **Database Mirroring for Persistent State:** Simultaneously, the persistent PostgreSQL database is updated. The corresponding row in the `ShowSeatStatus` table is updated to a status of `HELD`, and an explicit `held_until` timestamp is written (current time + 10 minutes), along with the `held_by_customer_id`.
3. **Scheduled Cleanup (Sweep):** Because the database does not automatically revert rows when a timestamp passes, the Spring Boot backend employs a scheduled cleanup task. Annotated with `@Scheduled(fixedDelay = 30000)`, a background worker sweeps the `ShowSeatStatus` table every 30 seconds. It identifies any rows where `status = 'HELD'` and `held_until < CURRENT_TIMESTAMP`. It resets these rows to `AVAILABLE`, clears the `held_by` fields, and fires a WebSocket `SeatStatusUpdateEvent` to all connected clients, instantly updating the interactive UI without requiring a page refresh.

## 2. Concurrency Prevention
In popular events, such as a major artist's concert tour, hundreds of users may attempt to click and reserve the exact same seat at the exact same millisecond. Failing to handle this correctly results in "double booking" (selling the same seat twice).

### Implementation Details
The application employs pessimistic locking at the database level to ensure absolute data integrity during the booking phase.
1. **Redis Fast-Fail Filter:** As the first line of defense, incoming hold requests check Redis. If the `seat_hold:{eventId}:{seatId}` key already exists, the application immediately rejects the request with a 409 Conflict. This prevents unnecessary load on the PostgreSQL database.
2. **Pessimistic Write Locking:** If the Redis check passes (or in the event of a race condition where two threads bypass the Redis check simultaneously), the application relies on JPA's `@Lock(LockModeType.PESSIMISTIC_WRITE)`. When the `ShowSeatStatusRepository` queries the seat to update its status, Hibernate translates this into a `SELECT ... FOR UPDATE` SQL statement.
3. **Queueing at the Row Level:** The `FOR UPDATE` clause physically locks the specific row in the PostgreSQL database. If Thread A and Thread B request the same seat at the exact same time, the database forces them to execute sequentially. Thread A acquires the lock, verifies the seat is still `AVAILABLE`, changes it to `HELD`, and commits the transaction (releasing the lock). Thread B then acquires the lock, reads the newly updated row, sees that the status is now `HELD`, and safely aborts with a concurrency exception. This guarantees zero double-bookings.

## 3. Waitlist Auto-Assignment Flow
When a specific category for an event (e.g., "Premium Tickets") is entirely sold out or currently held, users are presented with the option to join a Waitlist rather than repeatedly refreshing the page.

### Implementation Details
The Waitlist functions as a strict First-In-First-Out (FIFO) queue managed by the database.
1. **Queue Management:** When a user joins the waitlist via `/api/v1/waitlist/join`, a new record is inserted into the `Waitlist` table. The user is assigned an auto-incrementing `position` number tied to that specific `event_id` and `category_id`.
2. **Triggering Re-assignment:** Seats become available in two scenarios: either a user's 10-minute hold expires (abandoned cart), or a confirmed booking is explicitly cancelled via `/api/v1/bookings/{id}`. In either scenario, before the seat is fully returned to the public `AVAILABLE` pool, the system checks the `Waitlist` table.
3. **Queue Extraction:** The system queries for the user with the lowest `position` number for that category whose status is `WAITING`. 

## 4. Time-Limited Offer Handling
Once a seat becomes available and a waitlisted user is identified, the system must offer them the ticket but ensure the process does not stall if the user is unresponsive.

### Implementation Details
1. **Offer Generation:** The selected waitlist user's status is updated from `WAITING` to `OFFERED`. The system generates a secure, single-use JSON Web Token (JWT) containing the `waitlistId`, `userId`, and `seatIds`.
2. **15-Minute Expiration Window:** This JWT is configured with a strict 15-minute expiration (`exp` claim). Simultaneously, an `offer_expires_at` timestamp is written to the user's `Waitlist` row in the database.
3. **Notification:** The backend triggers an asynchronous email (via JavaMailSender stub) containing a direct checkout link embedded with the JWT.
4. **Offer Expiration Sweep:** Similar to the seat hold cleanup, a secondary `@Scheduled` task runs every 60 seconds. It sweeps the `Waitlist` table for rows where `status = 'OFFERED'` and `offer_expires_at < CURRENT_TIMESTAMP`.
5. **Re-assignment:** If an expired offer is found, the user's status is changed to `EXPIRED`. The system then recursively triggers the Auto-Assignment flow again, finding the *next* person in the FIFO queue (the user with the next lowest `position`) and issuing them a new 15-minute offer. This ensures that valuable tickets are continuously offered to interested buyers until the event is fully booked.
