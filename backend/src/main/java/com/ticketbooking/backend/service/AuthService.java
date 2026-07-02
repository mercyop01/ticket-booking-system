package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.AuthenticationRequest;
import com.ticketbooking.backend.dto.AuthenticationResponse;
import com.ticketbooking.backend.dto.RegisterRequest;
import com.ticketbooking.backend.model.Role;
import com.ticketbooking.backend.model.User;
import com.ticketbooking.backend.repository.UserRepository;
import com.ticketbooking.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .build();
        
        repository.save(user);
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
