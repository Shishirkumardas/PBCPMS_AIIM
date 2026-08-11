package org.example.pbcpms_aiim.controllers;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.dashboard.DashboardStatsDto;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.example.pbcpms_aiim.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> admin() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.adminStats()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> owner(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.ownerStats(principal.getId())));
    }
}
