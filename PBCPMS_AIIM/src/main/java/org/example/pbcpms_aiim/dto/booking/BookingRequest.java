package org.example.pbcpms_aiim.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "Vessel ID is required")
    private Long vesselId;

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotBlank(message = "Coupon code is required")
    private String couponCode;

    private String ownerNotes;
}
