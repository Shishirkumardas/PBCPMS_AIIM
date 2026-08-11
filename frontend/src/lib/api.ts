import type { ApiResponse, AuthResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pbcpms-aiim.onrender.com";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pbcpms_token");
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new ApiError(body?.message || `Request failed (${res.status})`, res.status);
  }

  if (body && body.success === false) {
    throw new ApiError(body.message || "Request failed", res.status);
  }

  return (body?.data ?? body) as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (payload: { name: string; email: string; phone?: string; password: string }) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<import("./types").User>("/api/auth/me"),

  listOwners: () => request<import("./types").User[]>("/api/auth/owners"),

  // Dashboard
  adminStats: () => request<import("./types").DashboardStats>("/api/dashboard/admin"),
  ownerStats: () => request<import("./types").DashboardStats>("/api/dashboard/owner"),

  // Vessels
  createVessel: (payload: {
    name: string;
    type: string;
    registrationNumber: string;
    description?: string;
  }) =>
    request<import("./types").Vessel>("/api/vessels", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  myVessels: () => request<import("./types").Vessel[]>("/api/vessels/mine"),
  myApprovedVessels: () =>
    request<import("./types").Vessel[]>("/api/vessels/mine/approved"),
  allVessels: (status?: string) =>
    request<import("./types").Vessel[]>(
      status ? `/api/vessels?status=${status}` : "/api/vessels"
    ),
  reviewVessel: (id: number, status: string, rejectionReason?: string) =>
    request<import("./types").Vessel>(`/api/vessels/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status, rejectionReason }),
    }),

  // Routes
  allRoutes: (activeOnly = false) =>
    request<import("./types").Route[]>(
      activeOnly ? "/api/routes?activeOnly=true" : "/api/routes"
    ),
  activeRoutes: () => request<import("./types").Route[]>("/api/routes/active"),
  createRoute: (payload: {
    name: string;
    origin: string;
    destination: string;
    description?: string;
    serviceFee: number;
    active?: boolean;
  }) =>
    request<import("./types").Route>("/api/routes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateRoute: (
    id: number,
    payload: {
      name: string;
      origin: string;
      destination: string;
      description?: string;
      serviceFee: number;
      active?: boolean;
    }
  ) =>
    request<import("./types").Route>(`/api/routes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  toggleRoute: (id: number) =>
    request<import("./types").Route>(`/api/routes/${id}/toggle`, { method: "PATCH" }),
  deleteRoute: (id: number) =>
    request<void>(`/api/routes/${id}`, { method: "DELETE" }),

  // Pilots
  allPilots: () => request<import("./types").Pilot[]>("/api/pilots"),
  availablePilots: () => request<import("./types").Pilot[]>("/api/pilots/available"),
  createPilot: (payload: {
    name: string;
    licenseNumber: string;
    phone?: string;
    email?: string;
    specialization?: string;
    available?: boolean;
    active?: boolean;
  }) =>
    request<import("./types").Pilot>("/api/pilots", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updatePilot: (
    id: number,
    payload: {
      name: string;
      licenseNumber: string;
      phone?: string;
      email?: string;
      specialization?: string;
      available?: boolean;
      active?: boolean;
    }
  ) =>
    request<import("./types").Pilot>(`/api/pilots/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePilot: (id: number) =>
    request<void>(`/api/pilots/${id}`, { method: "DELETE" }),

  // Coupons
  allCoupons: () => request<import("./types").Coupon[]>("/api/coupons"),
  myCoupons: () => request<import("./types").Coupon[]>("/api/coupons/mine"),
  issueCoupon: (payload: {
    ownerId: number;
    amount: number;
    code?: string;
    expiresAt: string;
    notes?: string;
  }) =>
    request<import("./types").Coupon>("/api/coupons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verifyCoupon: (code: string, amount: number) =>
    request<import("./types").Coupon>(
      `/api/coupons/verify?code=${encodeURIComponent(code)}&amount=${amount}`
    ),

  // Bookings
  createBooking: (payload: {
    vesselId: number;
    routeId: number;
    couponCode: string;
    ownerNotes?: string;
  }) =>
    request<import("./types").Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  myBookings: () => request<import("./types").Booking[]>("/api/bookings/mine"),
  allBookings: () => request<import("./types").Booking[]>("/api/bookings"),
  reviewBooking: (
    id: number,
    payload: {
      status: string;
      pilotId?: number;
      rejectionReason?: string;
      adminNotes?: string;
    }
  ) =>
    request<import("./types").Booking>(`/api/bookings/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  assignPilot: (id: number, pilotId: number) =>
    request<import("./types").Booking>(`/api/bookings/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ pilotId }),
    }),
};

export function formatMoney(amount: number | string, locale: "en" | "bn" = "en") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  const tag = locale === "bn" ? "bn-BD" : "en-BD";
  try {
    return new Intl.NumberFormat(tag, {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n || 0);
  } catch {
    return `৳${(n || 0).toLocaleString()}`;
  }
}

export function formatDate(value?: string, locale: "en" | "bn" = "en") {
  if (!value) return "—";
  const tag = locale === "bn" ? "bn-BD" : "en-GB";
  return new Date(value).toLocaleString(tag, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
