package com.ticketbooking.backend.service;

import com.ticketbooking.backend.model.*;
import com.ticketbooking.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowSeatStatusRepository seatStatusRepository;
    private final EventSeatPriceRepository priceRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final QrCodeService qrCodeService;
    private final EmailService emailService;
    private final WaitlistService waitlistService;

    @Transactional
    public Booking confirmBooking(Long customerId, Long eventId, List<Long> seatIds) {
        User customer = userRepository.findById(customerId).orElseThrow();
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        Booking booking = new Booking();
        booking.setCustomer(customer);
        
        Event event = null;

        for (Long seatId : seatIds) {
            String redisKey = "seat_hold:" + eventId + ":" + seatId;
            String heldBy = redisTemplate.opsForValue().get(redisKey);
            
            if (heldBy == null || !heldBy.equals(customerId.toString())) {
                throw new RuntimeException("Seat " + seatId + " is not held by you or hold expired.");
            }

            ShowSeatStatus status = seatStatusRepository.findByEventIdAndSeatIdWithLock(eventId, seatId)
                    .orElseThrow();
                    
            if (event == null) event = status.getEvent();

            EventSeatPrice price = priceRepository.findByEventIdAndCategoryId(eventId, status.getSeat().getCategory().getId())
                    .orElseThrow();

            totalAmount = totalAmount.add(price.getPrice());

            status.setStatus(SeatStatus.BOOKED);
            status.setHeldByCustomer(null);
            status.setHeldUntil(null);
            seatStatusRepository.save(status);

            // Remove Redis key
            redisTemplate.delete(redisKey);

            // Broadcast
            messagingTemplate.convertAndSend("/topic/event/" + eventId + "/seats", 
                    new com.ticketbooking.backend.dto.SeatStatusUpdateEvent(eventId, seatId, SeatStatus.BOOKED));
        }

        booking.setEvent(event);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTotalAmount(totalAmount);
        // prePersist will generate bookingRef and createdAt
        
        booking = bookingRepository.save(booking);

        // Generate QR
        String qr = qrCodeService.generateQrCodeBase64(booking.getBookingRef());
        booking.setQrCodeUrl(qr);
        bookingRepository.save(booking);

        // Send Email
        emailService.sendBookingConfirmation(
                customer.getEmail(),
                customer.getName(),
                event.getTitle(),
                booking.getBookingRef(),
                qr
        );

        return booking;
    }
    
    @Transactional
    public void cancelBooking(Long bookingId, Long customerId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        for (BookingSeat bs : booking.getBookingSeats()) {
            ShowSeatStatus status = seatStatusRepository.findByEventIdAndSeatIdWithLock(booking.getEvent().getId(), bs.getSeat().getId())
                    .orElseThrow();
            status.setStatus(SeatStatus.AVAILABLE);
            seatStatusRepository.save(status);
            
            messagingTemplate.convertAndSend("/topic/event/" + booking.getEvent().getId() + "/seats", 
                    new com.ticketbooking.backend.dto.SeatStatusUpdateEvent(booking.getEvent().getId(), bs.getSeat().getId(), SeatStatus.AVAILABLE));
                    
            // Trigger waitlist logic
            waitlistService.processWaitlistForAvailableSeat(booking.getEvent().getId(), bs.getSeat().getCategory().getId());
        }
    }
}
