package com.ticketbooking.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeatHoldCleanupScheduler {

    private final SeatHoldService seatHoldService;

    // Run every 30 seconds
    @Scheduled(fixedRate = 30000)
    public void cleanupExpiredHolds() {
        log.debug("Running expired seat holds cleanup job...");
        try {
            seatHoldService.releaseExpiredHolds();
        } catch (Exception e) {
            log.error("Error during seat hold cleanup", e);
        }
    }
}
