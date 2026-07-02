package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "venues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(name = "total_rows")
    private int totalRows;

    @Column(name = "total_cols")
    private int totalCols;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SeatCategory> seatCategories;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats;
}
