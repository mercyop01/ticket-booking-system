package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.ShowSeatStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowSeatStatusRepository extends JpaRepository<ShowSeatStatus, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShowSeatStatus s WHERE s.event.id = :eventId AND s.seat.id = :seatId")
    Optional<ShowSeatStatus> findByEventIdAndSeatIdWithLock(@Param("eventId") Long eventId, @Param("seatId") Long seatId);

    List<ShowSeatStatus> findByEventId(Long eventId);
    
    @Query("SELECT s FROM ShowSeatStatus s WHERE s.status = 'HELD' AND s.heldUntil < CURRENT_TIMESTAMP")
    List<ShowSeatStatus> findExpiredHolds();
}
