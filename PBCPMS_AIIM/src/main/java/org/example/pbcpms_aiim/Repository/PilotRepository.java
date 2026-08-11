package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.models.Pilot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PilotRepository extends JpaRepository<Pilot, Long> {
    List<Pilot> findAllByOrderByNameAsc();
    List<Pilot> findByActiveTrueAndAvailableTrueOrderByNameAsc();
    boolean existsByLicenseNumber(String licenseNumber);
}
