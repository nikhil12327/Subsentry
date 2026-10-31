# Remediation checklist and implementation status

Status definitions: `NOT_IMPLEMENTED` means absent; `IN_PROGRESS` means code exists but the workflow is incomplete; `IMPLEMENTED` means code exists; `TESTED` means relevant automated checks passed; `VERIFIED` means the complete workflow was demonstrated against its required dependencies.

## Phase 1 — persistence and backend foundation

| Module | Status | Evidence / remaining work |
|---|---|---|
| PostgreSQL Compose service | IMPLEMENTED | PostgreSQL 16 service, persistent named volume, health check. Docker is not installed in the current execution environment. |
| Prisma schema and initial migration | TESTED | Schema validated with Prisma 6.19; initial SQL migration checked in. Migration has not been applied to PostgreSQL here. |
| Seed data | IMPLEMENTED | Idempotent upserts for Brightloop demo data; DB execution not available. |
| Database connection | NOT_IMPLEMENTED | `GET /api/health` is process health only; it does not currently check database connectivity. |
| Tenant relationships and indexes | IMPLEMENTED | Organization foreign keys, composite indexes, unique constraints in Prisma models. Not integration-tested. |
| API auth/authorization and organization scope | IN_PROGRESS | API middleware and route scoping exist; cross-tenant isolation, reset misuse, and permissions lack DB integration tests. |
| Billing and payments | IN_PROGRESS | Basic routes exist; race safety, webhooks, discount limits, refund and reconciliation flows remain absent. |

## Frontend and business modules

| Module | Status | Evidence / remaining work |
|---|---|---|
| Operations dashboard UI | IN_PROGRESS | Single React view; key figures and tables are hard-coded demo content. |
| Frontend API integration | NOT_IMPLEMENTED | No API service or auth UI; browser local storage still backs demo subscription additions. |
| Customers, catalogue, taxes, discounts, quotations | IN_PROGRESS | Partial customer/product/plan endpoints; variants, full CRUD, tax/discount screens and quotations absent. |
| Subscriptions, invoices, payments | IN_PROGRESS | Some REST routes and guarded transitions; no complete user workflows. |
| Reconciliation, notifications, durable jobs, refunds, gateway | NOT_IMPLEMENTED | No persistent implementations. |
| Revenue integrity, risk and analytics | IN_PROGRESS | Limited deterministic overdue/due flags and aggregate endpoint; full requested calculations/UI absent. |

## Verification record

- `npm run typecheck`: passed on 2026-10-31.
- `npm test`: five billing-rule tests passed on 2026-10-31.
- `npm run build`: passed on 2026-10-31 (Vite warns the main JS chunk exceeds 500 kB).
- `npx prisma validate`: passed on 2026-10-31 with `DATABASE_URL` set.
- `GET /api/health`: passed; this only verifies the HTTP process.
- PostgreSQL migration, seed, integration tests, concurrent billing/payment tests, browser end-to-end tests, and performance tests: not run because Docker/PostgreSQL is unavailable here.

Preserved functionality: existing dashboard visual design, authentication/session implementation, customer/catalogue/plan/subscription/invoice/payment endpoints, PDF generation, period unique key, and billing date unit tests. The dashboard remains illustrative and must not be used for live financial decisions.
