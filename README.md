# JOB APPLICATION TRACKER

A full-stack job application tracking app build with **Next.js App Router** and **MongoDB**, designed to demonstrate clean architecture, RESTful APIs, and thoughtful UX for real-world CRUD workflows.

> This project focuses on **clarity, correctness, and user experience**, rather than feature bloat.

## Features
- Public read-only application list
- Admin-only CRUD opeations
- Stateless REST API with proper HTTP semantics
- Accessible destructive actions
  - Keyboard support (ESC key)
  - Focus trapping and focus restoration
- Skeleton loading & empty states
- Clean separation between:
  - Server components (data fetching)
  - Client components (interactivity)

## Tech Stack
- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Deployment**: -

## Architecture Overview
App Router Structure
- Server Components are used for **data fetching and routing**
- Client Componentshandle **state, hooks, and user interaction**

Example:
- [`applications/page.jsx`](.src/app/applications/page.js) - server component (fetches data)
- [`ApplicationsClient.jsx`](.src/app/components/ApplicationsClient.jsx) - client wrapper (filters, admin logic)
- [`ApplicationsTable.jsx`](.src/app/components/ApplicationsTable.jsx) - presentational component

## Admin vs Public Access
- The [`/applications`](.src/app/applications/) page is **public and read-only**
- Admin-only UI (create, edit, delete) is conditionally enabled
- Admin detection is handled **client-side** using a secret stored in `localStorage`
- UI gating is hydration-safe using a `mounted` check

This approach keeps the backend stateless while still allowing admin functionality for a personal project.


## API Design
All data operations are handled through RESTful API routes under:
[`/api/applications](.src/app/api/applications)

Supported operations:
- `GET` - fetch all applications
- `POST` - create a new application
- `PUT` - update an application
- `DELETE` - delete an application

The API uses:
- Consistent request/response shapes
- Proper ObjectId serialization
- Idempotent behavior where applicable


## UX & Accessibility Highlights
- Custom delete confirmation modal
- Keyboard navigation
  - Escape to close
  - Focus trapped inside modal
  - Focus restored to triggering element
- Explicit loading state for destructive actions
- Skeleton loaders prevent layout shifts

These choices were made intentionally to reflect **production-grade UX thinking**.


## Data Model
Each application follows a fixed schema:
- `companyName`
- `jobTitle`
- `workArrangement`
- `applicationStatus`
- `applicationDate`
- `notes`

Schema consistency is enforced across API and UI.


## Getting Started
```bash
git clone
cd job-tracker
npm install
npm run dev
```
Create a `.env.local` file:
```js
MONGODB_URI=your_mongodb_connection_string
```

## Project Scope & Trade-offs
This project intentionally:
- Does not include full authentication (JWT/session)
- Uses admin gating instead of multi-user auth
- Focuses on architecture, UX, and correctness

These trade-offs were made to prioritize **code clarity and maintainability** within limited scope.

## Screenshots

--- LATER ---

## Why This Project Exists
This project was built to demonstrate:
- Practical full-stack development
- Understanding of Next.js App Router constraints
- Clean REST API design
- UX and accessibility awareness

It is actively iterated as part of a learning and portfolio process
