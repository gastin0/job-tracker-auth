# Architecture Overview

This document explains the core architectural decisions of the Job Application Tracker.

---

## High-Level Flow
```
Browser
↓
Next.js App Router
├─ Server Components (data fetching)
├─ Client Components (interaction, state)
↓
API Routes (/api/applications)
↓
MongoDB Atlas
```

---

## App Router Design
- **Server Pages**
    - Fetch data directly from API routes
    - No client-side data fetching for initial render
- **Client Components**
    - Handle interactivity (filters, delete, admin UI)
    - Use hooks (`useState`, `useEffect`)

Example pattern:
- `page.jsx` (Server) → renders
- `ApplicationsClient.jsx` (Client)

---

## Admin vs Read-Only Model
- Public users: read-only access
- Admin users: create, edit, delete
- Admin status derived client-side from `localStorage`
- UI gated with:
```
mounted && isAdmin
```
This avoids hydration issues while keeping auth simple.

---

## API Layer
- REST-style endpoints under:
```
/api/applications
```
Supported operations:
- `GET` – list application
- `POST` – create application
- `PUT` – update by ID
- `DELETE` – remove by ID
Routes are stateless and operate directly on MongoDB

---

## Data Model
Canonical schema:
```json
{
  companyName: string,
  jobTitle: string,
  workArrangement: string,
  applicationStatus: string,
  applicationDate: Date,
  notes: string
}
```

---

## Database access
- MongoDB Atlas
- Shared `clientPromise` pattern
- Global caching in development to avoid multiple ocnnections

---

## Delete Interaction Model
- Custom confirmation modal
- Explicit state machine
- Async delete with visual feedback
- Focus restored after completion

---

## Environment Configuration
Required variables:
```
MONGODB_URI
ADMIN_SECRET
```
- Local dev: `.env.local`
- Docker: injected via `env_file` or `--env-file`

---

## Extensibility
Designed to allow:
- Auth upgrade (JWT/sessions)
- Pagination
- Role-based access
- CI/CD integration

---

## Scope
This architecture prioritize:
- Clarity
- Correctness
- Portfolio readability
Over unnecessary abstraction.
