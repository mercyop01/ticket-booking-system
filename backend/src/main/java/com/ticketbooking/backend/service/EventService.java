package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.OrganiserEventResponse;
import com.ticketbooking.backend.model.Event;
import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public List<OrganiserEventResponse> getOrganiserEvents(Long organiserId) {
        List<Event> events = eventRepository.findByOrganiserId(organiserId);
        
        return events.stream().map(event -> {
            Long totalBookings = bookingRepository.countConfirmedBookingsByEventId(event.getId());
            BigDecimal totalRevenue = bookingRepository.sumRevenueByEventId(event.getId());

            return OrganiserEventResponse.builder()
                    .id(event.getId())
                    .title(event.getTitle())
                    .dateTime(event.getDateTime())
                    .status(event.getStatus())
                    .totalBookings(totalBookings)
                    .totalRevenue(totalRevenue)
                    .build();
        }).collect(Collectors.toList());
    }
}
