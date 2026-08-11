package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.BookingStatus;
import org.example.pbcpms_aiim.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByBookingStatusOrderByCreatedAtDesc(BookingStatus status);
    long countByBookingStatus(BookingStatus status);
    long countByOwnerId(Long ownerId);
}
