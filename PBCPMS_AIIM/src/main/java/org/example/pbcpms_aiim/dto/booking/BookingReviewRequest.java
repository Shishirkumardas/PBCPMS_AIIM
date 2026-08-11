package org.example.pbcpms_aiim.dto.booking;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.pbcpms_aiim.enums.BookingStatus;

@Data
public class BookingReviewRequest {
    @NotNull(message = "Status is required")
    private BookingStatus status;

    private Long pilotId;
    private String rejectionReason;
    private String adminNotes;
}
