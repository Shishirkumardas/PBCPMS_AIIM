export type Role = "ADMIN" | "OWNER";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  active?: boolean;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Vessel {
  id: number;
  name: string;
  type: string;
  registrationNumber: string;
  description?: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  description?: string;
  /** Pilot / service details included with this route */
  pilotServices?: string;
  serviceFee: number;
  active: boolean;
  createdAt: string;
}

export interface Pilot {
  id: number;
  name: string;
  licenseNumber: string;
  phone?: string;
  email?: string;
  specialization?: string;
  available: boolean;
  active: boolean;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  status: "ACTIVE" | "USED" | "EXPIRED";
  expiresAt: string;
  issuedAt: string;
  usedAt?: string;
  notes?: string;
}

export interface Booking {
  id: number;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  vesselId: number;
  vesselName: string;
  vesselRegistration: string;
  routeId: number;
  routeName: string;
  routeOrigin: string;
  routeDestination: string;
  couponId?: number;
  couponCode?: string;
  pilotId?: number;
  pilotName?: string;
  pilotLicense?: string;
  serviceFee: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  bookingStatus: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED" | "COMPLETED" | "CANCELLED";
  ownerNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  paidAt?: string;
  reviewedAt?: string;
  assignedAt?: string;
}

export interface DashboardStats {
  totalUsers?: number;
  totalOwners?: number;
  totalVessels: number;
  pendingVessels: number;
  approvedVessels: number;
  totalRoutes?: number;
  activeRoutes?: number;
  totalPilots?: number;
  availablePilots?: number;
  totalCoupons: number;
  activeCoupons: number;
  usedCoupons: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  assignedBookings: number;
  completedBookings: number;
  paidBookings: number;
}
