package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.SeatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatCategoryRepository extends JpaRepository<SeatCategory, Long> {
    List<SeatCategory> findByVenueId(Long venueId);
}
