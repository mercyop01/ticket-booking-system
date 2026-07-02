package com.ticketbooking.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "booking_ref", nullable = false, unique = true)
    private String bookingRef;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingSeat> bookingSeats;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.bookingRef == null) {
            this.bookingRef = UUID.randomUUID().toString();
        }
    }
}
