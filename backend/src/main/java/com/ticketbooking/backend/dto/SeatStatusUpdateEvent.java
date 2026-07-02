package com.ticketbooking.backend.dto;

import com.ticketbooking.backend.model.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatStatusUpdateEvent {
    private Long eventId;
    private Long seatId;
    private SeatStatus status;
}
