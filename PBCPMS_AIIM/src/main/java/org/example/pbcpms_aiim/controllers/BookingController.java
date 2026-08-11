package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.booking.BookingDto;
import org.example.pbcpms_aiim.dto.booking.BookingRequest;
import org.example.pbcpms_aiim.dto.booking.BookingReviewRequest;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.example.pbcpms_aiim.services.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<BookingDto>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking created and payment marked PAID",
                        bookingService.create(principal.getId(), request)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.listForOwner(principal.getId())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> all() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.listAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> get(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.getById(id, principal.getId(), isAdmin)));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> review(
            @PathVariable Long id,
            @Valid @RequestBody BookingReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Booking updated",
                bookingService.review(id, request)));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> assign(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long pilotId = body.get("pilotId");
        if (pilotId == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("pilotId is required"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Pilot assigned",
                bookingService.assignPilot(id, pilotId)));
    }
}
