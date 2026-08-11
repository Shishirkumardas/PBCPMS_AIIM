package org.example.pbcpms_aiim.dto.pilot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.pbcpms_aiim.models.Pilot;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PilotDto {
    private Long id;
    private String name;
    private String licenseNumber;
    private String phone;
    private String email;
    private String specialization;
    private boolean available;
    private boolean active;
    private LocalDateTime createdAt;

    public static PilotDto from(Pilot p) {
        return PilotDto.builder()
                .id(p.getId())
                .name(p.getName())
                .licenseNumber(p.getLicenseNumber())
                .phone(p.getPhone())
                .email(p.getEmail())
                .specialization(p.getSpecialization())
                .available(p.isAvailable())
                .active(p.isActive())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
