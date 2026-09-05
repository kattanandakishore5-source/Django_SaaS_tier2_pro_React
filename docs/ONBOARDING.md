# 15-Minute Onboarding to Success

Welcome! This guide will take you from a fresh clone to a working local SaaS in 15 minutes.

## Minute 0-5: Environment Setup
1. `git clone` the repository.
2. Run `cp .env.example .env`.
3. Fill out the `STRIPE_*` variables by creating two quick test products in your Stripe Dashboard.
4. Keep the default Postgres/Redis config if using Docker.

## Minute 5-10: Spin Up Services
1. Run `docker-compose up -d db redis`. Wait a few seconds for the database to boot.
2. Run migrations: `python manage.py migrate`.
3. Start the backend: `python manage.py runserver` (or `docker-compose up web celery`).

## Minute 10-15: Frontend & First User
1. Open a new terminal, `cd frontend`.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:5173` (or the port Vite provides).
4. Click **Sign Up** to create your first user.
5. Go to the Billing tab and test the Stripe Checkout flow!

**Success!** You now have a working, billing-enabled, production-hardened SaaS. Head to `docs/ENTITLEMENTS.md` to see how to start gating your custom features.
