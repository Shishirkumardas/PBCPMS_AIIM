package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.UserRepository;
import org.example.pbcpms_aiim.Repository.VesselRepository;
import org.example.pbcpms_aiim.dto.vessel.VesselDto;
import org.example.pbcpms_aiim.dto.vessel.VesselRequest;
import org.example.pbcpms_aiim.dto.vessel.VesselReviewRequest;
import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Users;
import org.example.pbcpms_aiim.models.Vessel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VesselService {

    private final VesselRepository vesselRepository;
    private final UserRepository userRepository;

    @Transactional
    public VesselDto create(Long ownerId, VesselRequest request) {
        if (vesselRepository.existsByRegistrationNumber(request.getRegistrationNumber().trim())) {
            throw ApiException.conflict("Registration number already exists");
        }

        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() -> ApiException.notFound("Owner not found"));

        Vessel vessel = Vessel.builder()
                .name(request.getName().trim())
                .type(request.getType().trim())
                .registrationNumber(request.getRegistrationNumber().trim())
                .description(request.getDescription())
                .owner(owner)
                .status(VesselStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return VesselDto.from(vesselRepository.save(vessel));
    }

    public List<VesselDto> listForOwner(Long ownerId) {
        return vesselRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(VesselDto::from)
                .toList();
    }

    public List<VesselDto> listApprovedForOwner(Long ownerId) {
        return vesselRepository.findByOwnerIdAndStatus(ownerId, VesselStatus.APPROVED).stream()
                .map(VesselDto::from)
                .toList();
    }

    public List<VesselDto> listAll() {
        return vesselRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(VesselDto::from)
                .toList();
    }

    public List<VesselDto> listByStatus(VesselStatus status) {
        return vesselRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(VesselDto::from)
                .toList();
    }

    public VesselDto getById(Long id) {
        return VesselDto.from(findVessel(id));
    }

    @Transactional
    public VesselDto review(Long id, VesselReviewRequest request) {
        Vessel vessel = findVessel(id);

        if (vessel.getStatus() != VesselStatus.PENDING) {
            throw ApiException.badRequest("Only pending vessels can be reviewed");
        }

        if (request.getStatus() != VesselStatus.APPROVED && request.getStatus() != VesselStatus.REJECTED) {
            throw ApiException.badRequest("Review status must be APPROVED or REJECTED");
        }

        if (request.getStatus() == VesselStatus.REJECTED
                && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw ApiException.badRequest("Rejection reason is required");
        }

        vessel.setStatus(request.getStatus());
        vessel.setRejectionReason(
                request.getStatus() == VesselStatus.REJECTED ? request.getRejectionReason() : null
        );
        vessel.setReviewedAt(LocalDateTime.now());

        return VesselDto.from(vesselRepository.save(vessel));
    }

    private Vessel findVessel(Long id) {
        return vesselRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Vessel not found"));
    }
}
