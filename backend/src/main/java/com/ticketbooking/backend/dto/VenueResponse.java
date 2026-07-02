package com.ticketbooking.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VenueResponse {
    private Long id;
    private String name;
    private String city;
    private int totalRows;
    private int totalCols;
}
