package org.example.pbcpms_aiim.dto.vessel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VesselRequest {
    @NotBlank(message = "Vessel name is required")
    private String name;

    @NotBlank(message = "Vessel type is required")
    private String type;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    private String description;
}
