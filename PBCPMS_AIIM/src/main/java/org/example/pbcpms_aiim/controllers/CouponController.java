package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.coupon.CouponDto;
import org.example.pbcpms_aiim.dto.coupon.CouponRequest;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.example.pbcpms_aiim.services.CouponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponDto>> issue(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Coupon issued", couponService.issue(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CouponDto>>> all() {
        return ResponseEntity.ok(ApiResponse.ok(couponService.listAll()));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<CouponDto>>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.listForOwner(principal.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.getById(id)));
    }

    @GetMapping("/verify")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<CouponDto>> verify(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String code,
            @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(ApiResponse.ok("Coupon is valid",
                couponService.verify(code, principal.getId(), amount)));
    }
}
