package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.RouteRepository;
import org.example.pbcpms_aiim.dto.route.RouteDto;
import org.example.pbcpms_aiim.dto.route.RouteRequest;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Route;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;

    @Transactional
    public RouteDto create(RouteRequest request) {
        Route route = Route.builder()
                .name(request.getName().trim())
                .origin(request.getOrigin().trim())
                .destination(request.getDestination().trim())
                .description(request.getDescription())
                .serviceFee(request.getServiceFee())
                .active(request.getActive() == null || request.getActive())
                .createdAt(LocalDateTime.now())
                .build();
        return RouteDto.from(routeRepository.save(route));
    }

    @Transactional
    public RouteDto update(Long id, RouteRequest request) {
        Route route = findRoute(id);
        route.setName(request.getName().trim());
        route.setOrigin(request.getOrigin().trim());
        route.setDestination(request.getDestination().trim());
        route.setDescription(request.getDescription());
        route.setServiceFee(request.getServiceFee());
        if (request.getActive() != null) {
            route.setActive(request.getActive());
        }
        return RouteDto.from(routeRepository.save(route));
    }

    public List<RouteDto> listAll() {
        return routeRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(RouteDto::from)
                .toList();
    }

    public List<RouteDto> listActive() {
        return routeRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(RouteDto::from)
                .toList();
    }

    public RouteDto getById(Long id) {
        return RouteDto.from(findRoute(id));
    }

    @Transactional
    public RouteDto toggleActive(Long id) {
        Route route = findRoute(id);
        route.setActive(!route.isActive());
        return RouteDto.from(routeRepository.save(route));
    }

    @Transactional
    public void delete(Long id) {
        if (!routeRepository.existsById(id)) {
            throw ApiException.notFound("Route not found");
        }
        routeRepository.deleteById(id);
    }

    private Route findRoute(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Route not found"));
    }
}
