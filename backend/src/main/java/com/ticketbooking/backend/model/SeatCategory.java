package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat_categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private String name; // PREMIUM, GOLD, STANDARD

    @Column(name = "color_code")
    private String colorCode;
}
