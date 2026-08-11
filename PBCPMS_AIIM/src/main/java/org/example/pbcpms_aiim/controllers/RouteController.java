package org.example.pbcpms_aiim.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.dto.ApiResponse;
import org.example.pbcpms_aiim.dto.route.RouteDto;
import org.example.pbcpms_aiim.dto.route.RouteRequest;
import org.example.pbcpms_aiim.services.RouteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteDto>> create(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Route created", routeService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Route updated", routeService.update(id, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteDto>>> list(
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(ApiResponse.ok(routeService.listActive()));
        }
        return ResponseEntity.ok(ApiResponse.ok(routeService.listAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RouteDto>>> active() {
        return ResponseEntity.ok(ApiResponse.ok(routeService.listActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(routeService.getById(id)));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteDto>> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Route status updated", routeService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        routeService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted", null));
    }
}
