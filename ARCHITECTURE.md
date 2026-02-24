# Architecture Overview

This document explains the architectural design of the authenticated Job Application Tracker.

The system emphasizes:
- Clear separation of concerns
- Server-side data processing
- Secure session-based authentication
- Scalable query handling

---

## 1. High-Level System Flow
```
Browser
↓
Next.js App Router
├─ Server Components (data fetch, filtering, pagination)
├─ Client Components (UI interaction & state)
↓
Routes Handlers (/api/*)
↓
Repository Layer (applicationsRepo)
↓
MongoDB Atlas
```
Authentication layer:
```
NextAuth (session-based)
↓
Protected API Routes + Admin route access
```

---

## 2. Routing Structure
### Public Routes
- `/applications` → Read-only list
- Server-rendered
- Supports filtering & pagination

### Admin Routes
- `/admin/applications`
- `/admin/applications/new`
- `/admin/applications/edit/[id]`
Admin routes require a valid authenticated session.

---

## 3. Server vs Client Responsibilities
### Server Responsibilities
- Read `searchParams`
- Build MongoDB query object
- Apply:
    - Filter conditions
    - Sorting
    - `skip`
    - `limit`
- Calculate total document count
- Return serialized data
All filtering and pagination are executed on the server.

No client-side slicing of full datasets.

### Client Responsibilities
Client components handle:
- UI interactivity
- Filter control inputs
- Pagination navigation
- Delete modal state machine
- Toast notifications
- Session detection via `useSession()`
Client does not perform database querying logic.

---

## 4. Authentication & Authorization
Authentication is implemented using **NextAuth (session-based)**.

### Session Model
- Session stored in HTTP-only cookies
- Admin access derived from server-validated session
- No client-side secrets
- No localStorage-based auth

### UI Gating Pattern
Hydration-safe rendering:
```
mounted && isAdmin
```

### API Protection
Mutation routes validate session before allowing
- `POST`
- `PUT`
- `DELETE`
Public users can only perform `GET`.

---

## 5. API Layer
REST-style route handlers:
```
/api/applications
/api/applications/[id]
```
Supported operations:
- `GET` → List (filtered + paginated)
- `POST` → Create (admin-only)
- `PUT` → Update (admin-only)
- `DELETE` → Delete (admin-only)

Authentication route:
```
/api/auth/[...nextAuth]
```
Routes remain thin and delegate data logic to the repository layer.
---

## 6. Repository Layer
`applicationsRepo.js` abstracts all database access.

Responsibilities:
- Construct filtered queries
- Apply pagination (`skip`, `limit`)
- Handle sorting
- Serialize ObjectId to string
- Manage timestamps (`createdAt`, `updatedAt`)

This provides:
- Cleaner route handlers
- centralized data logic
- Easier extensibility

---

## 7. Data Model
```
{
  companyName: string,
  jobTitle: string,
  workArrangement: string,
  applicationStatus: string,
  applicationDate: Date,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}

```
- `createdAt` set on creation
- `updatedAt` updated on modification
- `_id` serialized before returning to client

---

## 8. Database Access
Required variables:
- MongoDB Atlas
- Shared `clientPromise` pattern
- Global caching in development to prevent multiple connections

Connection logic isolated in:
```
lib/mongodb.js
```

---

## 9. Filtering & Pagination Strategy
Server-side execution ensures:
- No overfetching
- Consistent page counts
- Scalable dataset handling
- Query efficiency via indexed fields

Pagination pattern:
```
page → calculate skip → limit results → compute total pages
```
Filtering and pagination are combined within a single query pipeline.

---

## 10. Delete Interaction Model
Custom modal-driven destructive flow:
State machine:
```
idle → confirm → loading → successs
```
Features:
- Focus trapping
- Escape handling
- Backdrop cancellation
- Aritificial success delay
- Focus restoration
- `router.refresh()` after deletion
Designed to mimic production-grade UX patterns.

## 11. Environment Configuration
Required variables:
```
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL
```
- Local: `.env.local`
- Docker: injected via compose or `--env-file`

---

## 12. Containerization
Docker support is included in main branch.
- `Dockerfile`
- Optional `docker-compose.yml`
- Environment variables injected at runtime
This allows consistent development and deployment environments.

---

## 13. Architectural Principles
This project prioritizes:
- Server-side data processing
- Secure session-based authentication
- Clear layering (Router → API → Repository → DB)
- Scalability awareness
- Maintainability
Over:
- Client-heavy data logic
- Overengineering
- Feature bloat

