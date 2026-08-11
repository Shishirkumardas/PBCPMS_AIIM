package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.CouponStatus;
import org.example.pbcpms_aiim.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c JOIN FETCH c.owner WHERE LOWER(c.code) = LOWER(:code)")
    Optional<Coupon> findByCodeIgnoreCase(@Param("code") String code);

    @Query("SELECT c FROM Coupon c JOIN FETCH c.owner WHERE c.owner.id = :ownerId ORDER BY c.issuedAt DESC")
    List<Coupon> findByOwnerIdOrderByIssuedAtDesc(@Param("ownerId") Long ownerId);

    @Query("SELECT c FROM Coupon c JOIN FETCH c.owner ORDER BY c.issuedAt DESC")
    List<Coupon> findAllByOrderByIssuedAtDesc();

    @Query("SELECT c FROM Coupon c JOIN FETCH c.owner WHERE c.owner.id = :ownerId AND c.status = :status")
    List<Coupon> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") CouponStatus status);

    @Query("SELECT c FROM Coupon c JOIN FETCH c.owner WHERE c.id = :id")
    Optional<Coupon> findByIdWithOwner(@Param("id") Long id);

    boolean existsByCodeIgnoreCase(String code);
}
