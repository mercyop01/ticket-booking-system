package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByVenueId(Long venueId);
}
