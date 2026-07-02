package com.ticketbooking.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrganiserEventResponse {
    private Long id;
    private String title;
    private LocalDateTime dateTime;
    private String status;
    private Long totalBookings;
    private BigDecimal totalRevenue;
}
