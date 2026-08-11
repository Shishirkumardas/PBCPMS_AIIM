package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.CouponStatus;
import org.example.pbcpms_aiim.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    List<Coupon> findByOwnerIdOrderByIssuedAtDesc(Long ownerId);
    List<Coupon> findAllByOrderByIssuedAtDesc();
    List<Coupon> findByOwnerIdAndStatus(Long ownerId, CouponStatus status);
    boolean existsByCodeIgnoreCase(String code);
}
