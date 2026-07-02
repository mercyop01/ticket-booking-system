package com.ticketbooking.backend.dto;

import lombok.Builder;
import lombok.Data;
import com.ticketbooking.backend.model.Role;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
