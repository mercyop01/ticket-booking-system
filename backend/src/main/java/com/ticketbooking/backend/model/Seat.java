package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "row_label", nullable = false)
    private String rowLabel;

    @Column(name = "col_number", nullable = false)
    private int colNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private SeatCategory category;
}
