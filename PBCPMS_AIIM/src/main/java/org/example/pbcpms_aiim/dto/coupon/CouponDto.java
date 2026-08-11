package org.example.pbcpms_aiim.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.pbcpms_aiim.models.Coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String code;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private BigDecimal amount;
    private String status;
    private LocalDateTime expiresAt;
    private LocalDateTime issuedAt;
    private LocalDateTime usedAt;
    private String notes;

    public static CouponDto from(Coupon c) {
        return CouponDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .ownerId(c.getOwner().getId())
                .ownerName(c.getOwner().getName())
                .ownerEmail(c.getOwner().getEmail())
                .amount(c.getAmount())
                .status(c.getStatus().name())
                .expiresAt(c.getExpiresAt())
                .issuedAt(c.getIssuedAt())
                .usedAt(c.getUsedAt())
                .notes(c.getNotes())
                .build();
    }
}
