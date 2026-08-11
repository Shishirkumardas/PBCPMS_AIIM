package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.BookingRepository;
import org.example.pbcpms_aiim.Repository.PilotRepository;
import org.example.pbcpms_aiim.Repository.RouteRepository;
import org.example.pbcpms_aiim.Repository.UserRepository;
import org.example.pbcpms_aiim.Repository.VesselRepository;
import org.example.pbcpms_aiim.dto.booking.BookingDto;
import org.example.pbcpms_aiim.dto.booking.BookingRequest;
import org.example.pbcpms_aiim.dto.booking.BookingReviewRequest;
import org.example.pbcpms_aiim.enums.BookingStatus;
import org.example.pbcpms_aiim.enums.PaymentStatus;
import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Booking;
import org.example.pbcpms_aiim.models.Coupon;
import org.example.pbcpms_aiim.models.Pilot;
import org.example.pbcpms_aiim.models.Route;
import org.example.pbcpms_aiim.models.Users;
import org.example.pbcpms_aiim.models.Vessel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VesselRepository vesselRepository;
    private final RouteRepository routeRepository;
    private final PilotRepository pilotRepository;
    private final CouponService couponService;

    @Transactional
    public BookingDto create(Long ownerId, BookingRequest request) {
        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() -> ApiException.notFound("Owner not found"));

        Vessel vessel = vesselRepository.findById(request.getVesselId())
                .orElseThrow(() -> ApiException.notFound("Vessel not found"));

        if (!vessel.getOwner().getId().equals(ownerId)) {
            throw ApiException.forbidden("Vessel does not belong to you");
        }
        if (vessel.getStatus() != VesselStatus.APPROVED) {
            throw ApiException.badRequest("Vessel must be approved before booking");
        }

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> ApiException.notFound("Route not found"));

        if (!route.isActive()) {
            throw ApiException.badRequest("Selected route is not active");
        }

        Coupon coupon = couponService.findActiveForPayment(
                request.getCouponCode(),
                ownerId,
                route.getServiceFee()
        );

        // Mark coupon used and payment paid
        couponService.markUsed(coupon);

        Booking booking = Booking.builder()
                .owner(owner)
                .vessel(vessel)
                .route(route)
                .coupon(coupon)
                .serviceFee(route.getServiceFee())
                .paymentStatus(PaymentStatus.PAID)
                .bookingStatus(BookingStatus.PENDING)
                .ownerNotes(request.getOwnerNotes())
                .createdAt(LocalDateTime.now())
                .paidAt(LocalDateTime.now())
                .build();

        return BookingDto.from(bookingRepository.save(booking));
    }

    public List<BookingDto> listForOwner(Long ownerId) {
        return bookingRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(BookingDto::from)
                .toList();
    }

    public List<BookingDto> listAll() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingDto::from)
                .toList();
    }

    public BookingDto getById(Long id, Long requesterId, boolean isAdmin) {
        Booking booking = findBooking(id);
        if (!isAdmin && !booking.getOwner().getId().equals(requesterId)) {
            throw ApiException.forbidden("You cannot view this booking");
        }
        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto review(Long id, BookingReviewRequest request) {
        Booking booking = findBooking(id);

        if (booking.getPaymentStatus() != PaymentStatus.PAID) {
            throw ApiException.badRequest("Only paid bookings can be reviewed");
        }

        BookingStatus current = booking.getBookingStatus();
        if (current == BookingStatus.REJECTED
                || current == BookingStatus.CANCELLED
                || current == BookingStatus.COMPLETED) {
            throw ApiException.badRequest("Booking cannot be reviewed in current status: " + current);
        }

        if (request.getStatus() == BookingStatus.REJECTED) {
            if (current != BookingStatus.PENDING && current != BookingStatus.APPROVED) {
                throw ApiException.badRequest("Only pending/approved bookings can be rejected");
            }
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw ApiException.badRequest("Rejection reason is required");
            }
            booking.setBookingStatus(BookingStatus.REJECTED);
            booking.setRejectionReason(request.getRejectionReason());
            booking.setReviewedAt(LocalDateTime.now());
            if (request.getAdminNotes() != null) {
                booking.setAdminNotes(request.getAdminNotes());
            }
            return BookingDto.from(bookingRepository.save(booking));
        }

        if (request.getStatus() == BookingStatus.APPROVED) {
            if (current != BookingStatus.PENDING) {
                throw ApiException.badRequest("Only pending bookings can be approved");
            }
            booking.setBookingStatus(BookingStatus.APPROVED);
            booking.setReviewedAt(LocalDateTime.now());
            if (request.getAdminNotes() != null) {
                booking.setAdminNotes(request.getAdminNotes());
            }

            // Optionally assign pilot in same step
            if (request.getPilotId() != null) {
                assignPilotInternal(booking, request.getPilotId());
            }

            return BookingDto.from(bookingRepository.save(booking));
        }

        if (request.getStatus() == BookingStatus.ASSIGNED) {
            if (request.getPilotId() == null) {
                throw ApiException.badRequest("Pilot ID is required for assignment");
            }
            if (current != BookingStatus.PENDING && current != BookingStatus.APPROVED) {
                throw ApiException.badRequest("Only pending/approved bookings can be assigned");
            }
            if (current == BookingStatus.PENDING) {
                booking.setBookingStatus(BookingStatus.APPROVED);
                booking.setReviewedAt(LocalDateTime.now());
            }
            assignPilotInternal(booking, request.getPilotId());
            if (request.getAdminNotes() != null) {
                booking.setAdminNotes(request.getAdminNotes());
            }
            return BookingDto.from(bookingRepository.save(booking));
        }

        if (request.getStatus() == BookingStatus.COMPLETED) {
            if (current != BookingStatus.ASSIGNED && current != BookingStatus.APPROVED) {
                throw ApiException.badRequest("Only approved/assigned bookings can be completed");
            }
            booking.setBookingStatus(BookingStatus.COMPLETED);
            if (request.getAdminNotes() != null) {
                booking.setAdminNotes(request.getAdminNotes());
            }
            // Free pilot if assigned
            if (booking.getPilot() != null) {
                Pilot pilot = booking.getPilot();
                pilot.setAvailable(true);
                pilotRepository.save(pilot);
            }
            return BookingDto.from(bookingRepository.save(booking));
        }

        throw ApiException.badRequest("Unsupported review status: " + request.getStatus());
    }

    @Transactional
    public BookingDto assignPilot(Long bookingId, Long pilotId) {
        Booking booking = findBooking(bookingId);

        if (booking.getPaymentStatus() != PaymentStatus.PAID) {
            throw ApiException.badRequest("Booking must be paid first");
        }
        if (booking.getBookingStatus() == BookingStatus.REJECTED
                || booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw ApiException.badRequest("Cannot assign pilot to rejected/cancelled booking");
        }

        if (booking.getBookingStatus() == BookingStatus.PENDING) {
            booking.setBookingStatus(BookingStatus.APPROVED);
            booking.setReviewedAt(LocalDateTime.now());
        }

        assignPilotInternal(booking, pilotId);
        return BookingDto.from(bookingRepository.save(booking));
    }

    private void assignPilotInternal(Booking booking, Long pilotId) {
        Pilot pilot = pilotRepository.findById(pilotId)
                .orElseThrow(() -> ApiException.notFound("Pilot not found"));

        if (!pilot.isActive()) {
            throw ApiException.badRequest("Pilot is not active");
        }
        if (!pilot.isAvailable()) {
            throw ApiException.badRequest("Pilot is not available");
        }

        booking.setPilot(pilot);
        booking.setBookingStatus(BookingStatus.ASSIGNED);
        booking.setAssignedAt(LocalDateTime.now());
        pilot.setAvailable(false);
        pilotRepository.save(pilot);
    }

    private Booking findBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));
    }
}
