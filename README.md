# SUBSENTRY

Subscription operations and revenue assurance for Brightloop Software. This repository contains a React + TypeScript dashboard, an Express REST API, a PostgreSQL schema and initial migration, secure session-based authentication, seeded demo records, Docker Compose for the database, and a browser-local dashboard preview.

## Preview

The dashboard preview is available at `http://localhost:5173/` while the development server is running. It is a responsive operations UI with revenue overview, subscription search/filtering, and a create-subscription dialog. **The current dashboard still uses illustrative metrics and browser-local storage**; it is not yet bound to the PostgreSQL API.

## Requirements

- Node.js 20+
- npm 10+
- Docker Desktop (or a PostgreSQL 16 instance)

## Setup

```sh
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

On Windows PowerShell, create `.env` by copying `.env.example` with `Copy-Item .env.example .env`.

The web app runs on port 5173; the API runs on port 4000. `GET /api/health` is the health endpoint. Set `APP_ORIGIN` to the frontend origin. Use a unique, strong `ADMIN_PASSWORD` in `.env` before seeding.

Seeded demo administrator:

- Email: `admin@brightloop.example`
- Password: `ChangeMe123!` (development only; replace before any shared deployment)

The seed creates Brightloop Software, four subscription plans, a product and variant, a demo tax rule, six customers/subscriptions, and one overdue invoice. Re-running the seed is safe for the inserted catalogue and demo records.

## Useful commands

```sh
npm run dev          # API and Vite dashboard
npm run build        # TypeScript check and production frontend build
npm run typecheck    # TypeScript check for frontend, API and seed
npm run db:generate  # Prisma client generation
npm run db:migrate   # Apply schema migration in development
npm run db:seed      # Load demo data
npm test             # Billing calculation/date unit tests
npm run typecheck    # TypeScript check
npm run build        # TypeScript check and frontend production build
npm run preview      # Serve the production frontend build
```

## Implemented API surface

- `POST /api/auth/login`, `/register`, `/logout`, `/forgot-password`, `/reset-password`; `GET /api/auth/me`
- `GET /api/dashboard`
- `GET|POST /api/customers`, `GET|POST /api/products`, `GET|POST /api/plans`, `POST /api/staff` (admin-only)
- `GET|POST /api/subscriptions`, `PATCH /api/subscriptions/:id/state` (guarded lifecycle transitions)
- `POST /api/billing/preview`, `POST /api/billing/run`
- `GET /api/invoices`, `PATCH /api/invoices/:id/state`, `GET /api/invoices/:id/pdf`
- `GET|POST /api/payments`
- `GET /api/integrity`, `GET /api/audit`

Every business query is scoped to the authenticated organization; customer invoice, payment, and subscription reads are scoped to the signed-in customer. Role checks protect admin-only catalogue writes and billing runs. Passwords use bcrypt; random session tokens are stored as hashes and delivered in HttpOnly cookies. The billing endpoint uses a unique organization/idempotency key per subscription billing period. Payment allocations and invoice balance updates run in a database transaction.

## Scope still outstanding

This is not yet the complete production platform described in the prompt. The current frontend is not connected to the REST API, so dashboard values are demo figures and its create-subscription form saves to browser local storage. The API does not yet implement quotations/templates, complete subscription transitions, discount application and redemption limits, tax configuration UI and inclusive tax rules, bank CSV reconciliation, refunds, email delivery, Razorpay, a durable billing queue, staff invitation/management, or complete CRUD. Password reset token delivery is development-only (the token is returned by the API outside production); configure email before deployment. No automated test suite, end-to-end test, production deployment, or performance benchmark has been completed. Do not use this version as a live financial system.

## Deployment

Run the API and frontend behind HTTPS, use a managed PostgreSQL service, set secure production environment values, configure `APP_ORIGIN`, SMTP delivery, backups, logging, and monitoring. Set `NODE_ENV=production` so session cookies are marked Secure. Build the frontend with `npm run build` and serve `dist/` with a static host; run `npm start` for the API. The demo credentials must be replaced and the seeded demo data reviewed before any shared environment.
