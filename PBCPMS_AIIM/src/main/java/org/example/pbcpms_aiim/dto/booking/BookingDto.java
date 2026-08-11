package org.example.pbcpms_aiim.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.pbcpms_aiim.models.Booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private Long vesselId;
    private String vesselName;
    private String vesselRegistration;
    private Long routeId;
    private String routeName;
    private String routeOrigin;
    private String routeDestination;
    private Long couponId;
    private String couponCode;
    private Long pilotId;
    private String pilotName;
    private String pilotLicense;
    private BigDecimal serviceFee;
    private String paymentStatus;
    private String bookingStatus;
    private String ownerNotes;
    private String adminNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime assignedAt;

    public static BookingDto from(Booking b) {
        BookingDtoBuilder builder = BookingDto.builder()
                .id(b.getId())
                .ownerId(b.getOwner().getId())
                .ownerName(b.getOwner().getName())
                .ownerEmail(b.getOwner().getEmail())
                .vesselId(b.getVessel().getId())
                .vesselName(b.getVessel().getName())
                .vesselRegistration(b.getVessel().getRegistrationNumber())
                .routeId(b.getRoute().getId())
                .routeName(b.getRoute().getName())
                .routeOrigin(b.getRoute().getOrigin())
                .routeDestination(b.getRoute().getDestination())
                .serviceFee(b.getServiceFee())
                .paymentStatus(b.getPaymentStatus().name())
                .bookingStatus(b.getBookingStatus().name())
                .ownerNotes(b.getOwnerNotes())
                .adminNotes(b.getAdminNotes())
                .rejectionReason(b.getRejectionReason())
                .createdAt(b.getCreatedAt())
                .paidAt(b.getPaidAt())
                .reviewedAt(b.getReviewedAt())
                .assignedAt(b.getAssignedAt());

        if (b.getCoupon() != null) {
            builder.couponId(b.getCoupon().getId()).couponCode(b.getCoupon().getCode());
        }
        if (b.getPilot() != null) {
            builder.pilotId(b.getPilot().getId())
                    .pilotName(b.getPilot().getName())
                    .pilotLicense(b.getPilot().getLicenseNumber());
        }
        return builder.build();
    }
}
