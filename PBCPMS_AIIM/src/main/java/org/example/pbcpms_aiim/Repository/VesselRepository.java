package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.models.Vessel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VesselRepository extends JpaRepository<Vessel, Long> {
    List<Vessel> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Vessel> findByStatusOrderByCreatedAtDesc(VesselStatus status);
    List<Vessel> findByOwnerIdAndStatus(Long ownerId, VesselStatus status);
    boolean existsByRegistrationNumber(String registrationNumber);
}
