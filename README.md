# JOB APPLICATION TRACKER

A full-stack job application tracking app build with Next.js App Router and MongoDB, designed to demonstrate clean architecture, RESTful APIs, and thoughtful UX for real-world CRUD workflows.

This project focuses on clarity, correctness, and user experience, rather than feature bloat.

## FEATURES
- Public read-only application list
- Admin-only CRUD opeations
- Stateless REST API with proper HTTP semantics
- Accessible destructive actions
  Keyboard support (ESC key)
  Focus trapping and focus restoration
- Skeleton loading & empty states
- Clean separation between:
  Server components (data fetching)
  Client components (interactivity)

## TECH STACK
- Framework: Next.js (App Router)
- Frontend: React, Tailwind CSS
- Backend: Next.js API Routes
- Database: MongoDB Atlas
- Styling: Tailwind CSS
- Deployment: -

## ARCHITECTURE OVERVIEW
App Router Structure
- Server Components are used for data fetching and routing
- Client Componentshandle state, hooks, and user interaction

Example:
- applications/page.jsx - server component (fetches data)
- ApplicationsClient.jsx - client wrapper (filters, admin logic)
- ApplicationsTable.jsx - presentational component

## Admin vs Public Access
- The /applications page is public and read-only
- Admin-only UI (create, edit, delete) is conditionally enabled
- Admin detection is handled client-side using a secret stored in localStorage
- UI gating is hydration-safe using a mounted check

This approach keeps the backend stateless while still allowing admin functionality for a personal project.


## API DESIGN
All data operations are handled through RESTful API routes under:
- GET - fetch all applications
- POST - create a new application
- PUT - update an application
- DELETE - delete an application

The API uses:
- Consistent request/response shapes
- Proper ObjectId serialization
- Idempotent behavior where applicable


## UX & ACCESSIBILITY HIGHLIGHTS
- Custom delete confirmation modal
- Keyboard navigation
- - Escape to close
  - Focus trapped inside modal
  - Focus restored to triggering element
- Explicit loading state for destructive actions
- Skeleton loaders prevent layout shifts

These choices were made intentionally to reflect production-grade UX thinking.


## DATA MODEL
Each application follows a fixed schema:
- companyName
- jobTitle
- workArrangement
- applicationStatus
- applicationDate
- notes

Schema consistency is enforced across API and UI.


## GETTING STARTED
```bash
git clone
cd job-tracker
npm install
npm run dev
```



```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
