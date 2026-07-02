package com.ticketbooking.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendBookingConfirmation(String to, String customerName, String eventTitle, String bookingRef, String qrCodeUrl) {
        log.info("==========================================================");
        log.info("EMAIL SENT TO: {}", to);
        log.info("SUBJECT: Booking Confirmation - {}", eventTitle);
        log.info("BODY:");
        log.info("Hi {}, your booking for {} is confirmed!", customerName, eventTitle);
        log.info("Booking Reference: {}", bookingRef);
        log.info("QR Code: [Attached - {}]", qrCodeUrl);
        log.info("==========================================================");
    }
    
    public void sendWaitlistOffer(String to, String customerName, String eventTitle, String offerLink) {
        log.info("==========================================================");
        log.info("EMAIL SENT TO: {}", to);
        log.info("SUBJECT: Tickets Available - {}", eventTitle);
        log.info("BODY:");
        log.info("Hi {}, good news! Tickets are now available for your waitlisted event {}.", customerName, eventTitle);
        log.info("Click the link to book within 15 minutes: {}", offerLink);
        log.info("==========================================================");
    }
}
