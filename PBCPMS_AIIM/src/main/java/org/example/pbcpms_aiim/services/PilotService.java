package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.PilotRepository;
import org.example.pbcpms_aiim.dto.pilot.PilotDto;
import org.example.pbcpms_aiim.dto.pilot.PilotRequest;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Pilot;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PilotService {

    private final PilotRepository pilotRepository;

    @Transactional
    public PilotDto create(PilotRequest request) {
        if (pilotRepository.existsByLicenseNumber(request.getLicenseNumber().trim())) {
            throw ApiException.conflict("License number already exists");
        }

        Pilot pilot = Pilot.builder()
                .name(request.getName().trim())
                .licenseNumber(request.getLicenseNumber().trim())
                .phone(request.getPhone())
                .email(request.getEmail())
                .specialization(request.getSpecialization())
                .available(request.getAvailable() == null || request.getAvailable())
                .active(request.getActive() == null || request.getActive())
                .createdAt(LocalDateTime.now())
                .build();

        return PilotDto.from(pilotRepository.save(pilot));
    }

    @Transactional
    public PilotDto update(Long id, PilotRequest request) {
        Pilot pilot = findPilot(id);

        if (!pilot.getLicenseNumber().equalsIgnoreCase(request.getLicenseNumber().trim())
                && pilotRepository.existsByLicenseNumber(request.getLicenseNumber().trim())) {
            throw ApiException.conflict("License number already exists");
        }

        pilot.setName(request.getName().trim());
        pilot.setLicenseNumber(request.getLicenseNumber().trim());
        pilot.setPhone(request.getPhone());
        pilot.setEmail(request.getEmail());
        pilot.setSpecialization(request.getSpecialization());
        if (request.getAvailable() != null) {
            pilot.setAvailable(request.getAvailable());
        }
        if (request.getActive() != null) {
            pilot.setActive(request.getActive());
        }

        return PilotDto.from(pilotRepository.save(pilot));
    }

    public List<PilotDto> listAll() {
        return pilotRepository.findAllByOrderByNameAsc().stream()
                .map(PilotDto::from)
                .toList();
    }

    public List<PilotDto> listAvailable() {
        return pilotRepository.findByActiveTrueAndAvailableTrueOrderByNameAsc().stream()
                .map(PilotDto::from)
                .toList();
    }

    public PilotDto getById(Long id) {
        return PilotDto.from(findPilot(id));
    }

    @Transactional
    public void delete(Long id) {
        if (!pilotRepository.existsById(id)) {
            throw ApiException.notFound("Pilot not found");
        }
        pilotRepository.deleteById(id);
    }

    private Pilot findPilot(Long id) {
        return pilotRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Pilot not found"));
    }
}
