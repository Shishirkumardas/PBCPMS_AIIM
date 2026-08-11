package org.example.pbcpms_aiim.dto.vessel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.pbcpms_aiim.models.Vessel;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VesselDto {
    private Long id;
    private String name;
    private String type;
    private String registrationNumber;
    private String description;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;

    public static VesselDto from(Vessel v) {
        return VesselDto.builder()
                .id(v.getId())
                .name(v.getName())
                .type(v.getType())
                .registrationNumber(v.getRegistrationNumber())
                .description(v.getDescription())
                .ownerId(v.getOwner().getId())
                .ownerName(v.getOwner().getName())
                .ownerEmail(v.getOwner().getEmail())
                .status(v.getStatus().name())
                .rejectionReason(v.getRejectionReason())
                .createdAt(v.getCreatedAt())
                .reviewedAt(v.getReviewedAt())
                .build();
    }
}
