package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.CouponRepository;
import org.example.pbcpms_aiim.Repository.UserRepository;
import org.example.pbcpms_aiim.dto.coupon.CouponDto;
import org.example.pbcpms_aiim.dto.coupon.CouponRequest;
import org.example.pbcpms_aiim.enums.CouponStatus;
import org.example.pbcpms_aiim.enums.Role;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Coupon;
import org.example.pbcpms_aiim.models.Users;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    @Transactional
    public CouponDto issue(CouponRequest request) {
        Users owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> ApiException.notFound("Owner not found"));

        if (owner.getRole() != Role.OWNER) {
            throw ApiException.badRequest("Coupons can only be issued to owners");
        }

        if (request.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Expiry date must be in the future");
        }

        String code = (request.getCode() == null || request.getCode().isBlank())
                ? generateCode()
                : request.getCode().trim().toUpperCase();

        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw ApiException.conflict("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(code)
                .owner(owner)
                .amount(request.getAmount())
                .status(CouponStatus.ACTIVE)
                .expiresAt(request.getExpiresAt())
                .issuedAt(LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        return CouponDto.from(couponRepository.save(coupon));
    }

    public List<CouponDto> listAll() {
        return couponRepository.findAllByOrderByIssuedAtDesc().stream()
                .map(this::refreshStatus)
                .map(CouponDto::from)
                .toList();
    }

    public List<CouponDto> listForOwner(Long ownerId) {
        return couponRepository.findByOwnerIdOrderByIssuedAtDesc(ownerId).stream()
                .map(this::refreshStatus)
                .map(CouponDto::from)
                .toList();
    }

    public CouponDto getById(Long id) {
        return CouponDto.from(refreshStatus(findCoupon(id)));
    }

    public CouponDto verify(String code, Long ownerId, BigDecimal requiredAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> ApiException.notFound("Coupon not found"));

        refreshStatus(coupon);

        if (coupon.getStatus() == CouponStatus.USED) {
            throw ApiException.badRequest("Coupon has already been used");
        }
        if (coupon.getStatus() == CouponStatus.EXPIRED || coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Coupon has expired");
        }
        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw ApiException.badRequest("Coupon is not active");
        }
        if (!coupon.getOwner().getId().equals(ownerId)) {
            throw ApiException.badRequest("Coupon does not belong to this owner");
        }
        if (coupon.getAmount().compareTo(requiredAmount) < 0) {
            throw ApiException.badRequest(
                    "Coupon amount (" + coupon.getAmount() + ") is insufficient for fee (" + requiredAmount + ")"
            );
        }

        return CouponDto.from(coupon);
    }

    @Transactional
    public Coupon markUsed(Coupon coupon) {
        coupon.setStatus(CouponStatus.USED);
        coupon.setUsedAt(LocalDateTime.now());
        return couponRepository.save(coupon);
    }

    public Coupon findActiveForPayment(String code, Long ownerId, BigDecimal requiredAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> ApiException.notFound("Coupon not found"));

        refreshStatus(coupon);

        if (coupon.getStatus() == CouponStatus.USED) {
            throw ApiException.badRequest("Coupon has already been used");
        }
        if (coupon.getStatus() == CouponStatus.EXPIRED || coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Coupon has expired");
        }
        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw ApiException.badRequest("Coupon is not active");
        }
        if (!coupon.getOwner().getId().equals(ownerId)) {
            throw ApiException.badRequest("Coupon does not belong to this owner");
        }
        if (coupon.getAmount().compareTo(requiredAmount) < 0) {
            throw ApiException.badRequest(
                    "Coupon amount (" + coupon.getAmount() + ") is insufficient for fee (" + requiredAmount + ")"
            );
        }

        return coupon;
    }

    private Coupon refreshStatus(Coupon coupon) {
        if (coupon.getStatus() == CouponStatus.ACTIVE
                && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            coupon.setStatus(CouponStatus.EXPIRED);
            return couponRepository.save(coupon);
        }
        return coupon;
    }

    private Coupon findCoupon(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Coupon not found"));
    }

    private String generateCode() {
        return "CPN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
