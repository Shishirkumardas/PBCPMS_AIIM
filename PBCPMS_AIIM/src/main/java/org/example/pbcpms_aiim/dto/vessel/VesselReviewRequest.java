package org.example.pbcpms_aiim.dto.vessel;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.pbcpms_aiim.enums.VesselStatus;

@Data
public class VesselReviewRequest {
    @NotNull(message = "Status is required")
    private VesselStatus status;

    private String rejectionReason;
}
