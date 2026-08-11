package org.example.pbcpms_aiim.dto.route;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RouteRequest {
    @NotBlank(message = "Route name is required")
    private String name;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String description;

    /** Pilot services included for this route (shown on owner route cards) */
    private String pilotServices;

    @NotNull(message = "Service fee is required")
    @DecimalMin(value = "0.01", message = "Service fee must be greater than 0")
    private BigDecimal serviceFee;

    private Boolean active;
}
