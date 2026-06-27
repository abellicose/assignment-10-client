# Nestify — Property Rental & Booking Platform (Client)

Nestify is a property rental and booking marketplace that connects tenants and
property owners. Tenants can discover, favorite, book and pay for rental
properties; owners can list and manage properties and track earnings; admins
moderate listings, manage users and monitor transactions.

## Live URL

> Set after deployment: `https://<your-app>.web.app`

## Server Repository

> `https://github.com/<you>/property-rental-server`

## Purpose

Provide a transparent, secure rental marketplace with role-based access
(Tenant / Owner / Admin), JWT-protected APIs, Stripe payments, reviews,
favorites and analytics.

## Key Features

- Firebase email/password and Google social login (new social users default to Tenant)
- JWT-secured API requests via an Axios interceptor
- Role-based dashboards for Tenant, Owner and Admin
- Home page with animated banner + search, featured properties, why-choose-us,
  top locations, rental statistics and dynamic customer reviews
- All Properties page with backend search, type filter, price sort and pagination
- Private property details with image gallery, favorites, booking and reviews
- Booking workflow with Stripe payment, transaction records and success page
- Owner analytics with a Recharts monthly-earnings line chart
- Admin moderation with rejection-feedback modal (owners can view feedback)
- Reload-safe private routes (auth state persists) and dedicated loading / error / 404 pages
- Fully responsive across mobile, tablet and desktop

## Tech Stack

- Next.js (App Router) + React
- Tailwind CSS v4
- Firebase Authentication
- TanStack Query + Axios
- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Framer Motion (`motion`)
- Recharts
- react-hook-form, react-hot-toast, SweetAlert2, react-icons

## Environment Variables

Create `.env.local` based on `.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_IMGBB_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## npm Packages

`next`, `react`, `react-dom`, `tailwindcss`, `firebase`, `axios`,
`@tanstack/react-query`, `@stripe/stripe-js`, `@stripe/react-stripe-js`,
`motion`, `recharts`, `react-hook-form`, `react-hot-toast`, `sweetalert2`,
`react-icons`, `swiper`.
