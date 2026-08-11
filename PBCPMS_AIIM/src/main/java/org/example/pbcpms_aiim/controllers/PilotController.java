package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.pilot.PilotDto;
import org.example.pbcpms_aiim.dto.pilot.PilotRequest;
import org.example.pbcpms_aiim.services.PilotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pilots")
@RequiredArgsConstructor
public class PilotController {

    private final PilotService pilotService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PilotDto>> create(@Valid @RequestBody PilotRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Pilot created", pilotService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PilotDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody PilotRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Pilot updated", pilotService.update(id, request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PilotDto>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(pilotService.listAll()));
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PilotDto>>> available() {
        return ResponseEntity.ok(ApiResponse.ok(pilotService.listAvailable()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PilotDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(pilotService.getById(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        pilotService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Pilot deleted", null));
    }
}
