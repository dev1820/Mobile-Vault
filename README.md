# Mobile Vault

Website for Mobile Vault, a premium new & used iPhone reseller in Pakistan. Customers browse
listings and buy via WhatsApp/call; the owner manages listings (add, mark sold, delete) through a
password-protected admin dashboard.

- `backend/` — Spring Boot 4 REST API (Java 21, Maven)
- `frontend/` — React + TypeScript + Tailwind CSS (Vite)
- `docker-compose.yml` — local PostgreSQL for development

## Prerequisites

- Java 21+
- Node 20+ / npm
- Docker (for local Postgres)

## 1. Start the database

```bash
docker compose up -d
```

This starts Postgres on `localhost:5433` (db `mobilevault`, user/password `mobilevault`). Port
5433 (not the default 5432) is used to avoid clashing with any Postgres already running natively
on your machine — change it in `docker-compose.yml` and `DB_URL` if 5433 is also taken.

## 2. Run the backend

From `backend/`:

```bash
export JWT_SECRET="$(openssl rand -base64 32)"
export ADMIN_SEED_USERNAME=admin
export ADMIN_SEED_PASSWORD="choose-a-strong-password"
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. On first boot it seeds one admin account from
`ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD` — these are only needed the first time (once an admin
user exists in the database, the seeder no-ops).

Verify: `curl http://localhost:8080/api/products` should return an empty page of results.

Other environment variables (all have local-dev defaults except `JWT_SECRET`, which is required):

| Variable | Purpose | Dev default |
| --- | --- | --- |
| `JWT_SECRET` | Signing key for admin login tokens (32+ chars) | none — required |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | Postgres connection | `jdbc:postgresql://localhost:5433/mobilevault` / `mobilevault` / `mobilevault` |
| `APP_UPLOAD_DIR` | Where product photos are stored on disk | `./uploads` |
| `APP_CORS_ALLOWED_ORIGINS` | Origins allowed to call the API | `http://localhost:5173` |
| `JWT_EXPIRATION_MS` | Admin session length | `86400000` (24h) |

## 3. Run the frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. It talks to the backend via `VITE_API_ORIGIN` in `frontend/.env`
(defaults to `http://localhost:8080`). Update `VITE_WHATSAPP_NUMBER` and `VITE_PHONE_NUMBER` in
that file to your real business contact numbers before going live.

## Using it

- Public site: browse `/catalog`, view a listing at `/product/:id`, contact the seller via the
  WhatsApp/Call buttons.
- Admin: log in at `/admin/login` with the seeded credentials, then add/edit listings, upload
  photos, mark items Sold/Available, and delete listings from `/admin`.

## Notes

- No online payment/cart — purchases are closed over WhatsApp/phone, matching how phones are
  typically resold in Pakistan.
- Product photos are stored on local disk under `backend/uploads/` for this MVP; swap in cloud
  object storage later if you outgrow a single server.
- Database schema is managed by Flyway migrations in `backend/src/main/resources/db/migration`.
