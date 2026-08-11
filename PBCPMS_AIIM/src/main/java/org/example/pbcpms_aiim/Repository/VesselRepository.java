package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.models.Vessel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VesselRepository extends JpaRepository<Vessel, Long> {

    @Query("SELECT v FROM Vessel v JOIN FETCH v.owner WHERE v.owner.id = :ownerId ORDER BY v.createdAt DESC")
    List<Vessel> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);

    @Query("SELECT v FROM Vessel v JOIN FETCH v.owner WHERE v.status = :status ORDER BY v.createdAt DESC")
    List<Vessel> findByStatusOrderByCreatedAtDesc(@Param("status") VesselStatus status);

    @Query("SELECT v FROM Vessel v JOIN FETCH v.owner WHERE v.owner.id = :ownerId AND v.status = :status")
    List<Vessel> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") VesselStatus status);

    @Query("SELECT v FROM Vessel v JOIN FETCH v.owner ORDER BY v.createdAt DESC")
    List<Vessel> findAllWithOwner();

    @Query("SELECT v FROM Vessel v JOIN FETCH v.owner WHERE v.id = :id")
    Optional<Vessel> findByIdWithOwner(@Param("id") Long id);

    boolean existsByRegistrationNumber(String registrationNumber);
}
