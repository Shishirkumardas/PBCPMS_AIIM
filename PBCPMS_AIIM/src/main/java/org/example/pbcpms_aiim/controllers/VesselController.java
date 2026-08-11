package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.vessel.VesselDto;
import org.example.pbcpms_aiim.dto.vessel.VesselRequest;
import org.example.pbcpms_aiim.dto.vessel.VesselReviewRequest;
import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.example.pbcpms_aiim.services.VesselService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vessels")
@RequiredArgsConstructor
public class VesselController {

    private final VesselService vesselService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<VesselDto>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VesselRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Vessel submitted for approval",
                        vesselService.create(principal.getId(), request)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<VesselDto>>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(vesselService.listForOwner(principal.getId())));
    }

    @GetMapping("/mine/approved")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<VesselDto>>> mineApproved(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(vesselService.listApprovedForOwner(principal.getId())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VesselDto>>> all(
            @RequestParam(required = false) VesselStatus status) {
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.ok(vesselService.listByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.ok(vesselService.listAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VesselDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(vesselService.getById(id)));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VesselDto>> review(
            @PathVariable Long id,
            @Valid @RequestBody VesselReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Vessel reviewed", vesselService.review(id, request)));
    }
}
