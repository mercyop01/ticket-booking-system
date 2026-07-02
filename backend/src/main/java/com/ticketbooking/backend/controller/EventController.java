package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.OrganiserEventResponse;
import com.ticketbooking.backend.model.User;
import com.ticketbooking.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping("/organiser")
    @PreAuthorize("hasRole('ORGANISER')")
    public ResponseEntity<List<OrganiserEventResponse>> getOrganiserEvents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.getOrganiserEvents(user.getId()));
    }
}
