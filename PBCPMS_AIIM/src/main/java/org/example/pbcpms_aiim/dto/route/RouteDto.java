package org.example.pbcpms_aiim.dto.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.pbcpms_aiim.models.Route;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDto {
    private Long id;
    private String name;
    private String origin;
    private String destination;
    private String description;
    private BigDecimal serviceFee;
    private boolean active;
    private LocalDateTime createdAt;

    public static RouteDto from(Route r) {
        return RouteDto.builder()
                .id(r.getId())
                .name(r.getName())
                .origin(r.getOrigin())
                .destination(r.getDestination())
                .description(r.getDescription())
                .serviceFee(r.getServiceFee())
                .active(r.isActive())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
