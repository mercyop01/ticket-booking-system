package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.HoldSeatRequest;
import com.ticketbooking.backend.dto.SeatStatusUpdateEvent;
import com.ticketbooking.backend.model.SeatStatus;
import com.ticketbooking.backend.model.ShowSeatStatus;
import com.ticketbooking.backend.repository.ShowSeatStatusRepository;
import com.ticketbooking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatHoldService {

    private final ShowSeatStatusRepository seatStatusRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    private static final long HOLD_DURATION_MINUTES = 10;
    private static final String REDIS_KEY_PREFIX = "seat_hold:";

    @Transactional
    public boolean holdSeat(HoldSeatRequest request) {
        String redisKey = REDIS_KEY_PREFIX + request.getEventId() + ":" + request.getSeatId();

        // 1. Check Redis first (fast fail)
        Boolean hasKey = redisTemplate.hasKey(redisKey);
        if (Boolean.TRUE.equals(hasKey)) {
            log.warn("Seat already held in Redis. Event: {}, Seat: {}", request.getEventId(), request.getSeatId());
            return false;
        }

        // 2. Fetch from DB with Pessimistic Write Lock
        ShowSeatStatus seatStatus = seatStatusRepository
                .findByEventIdAndSeatIdWithLock(request.getEventId(), request.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat status not found"));

        if (seatStatus.getStatus() != SeatStatus.AVAILABLE) {
            log.warn("Seat is not available in DB. Current status: {}", seatStatus.getStatus());
            return false;
        }

        // 3. Update DB state
        var customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        seatStatus.setStatus(SeatStatus.HELD);
        seatStatus.setHeldByCustomer(customer);
        seatStatus.setHeldUntil(LocalDateTime.now().plusMinutes(HOLD_DURATION_MINUTES));
        seatStatusRepository.save(seatStatus);

        // 4. Set Redis Key with TTL
        redisTemplate.opsForValue().set(
                redisKey,
                request.getCustomerId().toString(),
                HOLD_DURATION_MINUTES,
                TimeUnit.MINUTES
        );

        log.info("Seat {} held successfully for event {} by customer {}", request.getSeatId(), request.getEventId(), request.getCustomerId());
        
        broadcastSeatStatusChange(request.getEventId(), request.getSeatId(), SeatStatus.HELD);
        
        return true;
    }
    
    @Transactional
    public void releaseExpiredHolds() {
        var expiredHolds = seatStatusRepository.findExpiredHolds();
        for (ShowSeatStatus hold : expiredHolds) {
            log.info("Releasing expired hold for seat {} in event {}", hold.getSeat().getId(), hold.getEvent().getId());
            hold.setStatus(SeatStatus.AVAILABLE);
            hold.setHeldByCustomer(null);
            hold.setHeldUntil(null);
            seatStatusRepository.save(hold);
            
            broadcastSeatStatusChange(hold.getEvent().getId(), hold.getSeat().getId(), SeatStatus.AVAILABLE);
        }
    }
    
    private void broadcastSeatStatusChange(Long eventId, Long seatId, SeatStatus status) {
        SeatStatusUpdateEvent event = new SeatStatusUpdateEvent(eventId, seatId, status);
        messagingTemplate.convertAndSend("/topic/event/" + eventId + "/seats", event);
    }
}
