package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "show_seat_status", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "seat_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowSeatStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "held_by_customer_id")
    private User heldByCustomer;

    @Column(name = "held_until")
    private LocalDateTime heldUntil;
}
