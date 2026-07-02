package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.Waitlist;
import com.ticketbooking.backend.model.WaitlistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {

    @Query("SELECT w FROM Waitlist w WHERE w.event.id = :eventId AND w.category.id = :categoryId AND w.status = 'WAITING' ORDER BY w.position ASC LIMIT 1")
    Optional<Waitlist> findFirstWaitingByEventAndCategory(@Param("eventId") Long eventId, @Param("categoryId") Long categoryId);
    
    List<Waitlist> findByStatus(WaitlistStatus status);
}
