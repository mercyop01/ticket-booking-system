package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "event_seat_prices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSeatPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SeatCategory category;

    @Column(nullable = false)
    private BigDecimal price;
}
