package org.example.pbcpms_aiim.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.pbcpms_aiim.Repository.*;
import org.example.pbcpms_aiim.enums.CouponStatus;
import org.example.pbcpms_aiim.enums.Role;
import org.example.pbcpms_aiim.enums.VesselStatus;
import org.example.pbcpms_aiim.models.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VesselRepository vesselRepository;
    private final RouteRepository routeRepository;
    private final PilotRepository pilotRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        // Keep demo admin email consistent on existing databases
        userRepository.findByEmail("admin@pbcpms.gov.bd").ifPresent(user -> {
            user.setEmail("admin@pbcpms.com");
            userRepository.save(user);
            log.info("Updated legacy admin email to admin@pbcpms.com");
        });

        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        log.info("Seeding sample data for PBCPMS...");

        Users admin = userRepository.save(Users.builder()
                .name("System Administrator")
                .email("admin@pbcpms.com")
                .phone("01700000001")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .isActive(true)
                .build());

        Users owner = userRepository.save(Users.builder()
                .name("Karim Shipping Owner")
                .email("owner@example.com")
                .phone("01700000002")
                .password(passwordEncoder.encode("Owner@123"))
                .role(Role.OWNER)
                .isActive(true)
                .build());

        Users owner2 = userRepository.save(Users.builder()
                .name("Bengal Marine Ltd")
                .email("owner2@example.com")
                .phone("01700000003")
                .password(passwordEncoder.encode("Owner@123"))
                .role(Role.OWNER)
                .isActive(true)
                .build());

        vesselRepository.save(Vessel.builder()
                .name("MV Padma Express")
                .type("Cargo Vessel")
                .registrationNumber("REG-DHK-1001")
                .description("Medium cargo vessel for inland routes")
                .owner(owner)
                .status(VesselStatus.APPROVED)
                .createdAt(LocalDateTime.now().minusDays(5))
                .reviewedAt(LocalDateTime.now().minusDays(4))
                .build());

        vesselRepository.save(Vessel.builder()
                .name("MV Meghna Star")
                .type("Passenger Vessel")
                .registrationNumber("REG-CTG-2002")
                .description("Passenger ferry")
                .owner(owner)
                .status(VesselStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build());

        vesselRepository.save(Vessel.builder()
                .name("MV Karnaphuli")
                .type("Tanker")
                .registrationNumber("REG-CTG-3003")
                .description("Oil tanker")
                .owner(owner2)
                .status(VesselStatus.APPROVED)
                .createdAt(LocalDateTime.now().minusDays(3))
                .reviewedAt(LocalDateTime.now().minusDays(2))
                .build());

        routeRepository.save(Route.builder()
                .name("Dhaka – Barisal")
                .origin("Dhaka")
                .destination("Barisal")
                .description("Inland waterway pilot service")
                .serviceFee(new BigDecimal("5000.00"))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        routeRepository.save(Route.builder()
                .name("Chittagong – Cox's Bazar")
                .origin("Chittagong")
                .destination("Cox's Bazar")
                .description("Coastal pilot route")
                .serviceFee(new BigDecimal("8500.00"))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        routeRepository.save(Route.builder()
                .name("Khulna – Mongla")
                .origin("Khulna")
                .destination("Mongla")
                .description("Port approach pilotage")
                .serviceFee(new BigDecimal("6500.00"))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        pilotRepository.save(Pilot.builder()
                .name("Capt. Rahman Ali")
                .licenseNumber("PLT-001")
                .phone("01800000001")
                .email("rahman.pilot@pbcpms.com")
                .specialization("Inland Waterways")
                .available(true)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        pilotRepository.save(Pilot.builder()
                .name("Capt. Fatima Begum")
                .licenseNumber("PLT-002")
                .phone("01800000002")
                .email("fatima.pilot@pbcpms.com")
                .specialization("Coastal Navigation")
                .available(true)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        pilotRepository.save(Pilot.builder()
                .name("Capt. Jahangir Hossain")
                .licenseNumber("PLT-003")
                .phone("01800000003")
                .email("jahangir.pilot@pbcpms.com")
                .specialization("Port Approach")
                .available(true)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());

        couponRepository.save(Coupon.builder()
                .code("WELCOME-5000")
                .owner(owner)
                .amount(new BigDecimal("5000.00"))
                .status(CouponStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusMonths(6))
                .issuedAt(LocalDateTime.now())
                .notes("Welcome coupon for demo owner")
                .build());

        couponRepository.save(Coupon.builder()
                .code("PILOT-10000")
                .owner(owner)
                .amount(new BigDecimal("10000.00"))
                .status(CouponStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusMonths(3))
                .issuedAt(LocalDateTime.now())
                .notes("High value pilot service coupon")
                .build());

        couponRepository.save(Coupon.builder()
                .code("OWNER2-7000")
                .owner(owner2)
                .amount(new BigDecimal("7000.00"))
                .status(CouponStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusMonths(4))
                .issuedAt(LocalDateTime.now())
                .notes("Coupon for second owner")
                .build());

        log.info("Seed complete. Admin: admin@pbcpms.com / Admin@123 | Owner: owner@example.com / Owner@123");
        log.info("Seeded admin id={}, owner id={}", admin.getId(), owner.getId());
    }
}
