package org.example.pbcpms_aiim.dto.coupon;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponRequest {
    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String code;

    @NotNull(message = "Expiry date is required")
    private LocalDateTime expiresAt;

    private String notes;
}
