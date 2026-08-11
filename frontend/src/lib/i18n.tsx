"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "bn";

type Dict = Record<string, string>;

const en: Dict = {
  // Common
  "app.name": "PBCPMS",
  "app.fullName": "Pilot Booking & Coupon Payment Management System",
  "app.fullNameBn": "পাইলট বুকিং ও কুপন পেমেন্ট ব্যবস্থাপনা সিস্টেম",
  "app.tagline": "Pilot Booking & Coupon Payments",
  "app.taglineShort": "Service management portal",
  "common.loading": "Loading...",
  "common.preparing": "Preparing dashboard...",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.update": "Update",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.confirm": "Confirm",
  "common.submit": "Submit",
  "common.actions": "Actions",
  "common.status": "Status",
  "common.notes": "Notes",
  "common.optional": "optional",
  "common.signOut": "Sign out",
  "common.login": "Login",
  "common.register": "Register",
  "common.email": "Email",
  "common.password": "Password",
  "common.phone": "Phone",
  "common.name": "Name",
  "common.fullName": "Full name",
  "common.search": "Search",
  "common.all": "All",
  "common.active": "Active",
  "common.inactive": "Inactive",
  "common.yes": "Yes",
  "common.no": "No",
  "common.none": "—",
  "common.failed": "Something went wrong",
  "common.success": "Success",
  "common.language": "Language",
  "common.english": "English",
  "common.bangla": "বাংলা",
  "common.switchLang": "Language",
  "common.footer": "PBCPMS · Pilot Booking & Coupon Payment System",
  "common.created": "Created",
  "common.submitted": "Submitted",
  "common.issued": "Issued",
  "common.used": "Used",
  "common.expires": "Expires",
  "common.amount": "Amount",
  "common.code": "Code",
  "common.type": "Type",
  "common.contact": "Contact",
  "common.availability": "Availability",
  "common.path": "Path",
  "common.fee": "Fee",
  "common.owner": "Owner",
  "common.vessel": "Vessel",
  "common.route": "Route",
  "common.pilot": "Pilot",
  "common.payment": "Payment",
  "common.timeline": "Timeline",
  "common.paid": "Paid",
  "common.assigned": "Assigned",
  "common.reviewed": "Reviewed",
  "common.noData": "No data found",
  "common.verify": "Verify",
  "common.deactivate": "Deactivate",
  "common.activate": "Activate",
  "common.approve": "Approve",
  "common.reject": "Reject",
  "common.complete": "Complete",
  "common.reason": "Reason",
  "common.rejectionReason": "Rejection reason",
  "common.required": "required",
  "common.description": "Description",
  "common.bdt": "BDT",
  "common.notAssigned": "Not assigned yet",
  "common.yourNotes": "Your notes",
  "common.adminNotes": "Admin notes",
  "common.rejection": "Rejection",

  // Roles / portals
  "role.admin": "Admin",
  "role.owner": "Owner",
  "portal.admin": "Admin Portal",
  "portal.owner": "Owner Portal",

  // Nav admin
  "nav.dashboard": "Dashboard",
  "nav.vessels": "Vessels",
  "nav.routes": "Routes",
  "nav.pilots": "Pilots",
  "nav.coupons": "Coupons",
  "nav.bookings": "Bookings",
  "nav.myVessels": "My Vessels",
  "nav.myCoupons": "My Coupons",
  "nav.newBooking": "New Booking",

  // Landing
  "landing.badge": "Pilot Service Management",
  "landing.title": "Pilot Booking & Coupon Payment Management System",
  "landing.subtitle":
    "Vessel and vehicle owners can request pilot or service support for approved routes and pay required fees using validated coupons. Admins manage routes, pilots, coupons, approvals, and assignments.",
  "landing.ownerTitle": "Owner Portal",
  "landing.ownerDesc": "Register vessels, book routes, pay with coupons, track status",
  "landing.adminTitle": "Admin Control",
  "landing.adminDesc": "Approve vessels, issue coupons, assign pilots, monitor reports",
  "landing.secureTitle": "Secure JWT Auth",
  "landing.secureDesc": "Role-based access with Spring Security and modern Next.js UI",
  "landing.enter": "Enter Portal",
  "landing.ownerReg": "Owner Registration",
  "landing.demo": "Demo credentials · Admin: admin@pbcpms.com / Admin@123 · Owner: owner@example.com / Owner@123",

  // Login
  "login.title": "Sign in",
  "login.subtitle": "Use your registered credentials",
  "login.heroTitle": "Secure access for pilot booking & coupon payments",
  "login.heroText":
    "Login as an Owner to manage vessels and bookings, or as an Admin to control the full operational workflow.",
  "login.signingIn": "Signing in...",
  "login.failed": "Login failed",
  "login.demo": "Demo credentials",
  "login.fillAdmin": "Fill Admin",
  "login.fillOwner": "Fill Owner",
  "login.newOwner": "New vessel owner?",
  "login.createAccount": "Create account",
  "login.pageTitle": "PBCPMS Login",

  // Register
  "register.title": "Owner Registration",
  "register.subtitle": "Register to manage vessels and request pilot services",
  "register.creating": "Creating account...",
  "register.create": "Create owner account",
  "register.failed": "Registration failed",
  "register.haveAccount": "Already registered?",
  "register.signIn": "Sign in",
  "register.passwordHint": "At least 6 characters",

  // Admin dashboard
  "admin.dash.title": "Admin Dashboard",
  "admin.dash.subtitle": "Pilot service operations overview",
  "admin.dash.owners": "Owners",
  "admin.dash.pendingVessels": "Pending Vessels",
  "admin.dash.approved": "approved",
  "admin.dash.activeRoutes": "Active Routes",
  "admin.dash.total": "total",
  "admin.dash.availablePilots": "Available Pilots",
  "admin.dash.activeCoupons": "Active Coupons",
  "admin.dash.used": "used",
  "admin.dash.pendingBookings": "Pending Bookings",
  "admin.dash.assignedBookings": "Assigned Bookings",
  "admin.dash.completed": "Completed",
  "admin.dash.paid": "paid",
  "admin.dash.flow": "Business flow",
  "admin.dash.flow1": "Owner registers vessel/vehicle",
  "admin.dash.flow2": "Admin approves vessel",
  "admin.dash.flow3": "Admin maintains routes and pilot pool",
  "admin.dash.flow4": "Admin issues coupons to owners",
  "admin.dash.flow5": "Owner books route and pays with coupon",
  "admin.dash.flow6": "Admin approves booking and assigns pilot",
  "admin.dash.flow7": "Owner tracks final status",
  "admin.dash.guide": "Quick guidance",
  "admin.dash.guideText":
    "Start by reviewing pending vessels, then manage routes and issue coupons. When paid bookings arrive, approve them and assign an available pilot/service provider.",
  "admin.dash.totalBookings": "Total bookings",
  "admin.dash.totalCoupons": "Total coupons",

  // Owner dashboard
  "owner.dash.title": "Owner Dashboard",
  "owner.dash.subtitle": "Manage vessels, coupons, and pilot service bookings",
  "owner.dash.newBooking": "New booking",
  "owner.dash.myVessels": "My Vessels",
  "owner.dash.approvedVessels": "Approved Vessels",
  "owner.dash.pending": "pending",
  "owner.dash.activeCoupons": "Active Coupons",
  "owner.dash.myBookings": "My Bookings",
  "owner.dash.assigned": "assigned",
  "owner.dash.pendingLabel": "Pending",
  "owner.dash.completed": "Completed",
  "owner.dash.paid": "Paid",
  "owner.dash.activeRoutes": "Active Routes",
  "owner.dash.addVessel": "Add vessel",
  "owner.dash.addVesselDesc": "Submit vessel/vehicle for admin approval",
  "owner.dash.viewCoupons": "View coupons",
  "owner.dash.viewCouponsDesc": "Check available coupon balance and status",
  "owner.dash.trackBookings": "Track bookings",
  "owner.dash.trackBookingsDesc": "Follow approval, assignment and completion",

  // Vessels
  "vessels.admin.title": "Vessel Management",
  "vessels.admin.subtitle": "Approve or reject owner-submitted vessels",
  "vessels.owner.title": "My Vessels / Vehicles",
  "vessels.owner.subtitle": "Add vessels and wait for admin approval before booking",
  "vessels.add": "Add vessel",
  "vessels.name": "Name",
  "vessels.type": "Type",
  "vessels.reg": "Registration number",
  "vessels.registration": "Registration",
  "vessels.desc": "Description",
  "vessels.submit": "Submit for approval",
  "vessels.submitted": "Vessel submitted for admin approval",
  "vessels.approved": "Vessel approved",
  "vessels.rejected": "Vessel rejected",
  "vessels.rejectTitle": "Reject vessel",
  "vessels.rejectHint": "Provide a rejection reason",
  "vessels.confirmReject": "Confirm reject",
  "vessels.allStatuses": "All statuses",
  "vessels.noVessels": "No vessels found",
  "vessels.noVesselsOwner": "No vessels yet. Add your first vessel.",
  "vessels.pending": "Pending",
  "vessels.approvedStatus": "Approved",
  "vessels.rejectedStatus": "Rejected",

  // Routes
  "routes.admin.title": "Route Management",
  "routes.admin.subtitle": "Create and manage routes with fixed service fees",
  "routes.owner.title": "Available Routes",
  "routes.owner.subtitle": "Select a route with fixed service fee for booking",
  "routes.add": "Add route",
  "routes.edit": "Edit route",
  "routes.name": "Name",
  "routes.origin": "Origin",
  "routes.destination": "Destination",
  "routes.fee": "Service fee (BDT)",
  "routes.desc": "Description",
  "routes.pilotServices": "Pilot services",
  "routes.pilotServicesPlaceholder":
    "e.g. Licensed pilot, docking assistance, night navigation support",
  "routes.pilotServicesDefault": "Licensed pilot / service provider assignment for this route",
  "routes.created": "Route created",
  "routes.updated": "Route updated",
  "routes.book": "Book",
  "routes.bookRoute": "Book a route",
  "routes.none": "No active routes available.",
  "routes.route": "Route",

  // Pilots
  "pilots.title": "Pilot / Service Provider Management",
  "pilots.subtitle": "Maintain the pool of pilots for assignment",
  "pilots.add": "Add pilot",
  "pilots.edit": "Edit pilot",
  "pilots.license": "License number",
  "pilots.licenseShort": "License",
  "pilots.specialization": "Specialization",
  "pilots.created": "Pilot created",
  "pilots.updated": "Pilot updated",
  "pilots.pilot": "Pilot",
  "pilots.activeAccount": "Active account",
  "pilots.inactiveAccount": "Inactive",

  // Coupons
  "coupons.admin.title": "Coupon Management",
  "coupons.admin.subtitle": "Issue and verify owner payment coupons",
  "coupons.owner.title": "My Coupons",
  "coupons.owner.subtitle": "Coupons issued by admin work as the payment method for bookings",
  "coupons.issue": "Issue coupon",
  "coupons.issued": "Coupon issued successfully",
  "coupons.amount": "Amount (BDT)",
  "coupons.codeOptional": "Code (optional)",
  "coupons.codeAuto": "Auto-generated if empty",
  "coupons.expiresAt": "Expires at",
  "coupons.notes": "Notes",
  "coupons.none": "No coupons issued yet. Contact admin for coupons.",

  // Bookings admin
  "bookings.admin.title": "Booking Management",
  "bookings.admin.subtitle": "Approve/reject bookings and assign pilot/service providers",
  "bookings.none": "No bookings yet",
  "bookings.approveAssign": "Approve & Assign",
  "bookings.assignPilot": "Assign pilot",
  "bookings.reassignPilot": "Reassign pilot",
  "bookings.confirmAssign": "Confirm assignment",
  "bookings.assignTitle": "Assign pilot / service provider",
  "bookings.assignHint": "Select a pilot for this booking (works after approve or from pending)",
  "bookings.noPilots": "No available pilots — mark a pilot as available first",
  "bookings.busy": "busy",
  "bookings.approvedOk": "Booking approved — you can assign a pilot next",
  "bookings.assignedOk": "Pilot assigned successfully",
  "bookings.rejectedOk": "Booking rejected",
  "bookings.completedOk": "Booking marked completed",
  "bookings.rejectTitle": "Reject booking",
  "bookings.rejectPlaceholder": "Rejection reason...",
  "bookings.selectPilot": "Select a pilot",
  "bookings.coupon": "Coupon",
  "bookings.id": "ID",

  // Bookings owner
  "bookings.owner.title": "My Bookings",
  "bookings.owner.subtitle": "Track booking and payment status",
  "bookings.owner.none": "No bookings yet.",
  "bookings.owner.first": "Create your first booking",
  "bookings.booking": "Booking",
  "bookings.serviceFee": "Service fee",
  "bookings.paidWith": "Paid with",
  "bookings.assignedPilot": "Assigned pilot",

  // New booking
  "booking.new.title": "Create Booking",
  "booking.new.subtitle": "Select approved vessel, route, and pay using a valid coupon",
  "booking.new.needVessel": "You need at least one approved vessel before booking. Submit a vessel and wait for admin approval.",
  "booking.new.needCoupon": "No active coupons found. Ask admin to issue a coupon covering the route fee.",
  "booking.new.approvedVessel": "Approved vessel",
  "booking.new.route": "Route",
  "booking.new.couponCode": "Coupon code",
  "booking.new.couponPlaceholder": "Enter coupon code",
  "booking.new.notes": "Notes (optional)",
  "booking.new.notesPlaceholder": "Special requirements...",
  "booking.new.submit": "Book & pay with coupon",
  "booking.new.processing": "Processing payment...",
  "booking.new.feeSummary": "Fee summary",
  "booking.new.feeRules":
    "Route fee is fixed. Coupon must be active, not expired, not used, owned by you, and amount ≥ fee.",
  "booking.new.selectedFee": "Selected route fee",
  "booking.new.activeCoupons": "Your active coupons",
  "booking.new.noneCoupons": "None available",
  "booking.new.created": "Booking created. Payment status:",
  "booking.new.failed": "Booking failed",
  "booking.new.invalidCoupon": "Coupon invalid",
  "booking.new.couponValid": "Coupon is valid for",
  "booking.new.coversFee": "covers fee",
};

const bn: Dict = {
  // Common
  "app.name": "পিবিসিপিএমএস",
  "app.fullName": "পাইলট বুকিং ও কুপন পেমেন্ট ব্যবস্থাপনা সিস্টেম",
  "app.fullNameBn": "পাইলট বুকিং ও কুপন পেমেন্ট ব্যবস্থাপনা সিস্টেম",
  "app.tagline": "পাইলট বুকিং ও কুপন পেমেন্ট",
  "app.taglineShort": "সেবা ব্যবস্থাপনা পোর্টাল",
  "common.loading": "লোড হচ্ছে...",
  "common.preparing": "ড্যাশবোর্ড প্রস্তুত হচ্ছে...",
  "common.save": "সংরক্ষণ",
  "common.cancel": "বাতিল",
  "common.create": "তৈরি করুন",
  "common.update": "আপডেট",
  "common.edit": "সম্পাদনা",
  "common.delete": "মুছুন",
  "common.confirm": "নিশ্চিত করুন",
  "common.submit": "জমা দিন",
  "common.actions": "কার্যক্রম",
  "common.status": "অবস্থা",
  "common.notes": "মন্তব্য",
  "common.optional": "ঐচ্ছিক",
  "common.signOut": "সাইন আউট",
  "common.login": "লগইন",
  "common.register": "নিবন্ধন",
  "common.email": "ইমেইল",
  "common.password": "পাসওয়ার্ড",
  "common.phone": "ফোন",
  "common.name": "নাম",
  "common.fullName": "পূর্ণ নাম",
  "common.search": "খুঁজুন",
  "common.all": "সব",
  "common.active": "সক্রিয়",
  "common.inactive": "নিষ্ক্রিয়",
  "common.yes": "হ্যাঁ",
  "common.no": "না",
  "common.none": "—",
  "common.failed": "কিছু ভুল হয়েছে",
  "common.success": "সফল",
  "common.language": "ভাষা",
  "common.english": "English",
  "common.bangla": "বাংলা",
  "common.switchLang": "ভাষা",
  "common.footer": "পিবিসিপিএমএস · পাইলট বুকিং ও কুপন পেমেন্ট সিস্টেম",
  "common.created": "তৈরি",
  "common.submitted": "জমা",
  "common.issued": "ইস্যু",
  "common.used": "ব্যবহৃত",
  "common.expires": "মেয়াদ",
  "common.amount": "পরিমাণ",
  "common.code": "কোড",
  "common.type": "ধরন",
  "common.contact": "যোগাযোগ",
  "common.availability": "উপলব্ধতা",
  "common.path": "পথ",
  "common.fee": "ফি",
  "common.owner": "মালিক",
  "common.vessel": "জাহাজ",
  "common.route": "রুট",
  "common.pilot": "পাইলট",
  "common.payment": "পেমেন্ট",
  "common.timeline": "সময়রেখা",
  "common.paid": "পরিশোধিত",
  "common.assigned": "নিযুক্ত",
  "common.reviewed": "পর্যালোচিত",
  "common.noData": "কোনো তথ্য পাওয়া যায়নি",
  "common.verify": "যাচাই",
  "common.deactivate": "নিষ্ক্রিয় করুন",
  "common.activate": "সক্রিয় করুন",
  "common.approve": "অনুমোদন",
  "common.reject": "প্রত্যাখ্যান",
  "common.complete": "সম্পন্ন",
  "common.reason": "কারণ",
  "common.rejectionReason": "প্রত্যাখ্যানের কারণ",
  "common.required": "আবশ্যক",
  "common.description": "বিবরণ",
  "common.bdt": "টাকা",
  "common.notAssigned": "এখনো নিযুক্ত হয়নি",
  "common.yourNotes": "আপনার মন্তব্য",
  "common.adminNotes": "অ্যাডমিন মন্তব্য",
  "common.rejection": "প্রত্যাখ্যান",

  "role.admin": "অ্যাডমিন",
  "role.owner": "মালিক",
  "portal.admin": "অ্যাডমিন পোর্টাল",
  "portal.owner": "মালিক পোর্টাল",

  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.vessels": "জাহাজ",
  "nav.routes": "রুট",
  "nav.pilots": "পাইলট",
  "nav.coupons": "কুপন",
  "nav.bookings": "বুকিং",
  "nav.myVessels": "আমার জাহাজ",
  "nav.myCoupons": "আমার কুপন",
  "nav.newBooking": "নতুন বুকিং",

  "landing.badge": "পাইলট সেবা ব্যবস্থাপনা",
  "landing.title": "পাইলট বুকিং ও কুপন পেমেন্ট ব্যবস্থাপনা সিস্টেম",
  "landing.subtitle":
    "জাহাজ/যানবাহনের মালিকরা অনুমোদিত রুটে পাইলট বা সেবা সহায়তা অনুরোধ করতে পারেন এবং যাচাইকৃত কুপন দিয়ে প্রয়োজনীয় ফি পরিশোধ করতে পারেন। অ্যাডমিন রুট, পাইলট, কুপন, অনুমোদন ও নিয়োগ পরিচালনা করেন।",
  "landing.ownerTitle": "মালিক পোর্টাল",
  "landing.ownerDesc": "জাহাজ নিবন্ধন, রুট বুকিং, কুপন দিয়ে পেমেন্ট, অবস্থা ট্র্যাক",
  "landing.adminTitle": "অ্যাডমিন নিয়ন্ত্রণ",
  "landing.adminDesc": "জাহাজ অনুমোদন, কুপন ইস্যু, পাইলট নিয়োগ, রিপোর্ট পর্যবেক্ষণ",
  "landing.secureTitle": "নিরাপদ JWT প্রমাণীকরণ",
  "landing.secureDesc": "রোল-ভিত্তিক প্রবেশাধিকার ও আধুনিক নেক্সট.জেএস ইউআই",
  "landing.enter": "পোর্টালে প্রবেশ",
  "landing.ownerReg": "মালিক নিবন্ধন",
  "landing.demo": "ডেমো · অ্যাডমিন: admin@pbcpms.com / Admin@123 · মালিক: owner@example.com / Owner@123",

  "login.title": "সাইন ইন",
  "login.subtitle": "আপনার নিবন্ধিত তথ্য ব্যবহার করুন",
  "login.heroTitle": "পাইলট বুকিং ও কুপন পেমেন্টের নিরাপদ প্রবেশ",
  "login.heroText":
    "জাহাজ ও বুকিং পরিচালনার জন্য মালিক হিসেবে, অথবা পূর্ণ কার্যক্রম নিয়ন্ত্রণে অ্যাডমিন হিসেবে লগইন করুন।",
  "login.signingIn": "সাইন ইন হচ্ছে...",
  "login.failed": "লগইন ব্যর্থ",
  "login.demo": "ডেমো তথ্য",
  "login.fillAdmin": "অ্যাডমিন পূরণ",
  "login.fillOwner": "মালিক পূরণ",
  "login.newOwner": "নতুন জাহাজ মালিক?",
  "login.createAccount": "অ্যাকাউন্ট তৈরি",
  "login.pageTitle": "পিবিসিপিএমএস লগইন",

  "register.title": "মালিক নিবন্ধন",
  "register.subtitle": "জাহাজ পরিচালনা ও পাইলট সেবা অনুরোধ করতে নিবন্ধন করুন",
  "register.creating": "অ্যাকাউন্ট তৈরি হচ্ছে...",
  "register.create": "মালিক অ্যাকাউন্ট তৈরি",
  "register.failed": "নিবন্ধন ব্যর্থ",
  "register.haveAccount": "ইতিমধ্যে নিবন্ধিত?",
  "register.signIn": "সাইন ইন",
  "register.passwordHint": "কমপক্ষে ৬ অক্ষর",

  "admin.dash.title": "অ্যাডমিন ড্যাশবোর্ড",
  "admin.dash.subtitle": "পাইলট সেবা কার্যক্রমের সারসংক্ষেপ",
  "admin.dash.owners": "মালিক",
  "admin.dash.pendingVessels": "অপেক্ষমাণ জাহাজ",
  "admin.dash.approved": "অনুমোদিত",
  "admin.dash.activeRoutes": "সক্রিয় রুট",
  "admin.dash.total": "মোট",
  "admin.dash.availablePilots": "উপলব্ধ পাইলট",
  "admin.dash.activeCoupons": "সক্রিয় কুপন",
  "admin.dash.used": "ব্যবহৃত",
  "admin.dash.pendingBookings": "অপেক্ষমাণ বুকিং",
  "admin.dash.assignedBookings": "নিযুক্ত বুকিং",
  "admin.dash.completed": "সম্পন্ন",
  "admin.dash.paid": "পরিশোধিত",
  "admin.dash.flow": "ব্যবসায়িক প্রবাহ",
  "admin.dash.flow1": "মালিক জাহাজ/যানবাহন নিবন্ধন করেন",
  "admin.dash.flow2": "অ্যাডমিন জাহাজ অনুমোদন করেন",
  "admin.dash.flow3": "অ্যাডমিন রুট ও পাইলট পুল রক্ষণাবেক্ষণ করেন",
  "admin.dash.flow4": "অ্যাডমিন মালিককে কুপন ইস্যু করেন",
  "admin.dash.flow5": "মালিক রুট বুক করে কুপনে পেমেন্ট করেন",
  "admin.dash.flow6": "অ্যাডমিন বুকিং অনুমোদন ও পাইলট নিয়োগ করেন",
  "admin.dash.flow7": "মালিক চূড়ান্ত অবস্থা ট্র্যাক করেন",
  "admin.dash.guide": "দ্রুত নির্দেশনা",
  "admin.dash.guideText":
    "প্রথমে অপেক্ষমাণ জাহাজ পর্যালোচনা করুন, তারপর রুট পরিচালনা ও কুপন ইস্যু করুন। পরিশোধিত বুকিং এলে অনুমোদন করে উপলব্ধ পাইলট নিয়োগ করুন।",
  "admin.dash.totalBookings": "মোট বুকিং",
  "admin.dash.totalCoupons": "মোট কুপন",

  "owner.dash.title": "মালিক ড্যাশবোর্ড",
  "owner.dash.subtitle": "জাহাজ, কুপন ও পাইলট সেবা বুকিং পরিচালনা করুন",
  "owner.dash.newBooking": "নতুন বুকিং",
  "owner.dash.myVessels": "আমার জাহাজ",
  "owner.dash.approvedVessels": "অনুমোদিত জাহাজ",
  "owner.dash.pending": "অপেক্ষমাণ",
  "owner.dash.activeCoupons": "সক্রিয় কুপন",
  "owner.dash.myBookings": "আমার বুকিং",
  "owner.dash.assigned": "নিযুক্ত",
  "owner.dash.pendingLabel": "অপেক্ষমাণ",
  "owner.dash.completed": "সম্পন্ন",
  "owner.dash.paid": "পরিশোধিত",
  "owner.dash.activeRoutes": "সক্রিয় রুট",
  "owner.dash.addVessel": "জাহাজ যোগ করুন",
  "owner.dash.addVesselDesc": "অ্যাডমিন অনুমোদনের জন্য জাহাজ/যানবাহন জমা দিন",
  "owner.dash.viewCoupons": "কুপন দেখুন",
  "owner.dash.viewCouponsDesc": "উপলব্ধ কুপন ব্যালেন্স ও অবস্থা দেখুন",
  "owner.dash.trackBookings": "বুকিং ট্র্যাক",
  "owner.dash.trackBookingsDesc": "অনুমোদন, নিয়োগ ও সম্পন্ন অবস্থা অনুসরণ করুন",

  "vessels.admin.title": "জাহাজ ব্যবস্থাপনা",
  "vessels.admin.subtitle": "মালিক-জমাকৃত জাহাজ অনুমোদন বা প্রত্যাখ্যান করুন",
  "vessels.owner.title": "আমার জাহাজ / যানবাহন",
  "vessels.owner.subtitle": "জাহাজ যোগ করুন এবং বুকিংয়ের আগে অ্যাডমিন অনুমোদনের অপেক্ষা করুন",
  "vessels.add": "জাহাজ যোগ করুন",
  "vessels.name": "নাম",
  "vessels.type": "ধরন",
  "vessels.reg": "নিবন্ধন নম্বর",
  "vessels.registration": "নিবন্ধন",
  "vessels.desc": "বিবরণ",
  "vessels.submit": "অনুমোদনের জন্য জমা দিন",
  "vessels.submitted": "জাহাজ অ্যাডমিন অনুমোদনের জন্য জমা হয়েছে",
  "vessels.approved": "জাহাজ অনুমোদিত",
  "vessels.rejected": "জাহাজ প্রত্যাখ্যাত",
  "vessels.rejectTitle": "জাহাজ প্রত্যাখ্যান",
  "vessels.rejectHint": "প্রত্যাখ্যানের কারণ লিখুন",
  "vessels.confirmReject": "প্রত্যাখ্যান নিশ্চিত করুন",
  "vessels.allStatuses": "সব অবস্থা",
  "vessels.noVessels": "কোনো জাহাজ পাওয়া যায়নি",
  "vessels.noVesselsOwner": "এখনো কোনো জাহাজ নেই। প্রথম জাহাজ যোগ করুন।",
  "vessels.pending": "অপেক্ষমাণ",
  "vessels.approvedStatus": "অনুমোদিত",
  "vessels.rejectedStatus": "প্রত্যাখ্যাত",

  "routes.admin.title": "রুট ব্যবস্থাপনা",
  "routes.admin.subtitle": "নির্ধারিত সেবা ফিসহ রুট তৈরি ও পরিচালনা করুন",
  "routes.owner.title": "উপলব্ধ রুট",
  "routes.owner.subtitle": "বুকিংয়ের জন্য নির্ধারিত সেবা ফিসহ রুট নির্বাচন করুন",
  "routes.add": "রুট যোগ করুন",
  "routes.edit": "রুট সম্পাদনা",
  "routes.name": "নাম",
  "routes.origin": "উৎস",
  "routes.destination": "গন্তব্য",
  "routes.fee": "সেবা ফি (টাকা)",
  "routes.desc": "বিবরণ",
  "routes.pilotServices": "পাইলট সেবা",
  "routes.pilotServicesPlaceholder":
    "যেমন: লাইসেন্সপ্রাপ্ত পাইলট, ডকিং সহায়তা, রাতের নৌচলাচল সহায়তা",
  "routes.pilotServicesDefault": "এই রুটের জন্য লাইসেন্সপ্রাপ্ত পাইলট / সেবা প্রদানকারী নিয়োগ",
  "routes.created": "রুট তৈরি হয়েছে",
  "routes.updated": "রুট আপডেট হয়েছে",
  "routes.book": "বুক করুন",
  "routes.bookRoute": "রুট বুক করুন",
  "routes.none": "কোনো সক্রিয় রুট নেই।",
  "routes.route": "রুট",

  "pilots.title": "পাইলট / সেবা প্রদানকারী ব্যবস্থাপনা",
  "pilots.subtitle": "নিয়োগের জন্য পাইলট পুল রক্ষণাবেক্ষণ করুন",
  "pilots.add": "পাইলট যোগ করুন",
  "pilots.edit": "পাইলট সম্পাদনা",
  "pilots.license": "লাইসেন্স নম্বর",
  "pilots.licenseShort": "লাইসেন্স",
  "pilots.specialization": "বিশেষায়িত ক্ষেত্র",
  "pilots.created": "পাইলট তৈরি হয়েছে",
  "pilots.updated": "পাইলট আপডেট হয়েছে",
  "pilots.pilot": "পাইলট",
  "pilots.activeAccount": "সক্রিয় অ্যাকাউন্ট",
  "pilots.inactiveAccount": "নিষ্ক্রিয়",

  "coupons.admin.title": "কুপন ব্যবস্থাপনা",
  "coupons.admin.subtitle": "মালিকের পেমেন্ট কুপন ইস্যু ও যাচাই করুন",
  "coupons.owner.title": "আমার কুপন",
  "coupons.owner.subtitle": "অ্যাডমিন ইস্যুকৃত কুপন বুকিংয়ের পেমেন্ট মাধ্যম হিসেবে কাজ করে",
  "coupons.issue": "কুপন ইস্যু",
  "coupons.issued": "কুপন সফলভাবে ইস্যু হয়েছে",
  "coupons.amount": "পরিমাণ (টাকা)",
  "coupons.codeOptional": "কোড (ঐচ্ছিক)",
  "coupons.codeAuto": "খালি রাখলে স্বয়ংক্রিয় তৈরি",
  "coupons.expiresAt": "মেয়াদ শেষ",
  "coupons.notes": "মন্তব্য",
  "coupons.none": "এখনো কোনো কুপন ইস্যু হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।",

  "bookings.admin.title": "বুকিং ব্যবস্থাপনা",
  "bookings.admin.subtitle": "বুকিং অনুমোদন/প্রত্যাখ্যান এবং পাইলট নিয়োগ করুন",
  "bookings.none": "এখনো কোনো বুকিং নেই",
  "bookings.approveAssign": "অনুমোদন ও নিয়োগ",
  "bookings.assignPilot": "পাইলট নিয়োগ",
  "bookings.reassignPilot": "পাইলট পুনঃনিয়োগ",
  "bookings.confirmAssign": "নিয়োগ নিশ্চিত করুন",
  "bookings.assignTitle": "পাইলট / সেবা প্রদানকারী নিয়োগ",
  "bookings.assignHint": "এই বুকিংয়ের জন্য একজন পাইলট নির্বাচন করুন (অনুমোদনের পর বা অপেক্ষমাণ অবস্থায়)",
  "bookings.noPilots": "কোনো উপলব্ধ পাইলট নেই — আগে একজন পাইলটকে উপলব্ধ করুন",
  "bookings.busy": "ব্যস্ত",
  "bookings.approvedOk": "বুকিং অনুমোদিত — এখন পাইলট নিয়োগ করতে পারেন",
  "bookings.assignedOk": "পাইলট সফলভাবে নিযুক্ত",
  "bookings.rejectedOk": "বুকিং প্রত্যাখ্যাত",
  "bookings.completedOk": "বুকিং সম্পন্ন হিসেবে চিহ্নিত",
  "bookings.rejectTitle": "বুকিং প্রত্যাখ্যান",
  "bookings.rejectPlaceholder": "প্রত্যাখ্যানের কারণ...",
  "bookings.selectPilot": "একজন পাইলট নির্বাচন করুন",
  "bookings.coupon": "কুপন",
  "bookings.id": "আইডি",

  "bookings.owner.title": "আমার বুকিং",
  "bookings.owner.subtitle": "বুকিং ও পেমেন্ট অবস্থা ট্র্যাক করুন",
  "bookings.owner.none": "এখনো কোনো বুকিং নেই।",
  "bookings.owner.first": "আপনার প্রথম বুকিং তৈরি করুন",
  "bookings.booking": "বুকিং",
  "bookings.serviceFee": "সেবা ফি",
  "bookings.paidWith": "দিয়ে পরিশোধ",
  "bookings.assignedPilot": "নিযুক্ত পাইলট",

  "booking.new.title": "বুকিং তৈরি",
  "booking.new.subtitle": "অনুমোদিত জাহাজ, রুট নির্বাচন করুন এবং বৈধ কুপনে পেমেন্ট করুন",
  "booking.new.needVessel": "বুকিংয়ের আগে কমপক্ষে একটি অনুমোদিত জাহাজ প্রয়োজন। জাহাজ জমা দিন এবং অ্যাডমিন অনুমোদনের অপেক্ষা করুন।",
  "booking.new.needCoupon": "কোনো সক্রিয় কুপন নেই। রুট ফি কভার করে এমন কুপন ইস্যুর জন্য অ্যাডমিনকে বলুন।",
  "booking.new.approvedVessel": "অনুমোদিত জাহাজ",
  "booking.new.route": "রুট",
  "booking.new.couponCode": "কুপন কোড",
  "booking.new.couponPlaceholder": "কুপন কোড লিখুন",
  "booking.new.notes": "মন্তব্য (ঐচ্ছিক)",
  "booking.new.notesPlaceholder": "বিশেষ চাহিদা...",
  "booking.new.submit": "বুক করুন ও কুপনে পেমেন্ট",
  "booking.new.processing": "পেমেন্ট প্রক্রিয়াধীন...",
  "booking.new.feeSummary": "ফি সারসংক্ষেপ",
  "booking.new.feeRules":
    "রুট ফি নির্ধারিত। কুপন সক্রিয়, মেয়াদোত্তীর্ণ নয়, অব্যবহৃত, আপনার মালিকানাধীন এবং পরিমাণ ≥ ফি হতে হবে।",
  "booking.new.selectedFee": "নির্বাচিত রুট ফি",
  "booking.new.activeCoupons": "আপনার সক্রিয় কুপন",
  "booking.new.noneCoupons": "কোনোটি উপলব্ধ নেই",
  "booking.new.created": "বুকিং তৈরি হয়েছে। পেমেন্ট অবস্থা:",
  "booking.new.failed": "বুকিং ব্যর্থ",
  "booking.new.invalidCoupon": "কুপন অবৈধ",
  "booking.new.couponValid": "কুপন বৈধ, পরিমাণ",
  "booking.new.coversFee": "ফি কভার করে",
};

const dictionaries: Record<Locale, Dict> = { en, bn };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isBn: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "pbcpms_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "bn") {
      setLocaleState(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("lang-bn", locale === "bn");
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = dictionaries[locale];
      return dict[key] ?? dictionaries.en[key] ?? key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isBn: locale === "bn",
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LanguageSwitcher({
  variant = "default",
}: {
  variant?: "default" | "light" | "compact";
}) {
  const { locale, setLocale, t } = useI18n();

  const base =
    variant === "light"
      ? "border-white/30 bg-white/10 text-white"
      : variant === "compact"
        ? "border-bd-green/20 bg-white text-bd-green-dark"
        : "border-bd-green/25 bg-white text-bd-green-dark shadow-sm";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-0.5 text-xs font-semibold ${base}`}
      role="group"
      aria-label={t("common.language")}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "en"
            ? variant === "light"
              ? "bg-white text-bd-green"
              : "bg-bd-green text-white"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "bn"
            ? variant === "light"
              ? "bg-white text-bd-green"
              : "bg-bd-green text-white"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
