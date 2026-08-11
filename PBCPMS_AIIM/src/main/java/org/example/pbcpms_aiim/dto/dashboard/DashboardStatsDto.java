package org.example.pbcpms_aiim.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalUsers;
    private long totalOwners;
    private long totalVessels;
    private long pendingVessels;
    private long approvedVessels;
    private long totalRoutes;
    private long activeRoutes;
    private long totalPilots;
    private long availablePilots;
    private long totalCoupons;
    private long activeCoupons;
    private long usedCoupons;
    private long totalBookings;
    private long pendingBookings;
    private long approvedBookings;
    private long assignedBookings;
    private long completedBookings;
    private long paidBookings;
}
