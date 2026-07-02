package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Waitlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SeatCategory category;

    @Column(nullable = false)
    private Integer position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WaitlistStatus status;

    @Column(name = "offer_expires_at")
    private LocalDateTime offerExpiresAt;
}
