# Job Application Tracker

[![CI](https://github.com/gastin0/job-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/gastin0/job-tracker/actions/workflows/ci.yml) ![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)

A full-stack job application tracking app build with **Next.js App Router**, **MongoDB**, and **Tailwind CSS**. Designed as a portfolio project with clean architecture, RESTful APIs, admin/read-only separation, and thoughtful UX for real-world CRUD workflows.

> This project focuses on **clarity, correctness, and user experience**, rather than feature bloat.

---

## ✨ Highlight
- **Next.js App Router** (Server + Client Components)
- **RESTful API routes** (`GET / POST / PUT / DELETE`)
- **MongoDB Atlas** with shared `clientPromise` connection pattern
- **Admin vs read-only UI separation** (client-side gating)
- **Accessible UX** (keyboard navigation, focus management)
- **Continous Integration** (automated linting via Github Actions)
- **Dockerized setup** (via dedicated branch)

---

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Toolong**: ESLint, PostCSS, GitHub Actions (CI)
- **Deployment-ready**: Docker

---

##  🧠 Data Model (Canonical Schema)
Each application follows a fixed schema:
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


## 📸 Screenshots

### Public Applications View
![Public applications list](./screenshots/applications-public.png)

### Admin View (CRUD Enabled)
![Admin applications view](./screenshots/applications-admin.png)

*Admin-only actions are conditionally enabled on the same route.*

### Delete Confirmation Modal
![Delete confirmation modal](./screenshots/delete-confirmation-modal.gif)

*Keyboard-accessible destructive action flow with focus management.*

### Application Form
![Application form](./screenshots/application-form.png)

### Empty State
![Empty state](./screenshots/empty-state.png)
*Empty state clearly indicates that no results match the active filters and provide a reset action.*


---

## 📂 Project Structure (Simplified)
```
src/
├─ app/
│ ├─ applications/
│ │ ├─ page.jsx               # Public read‑only list (Server)
│ │ ├─ new/                   # Admin‑only create page
│ │ └─ edit/[id]/             # Admin‑only edit page
│ ├─ api/applications/        # REST API routes
│ └─ layout.jsx
├─ components/
│ ├─ ApplicationsClient.jsx   # Client logic + admin gating
│ ├─ ApplicationsTable.jsx    # Presentational table
│ ├─ ApplicationsFilters.jsx
│ └─ ConfirmDeleteModal.jsx   # Accessible delete flow
├─ lib/mongodb.js             # MongoDB clientPromise
└─ public/icons/
```

---

## 🏗️ Architecture
This project follows a clear separation between server and client responsibilities using the Next.js App Router.

For detailed architectural decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🔐 Admin vs Read-Only Architecture
- Public can only view applications
- Admin features (create, edit, delete) are gated client-side
- Admin access is derived from a secret stored `localStorage`
- UI hydration safety via `mounted && isAdmin`

---


## 🗑️ Delete UX
- Custom confirmation modal (now `window.confirm`)
- Focus trapping + Escape handling
- Backdrop click to cancel
- Delete state machine
- Artificial success delay
- Focus restored to triggering button

---

## ✅ Continous Integration
This project uses **GitHub Actions** for automated code quality:
- Linting runs automatically on every push and pull request
- ESLint checks ensure code standards are maintained
- Pre-merge validation prevents broken code from entering main branch

View the [CI workflow](.github/workflows/ci.yml) for details.

## 🐳 Docker Support
Docker configuration lives in a dedicated branch:
```bash
branch: job-tracker-docker
```


---


## 📌 Project Scope & Trade-offs
This project intentionally:
- Does not include full authentication (JWT/session)
- Uses admin gating instead of multi-user auth
- Focuses on architecture, UX, and correctness

These trade-offs were made to prioritize **code clarity and maintainability** within limited scope.

---


## 🚀 Getting Started
```bash
git clone <repository-url>
cd job-tracker
npm install
npm run dev
```

Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET=your_admin_secret
```


---

## 🧠 Why This Project Exists
This project was built to demonstrate:
- Practical full-stack development
- Understanding of Next.js App Router constraints
- Clean REST API design
- UX and accessibility awareness

It is actively iterated as part of a learning and portfolio process
