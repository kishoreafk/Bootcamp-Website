# Weaver — Backend Design Document

## Overview

Full-stack backend for a sustainable fashion transformation platform. tRPC routers with Zod validation, Drizzle ORM with SQLite, and file-based image storage.

---

## Database Schema

### Table: users

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, autoIncrement |
| phone | text | NOT NULL, UNIQUE |
| name | text | |
| stylePreference | text | |
| preferredFit | text | |
| sustainabilityPriority | integer | |
| role | text | NOT NULL, DEFAULT 'user' |
| createdAt | integer (timestamp) | DEFAULT now |

### Table: garments

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, autoIncrement |
| userId | integer | NOT NULL, FOREIGN KEY → users.id |
| name | text | NOT NULL |
| originalPurpose | text | |
| emotionalValue | text | |
| images | text | JSON array of image paths |
| createdAt | integer (timestamp) | DEFAULT now |

### Table: designs

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, autoIncrement |
| garmentId | integer | NOT NULL, FOREIGN KEY → garments.id |
| userId | integer | NOT NULL, FOREIGN KEY → users.id |
| name | text | NOT NULL |
| description | text | |
| imageUrl | text | NOT NULL |
| tags | text | JSON array |
| isSelected | integer (boolean) | DEFAULT 0 |
| createdAt | integer (timestamp) | DEFAULT now |

### Table: orders

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, autoIncrement |
| userId | integer | NOT NULL, FOREIGN KEY → users.id |
| designId | integer | NOT NULL, FOREIGN KEY → designs.id |
| garmentId | integer | NOT NULL, FOREIGN KEY → garments.id |
| measurements | text | JSON object |
| status | text | NOT NULL, DEFAULT 'placed' |
| estimatedDelivery | text | |
| createdAt | integer (timestamp) | DEFAULT now |

### Table: otps

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, autoIncrement |
| phone | text | NOT NULL |
| code | text | NOT NULL |
| expiresAt | integer (timestamp) | NOT NULL |
| verified | integer (boolean) | DEFAULT 0 |
| createdAt | integer (timestamp) | DEFAULT now |

---

## tRPC Router Structure

### Router: auth

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| sendOTP | mutation | { phone: string } | { success: boolean, message: string } | public |
| verifyOTP | mutation | { phone: string, code: string } | { success: boolean, token: string, user: User, isNewUser: boolean } | public |
| me | query | none | User | required |
| logout | mutation | none | { success: boolean } | required |

**sendOTP flow:**
1. Generate 6-digit random code
2. Store in otps table with 10-minute expiry
3. Return success (in production, would send SMS)
4. For demo: code is "123456" always, but still store in DB

**verifyOTP flow:**
1. Find latest OTP for phone where verified = false and not expired
2. Check code matches
3. Mark OTP as verified
4. Find or create user by phone
5. Generate JWT token
6. Return token + user + isNewUser flag

### Router: user

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| createProfile | mutation | { name, stylePreference, preferredFit, sustainabilityPriority } | User | required |
| updateProfile | mutation | Partial profile fields | User | required |
| getProfile | query | none | User | required |

### Router: garment

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| create | mutation | { name, originalPurpose, emotionalValue, images: string[] } | Garment | required |
| list | query | none | Garment[] | required |
| getById | query | { id: number } | Garment | required |
| delete | mutation | { id: number } | { success: boolean } | required |

### Router: design

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| generate | mutation | { garmentId: number, preferences: string[], styleDirection: string, colorPreference: string } | Design[] | required |
| list | query | none | Design[] | required |
| select | mutation | { designId: number } | { success: boolean } | required |
| getById | query | { id: number } | Design | required |

**generate flow (mock):**
1. Validate garment belongs to current user
2. Simulate 2-second delay
3. Return 4 mock designs with pre-generated images
4. Store designs in database

### Router: order

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| create | mutation | { designId: number, garmentId: number, measurements: object } | Order | required |
| list | query | none | Order[] | required |
| getById | query | { id: number } | Order | required |
| updateStatus | mutation | { id: number, status: string } | Order | admin |

### Router: upload

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| saveImages | mutation | { garmentId: number, imageData: string[] (base64) } | { imageUrls: string[] } | required |

### Router: admin

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| getStats | query | none | { totalUsers, totalOrders, totalGarments, totalDesigns, pendingOrders, conversionRate } | admin |
| listUsers | query | { page?: number, limit?: number, search?: string, role?: string } | { users: User[], total: number } | admin |
| listOrders | query | { page?: number, limit?: number, status?: string, search?: string } | { orders: Order[], total: number } | admin |
| listDesigns | query | { page?: number, limit?: number } | { designs: Design[], total: number } | admin |
| listImages | query | { page?: number, limit?: number } | { images: {url, garmentId, garmentName, createdAt}[], total: number } | admin |
| getOrderDetail | query | { id: number } | Order + user + design + garment | admin |

---

## Middleware

### Authentication Middleware

- Reads `x-auth-token` header or `auth-token` cookie
- Verifies JWT with secret from env
- Attaches `user` to context if valid
- Throws UNAUTHORIZED (401) if no valid token

### Admin Middleware

- Runs after auth middleware
- Checks `user.role === 'admin'`
- Throws FORBIDDEN (403) if not admin

---

## Auth System

### OTP Flow

```
User enters phone → POST /api/trpc/auth.sendOTP
Server stores OTP code → Returns success
User enters OTP → POST /api/trpc/auth.verifyOTP
Server validates → Creates/finds user → Returns JWT
Frontend stores token in localStorage + sets cookie
```

### JWT

- Algorithm: HS256
- Payload: { userId: number, phone: string, role: string }
- Expiry: 7 days
- Secret: from .env JWT_SECRET

### Context Builder

```
1. Read auth token from header/cookie
2. If present, verify and decode
3. Look up user in DB
4. Attach { user: User | null } to context
```

---

## Image Storage

For this prototype, store images in the `public/uploads/` directory with generated filenames.

- Upload endpoint receives base64 image data
- Server saves to disk with format: `{timestamp}-{random}.{ext}`
- Returns public URL path
- In production: migrate to S3/cloud storage

---

## API Implementation Plan

### Step 1: Database Setup

1. Define schema in `db/schema.ts`
2. Run `npm run db:push` to create tables

### Step 2: Auth Router

1. Implement sendOTP (mock — always returns 123456)
2. Implement verifyOTP (creates/finds user, generates JWT)
3. Implement me (returns current user)
4. Implement logout (clears session)

### Step 3: User Router

1. Implement createProfile
2. Implement getProfile

### Step 4: Garment Router

1. Implement create with image handling
2. Implement list (returns user's garments)
3. Implement getById

### Step 5: Design Router

1. Implement generate (returns mock designs with images)
2. Implement list
3. Implement select

### Step 6: Order Router

1. Implement create
2. Implement list
3. Implement getById

### Step 7: Admin Router

1. Implement getStats (aggregation queries)
2. Implement listUsers with pagination
3. Implement listOrders with pagination
4. Implement updateStatus
5. Implement getOrderDetail

### Step 8: Frontend Integration

1. Set up tRPC client with auth header
2. Create useAuth hook
3. Connect all pages to tRPC queries/mutations
4. Implement loading and error states

---

## Data Flow Summary

```
Login → sendOTP + verifyOTP → JWT → me → [new user? → createProfile]
Home → garment.list → display cards
Upload → garment.create (with images) → garment stored
Preferences → design.generate → 4 designs stored → design.list
Select Design → design.select → navigate to measurements
Measurements → order.create → order stored → confirmation page
```

---

## Error Handling

| Error | Code | Message |
|-------|------|---------|
| Invalid OTP | 400 | "Invalid or expired verification code" |
| Unauthorized | 401 | "Please sign in to continue" |
| Forbidden | 403 | "You don't have permission to access this" |
| Not Found | 404 | "Resource not found" |
| Validation | 400 | Zod error message |
| Server | 500 | "Something went wrong" |

---

## Implementation Order

1. Initialize backend with webapp-building + backend-building
2. Set up database schema
3. Implement auth router (OTP flow)
4. Implement user router (profile)
5. Implement garment router (uploads)
6. Implement design router (generation)
7. Implement order router (confirmation)
8. Implement admin router (dashboard)
9. Connect frontend to all APIs
10. Test full flow end-to-end
