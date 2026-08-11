# PBCPMS — Pilot Booking & Coupon Payment Management System

A mini web system where vessel/vehicle owners request pilot/service support for selected routes and pay required fees using validated coupons.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Backend | Spring Boot, Spring Security, JWT, Spring Data JPA |
| Database | PostgreSQL (`pbcpms`) |
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend host | Render (Docker + `application-render.properties`) |
| Frontend host | Vercel |

---

## Project structure

```
PBCPMS_AIIM/
├── PBCPMS_AIIM/          # Spring Boot backend
├── frontend/             # Next.js frontend
├── requirement1.jfif     # Project requirements (part 1)
├── requirement2.jfif     # Project requirements (part 2)
└── README.md
```

---

## Demo credentials

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | `admin@pbcpms.com` | `Admin@123` |
| Owner | `owner@example.com`   | `Owner@123` |
| Owner | `owner2@example.com`  | `Owner@123` |

**Sample owner coupon codes:** `WELCOME-5000`, `PILOT-10000`

---

## Prerequisites

- **Java 21**
- **Node.js 18+** (20 recommended)
- Maven wrapper is included (`mvnw` / `mvnw.cmd`)

---

## Local PostgreSQL

Default `application.properties` connects to:

| Setting | Value |
|---------|--------|
| URL | `jdbc:postgresql://localhost:5432/pbcpms` |
| User | `postgres` |
| Password | `postgres` |

Create the database if needed:

```sql
CREATE DATABASE pbcpms;
```

---

## Run backend

```bash
cd PBCPMS_AIIM

# Windows (PowerShell) — set Java 21 if needed
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

.\mvnw.cmd spring-boot:run
```

API base URL: **http://localhost:8080**  
Health: **http://localhost:8080/api/health**

---

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

App URL: **http://localhost:3000**

Environment: `frontend/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Deploy backend (Render)

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **Web Service** from the `PBCPMS_AIIM` folder (Dockerfile), **or** use `render.yaml` Blueprint.
3. Attach a Render PostgreSQL database (or set `DATABASE_URL`).
4. Environment variables:

| Variable | Example |
|----------|---------|
| `SPRING_PROFILES_ACTIVE` | `render` |
| `DATABASE_URL` | Render Postgres connection string |
| `JWT_SECRET` | long random string |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `APP_SEED_ENABLED` | `true` (first run) |

Profile file: `src/main/resources/application-render.properties`

---

## Deploy frontend (Vercel)

```bash
cd frontend
npx vercel --prod
```

Set in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Main business flow

1. Owner registers and logs in  
2. Owner adds vessel/vehicle information  
3. Admin approves or rejects the vessel  
4. Admin creates routes with fixed service fees  
5. Owner selects an approved vessel and route  
6. System calculates fee from the route  
7. Owner applies a valid coupon for payment  
8. System validates the coupon  
9. If valid → payment status becomes **PAID**  
10. Admin approves the booking and assigns a pilot  
11. Owner tracks the final booking status  

### Coupon rules

A coupon is valid only if it is:

- **ACTIVE**
- **Not expired**
- **Not already used**
- **Belongs to the same owner**
- **Amount ≥ route service fee**

After successful use, coupon status becomes **USED**.

---

## API documentation (summary)

All authenticated endpoints require header:

```
Authorization: Bearer <jwt-token>
```

### Auth

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/auth/signup` | Public | Owner registration |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/auth/me` | Auth | Current user |
| GET | `/api/auth/owners` | Admin | List owners |

### Vessels

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/vessels` | Owner | Submit vessel |
| GET | `/api/vessels/mine` | Owner | My vessels |
| GET | `/api/vessels/mine/approved` | Owner | My approved vessels |
| GET | `/api/vessels` | Admin | All vessels (`?status=PENDING`) |
| PATCH | `/api/vessels/{id}/review` | Admin | Approve / reject |

### Routes

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/routes` | Auth | All routes |
| GET | `/api/routes/active` | Auth | Active routes |
| POST | `/api/routes` | Admin | Create route |
| PUT | `/api/routes/{id}` | Admin | Update route |
| PATCH | `/api/routes/{id}/toggle` | Admin | Activate/deactivate |

### Pilots

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/pilots` | Admin | All pilots |
| GET | `/api/pilots/available` | Admin | Available pilots |
| POST | `/api/pilots` | Admin | Create pilot |
| PUT | `/api/pilots/{id}` | Admin | Update pilot |

### Coupons

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/coupons` | Admin | Issue coupon |
| GET | `/api/coupons` | Admin | All coupons |
| GET | `/api/coupons/mine` | Owner | My coupons |
| GET | `/api/coupons/verify?code=&amount=` | Owner | Verify coupon |

### Bookings

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/bookings` | Owner | Create booking + coupon payment |
| GET | `/api/bookings/mine` | Owner | My bookings |
| GET | `/api/bookings` | Admin | All bookings |
| PATCH | `/api/bookings/{id}/review` | Admin | Approve / reject / assign / complete |
| PATCH | `/api/bookings/{id}/assign` | Admin | Assign pilot |

### Dashboard

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/dashboard/admin` | Admin |
| GET | `/api/dashboard/owner` | Owner |

### Example login

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"owner@example.com\",\"password\":\"Owner@123\"}"
```

### Example booking body

```json
{
  "vesselId": 1,
  "routeId": 1,
  "couponCode": "WELCOME-5000",
  "ownerNotes": "Morning departure preferred"
}
```

---

## Features implemented

- Login & registration (owners)
- JWT authentication
- Role-based access control (ADMIN / OWNER)
- Owner dashboard
- Admin dashboard
- Vessel/vehicle management + approval
- Route management with fixed fees
- Pilot/service provider management
- Coupon management & validation
- Service booking with coupon-based payment
- Booking approval/rejection
- Pilot assignment
- Simple reports / status tracking
- **Bilingual UI (English / বাংলা)** with language switcher (preference saved in browser)

---

## Optional MySQL setup

1. Create database `pbcpms`
2. Update `PBCPMS_AIIM/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pbcpms?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

MySQL driver is already in `pom.xml`.

---

## Sample seeded data

On first startup the backend seeds:

- 1 admin, 2 owners  
- 3 vessels (2 approved, 1 pending)  
- 3 routes (Dhaka–Barisal, Chittagong–Cox's Bazar, Khulna–Mongla)  
- 3 pilots  
- 3 active coupons  

Database file is stored under `PBCPMS_AIIM/data/`.

---

