package org.example.pbcpms_aiim.dto.pilot;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PilotRequest {
    @NotBlank(message = "Pilot name is required")
    private String name;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String phone;
    private String email;
    private String specialization;
    private Boolean available;
    private Boolean active;
}
