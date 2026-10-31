# REST API

Base URL: `http://localhost:4000/api`. JSON requests use `Content-Type: application/json`; authentication uses an HttpOnly `subsentry` cookie.

| Method | Route | Roles | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Process health |
| POST | `/auth/login` | Public | Create session |
| POST | `/auth/register` | Public | Register customer in seeded workspace |
| POST | `/auth/logout` | Authenticated | Revoke sessions |
| GET | `/auth/me` | Authenticated | Current identity |
| POST | `/auth/forgot-password` | Public | Generate one-hour reset token |
| POST | `/auth/reset-password` | Public | Consume reset token and revoke sessions |
| GET | `/dashboard` | Admin, staff | Aggregate dashboard counts |
| GET, POST | `/customers` | Admin, staff | List/create customers |
| GET, POST | `/products` | Admin read/write | List/create products |
| GET, POST | `/plans` | Admin read/write | List/create plans |
| POST | `/staff` | Admin | Create staff account |
| GET, POST | `/subscriptions` | Scoped read; admin/staff create | List/create subscription |
| PATCH | `/subscriptions/:id/state` | Admin, staff | Enforced lifecycle transition |
| POST | `/billing/preview` | Admin, staff | Preview due subscription invoices |
| POST | `/billing/run` | Admin | Create due invoices idempotently |
| GET | `/invoices` | Scoped read | List invoices |
| PATCH | `/invoices/:id/state` | Admin, staff | Confirm/cancel an eligible invoice |
| GET | `/invoices/:id/pdf` | Scoped read | Download invoice PDF |
| GET, POST | `/payments` | Scoped read; admin/staff create | List/allocate payment |
| GET | `/integrity` | Admin, staff | Deterministic overdue/renewal/due flags |
| GET | `/audit` | Admin | Recent audit events |

Errors return `{ "error": "CODE" }`; validation failures also include Zod details. Lists are capped at 100 records; customer listing supports `page`, `limit`, and `q`.
