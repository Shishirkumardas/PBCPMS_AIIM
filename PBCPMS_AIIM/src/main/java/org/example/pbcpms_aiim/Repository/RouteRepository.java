package org.example.pbcpms_aiim.Repository;

import org.example.pbcpms_aiim.models.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByActiveTrueOrderByNameAsc();
    List<Route> findAllByOrderByCreatedAtDesc();
}
