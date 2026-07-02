package com.ticketbooking.backend.service;

import com.ticketbooking.backend.model.*;
import com.ticketbooking.backend.repository.WaitlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class WaitlistService {

    private final WaitlistRepository waitlistRepository;
    private final EmailService emailService;

    @Transactional
    public void processWaitlistForAvailableSeat(Long eventId, Long categoryId) {
        waitlistRepository.findFirstWaitingByEventAndCategory(eventId, categoryId).ifPresent(waitlist -> {
            waitlist.setStatus(WaitlistStatus.OFFERED);
            waitlist.setOfferExpiresAt(LocalDateTime.now().plusMinutes(15));
            waitlistRepository.save(waitlist);

            String offerLink = "https://ticketbooking.com/book/" + eventId + "?token=dummy_token_for_now";
            emailService.sendWaitlistOffer(
                    waitlist.getCustomer().getEmail(),
                    waitlist.getCustomer().getName(),
                    waitlist.getEvent().getTitle(),
                    offerLink
            );
            log.info("Waitlist offer sent to customer {} for event {}", waitlist.getCustomer().getId(), eventId);
        });
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkExpiredWaitlistOffers() {
        log.debug("Checking for expired waitlist offers...");
        var offered = waitlistRepository.findByStatus(WaitlistStatus.OFFERED);
        
        for (Waitlist w : offered) {
            if (w.getOfferExpiresAt() != null && w.getOfferExpiresAt().isBefore(LocalDateTime.now())) {
                log.info("Waitlist offer expired for customer {} on event {}", w.getCustomer().getId(), w.getEvent().getId());
                w.setStatus(WaitlistStatus.EXPIRED);
                waitlistRepository.save(w);
                
                // Process the next person in line
                processWaitlistForAvailableSeat(w.getEvent().getId(), w.getCategory().getId());
            }
        }
    }
}
