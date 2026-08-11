package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.BookingStatus;
import org.example.pbcpms_aiim.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.owner
            JOIN FETCH b.vessel
            JOIN FETCH b.route
            LEFT JOIN FETCH b.coupon
            LEFT JOIN FETCH b.pilot
            WHERE b.owner.id = :ownerId
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.owner
            JOIN FETCH b.vessel
            JOIN FETCH b.route
            LEFT JOIN FETCH b.coupon
            LEFT JOIN FETCH b.pilot
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.owner
            JOIN FETCH b.vessel
            JOIN FETCH b.route
            LEFT JOIN FETCH b.coupon
            LEFT JOIN FETCH b.pilot
            WHERE b.bookingStatus = :status
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByBookingStatusOrderByCreatedAtDesc(@Param("status") BookingStatus status);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.owner
            JOIN FETCH b.vessel
            JOIN FETCH b.route
            LEFT JOIN FETCH b.coupon
            LEFT JOIN FETCH b.pilot
            WHERE b.id = :id
            """)
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    long countByBookingStatus(BookingStatus status);

    long countByOwnerId(Long ownerId);
}
