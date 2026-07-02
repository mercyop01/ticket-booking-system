package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.EventSeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventSeatPriceRepository extends JpaRepository<EventSeatPrice, Long> {
    Optional<EventSeatPrice> findByEventIdAndCategoryId(Long eventId, Long categoryId);
}
