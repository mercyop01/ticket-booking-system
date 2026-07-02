package com.ticketbooking.backend.dto;

import lombok.Data;

@Data
public class VenueRequest {
    private String name;
    private String city;
    private int totalRows;
    private int totalCols;
}
