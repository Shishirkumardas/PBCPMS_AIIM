package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.BookingRepository;
import org.example.pbcpms_aiim.Repository.CouponRepository;
import org.example.pbcpms_aiim.Repository.PilotRepository;
import org.example.pbcpms_aiim.Repository.RouteRepository;
import org.example.pbcpms_aiim.Repository.UserRepository;
import org.example.pbcpms_aiim.Repository.VesselRepository;
import org.example.pbcpms_aiim.dto.dashboard.DashboardStatsDto;
import org.example.pbcpms_aiim.enums.BookingStatus;
import org.example.pbcpms_aiim.enums.CouponStatus;
import org.example.pbcpms_aiim.enums.PaymentStatus;
import org.example.pbcpms_aiim.enums.Role;
import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.models.Booking;
import org.example.pbcpms_aiim.models.Coupon;
import org.example.pbcpms_aiim.models.Pilot;
import org.example.pbcpms_aiim.models.Route;
import org.example.pbcpms_aiim.models.Vessel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final VesselRepository vesselRepository;
    private final RouteRepository routeRepository;
    private final PilotRepository pilotRepository;
    private final CouponRepository couponRepository;
    private final BookingRepository bookingRepository;

    public DashboardStatsDto adminStats() {
        List<Vessel> vessels = vesselRepository.findAll();
        List<Route> routes = routeRepository.findAll();
        List<Pilot> pilots = pilotRepository.findAll();
        List<Coupon> coupons = couponRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalOwners(userRepository.findAll().stream().filter(u -> u.getRole() == Role.OWNER).count())
                .totalVessels(vessels.size())
                .pendingVessels(vessels.stream().filter(v -> v.getStatus() == VesselStatus.PENDING).count())
                .approvedVessels(vessels.stream().filter(v -> v.getStatus() == VesselStatus.APPROVED).count())
                .totalRoutes(routes.size())
                .activeRoutes(routes.stream().filter(Route::isActive).count())
                .totalPilots(pilots.size())
                .availablePilots(pilots.stream().filter(p -> p.isActive() && p.isAvailable()).count())
                .totalCoupons(coupons.size())
                .activeCoupons(coupons.stream().filter(c -> c.getStatus() == CouponStatus.ACTIVE).count())
                .usedCoupons(coupons.stream().filter(c -> c.getStatus() == CouponStatus.USED).count())
                .totalBookings(bookings.size())
                .pendingBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.PENDING).count())
                .approvedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.APPROVED).count())
                .assignedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.ASSIGNED).count())
                .completedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.COMPLETED).count())
                .paidBookings(bookings.stream().filter(b -> b.getPaymentStatus() == PaymentStatus.PAID).count())
                .build();
    }

    public DashboardStatsDto ownerStats(Long ownerId) {
        List<Vessel> vessels = vesselRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
        List<Coupon> coupons = couponRepository.findByOwnerIdOrderByIssuedAtDesc(ownerId);
        List<Booking> bookings = bookingRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);

        return DashboardStatsDto.builder()
                .totalVessels(vessels.size())
                .pendingVessels(vessels.stream().filter(v -> v.getStatus() == VesselStatus.PENDING).count())
                .approvedVessels(vessels.stream().filter(v -> v.getStatus() == VesselStatus.APPROVED).count())
                .totalCoupons(coupons.size())
                .activeCoupons(coupons.stream().filter(c -> c.getStatus() == CouponStatus.ACTIVE).count())
                .usedCoupons(coupons.stream().filter(c -> c.getStatus() == CouponStatus.USED).count())
                .totalBookings(bookings.size())
                .pendingBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.PENDING).count())
                .approvedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.APPROVED).count())
                .assignedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.ASSIGNED).count())
                .completedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.COMPLETED).count())
                .paidBookings(bookings.stream().filter(b -> b.getPaymentStatus() == PaymentStatus.PAID).count())
                .activeRoutes(routeRepository.findByActiveTrueOrderByNameAsc().size())
                .build();
    }
}
