package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.auth.AuthResponse;
import org.example.pbcpms_aiim.dto.auth.LoginRequest;
import org.example.pbcpms_aiim.dto.auth.RegisterRequest;
import org.example.pbcpms_aiim.dto.auth.UserDto;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.example.pbcpms_aiim.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(authService.me(principal.getId())));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", Map.of("status", "ok")));
    }

    @GetMapping("/owners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> listOwners() {
        return ResponseEntity.ok(ApiResponse.ok(authService.listOwners()));
    }
}
