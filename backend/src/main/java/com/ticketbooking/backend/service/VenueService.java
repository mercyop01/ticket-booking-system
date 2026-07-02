package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.VenueRequest;
import com.ticketbooking.backend.dto.VenueResponse;
import com.ticketbooking.backend.model.Venue;
import com.ticketbooking.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueService {
    private final VenueRepository venueRepository;

    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = Venue.builder()
                .name(request.getName())
                .city(request.getCity())
                .totalRows(request.getTotalRows())
                .totalCols(request.getTotalCols())
                .build();
        Venue savedVenue = venueRepository.save(venue);
        return mapToResponse(savedVenue);
    }

    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private VenueResponse mapToResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .city(venue.getCity())
                .totalRows(venue.getTotalRows())
                .totalCols(venue.getTotalCols())
                .build();
    }
}
