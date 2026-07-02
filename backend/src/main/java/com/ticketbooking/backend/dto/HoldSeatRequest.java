package com.ticketbooking.backend.dto;

import lombok.Data;

@Data
public class HoldSeatRequest {
    private Long eventId;
    private Long seatId;
    private Long customerId;
}
