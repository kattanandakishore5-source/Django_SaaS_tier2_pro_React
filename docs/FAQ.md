# Frequently Asked Questions

### Why not use JWTs for authentication?
We use Django's built-in session authentication (with `HttpOnly` cookies) because it is inherently immune to XSS attacks that target `localStorage`. It also allows us to instantly revoke sessions server-side.

### Do I need to use Docker?
No. While `docker-compose` is provided for the simplest setup (especially for running Postgres, Redis, and Celery simultaneously), you can run all services natively on your host machine.

### How do I change the default plans?
1. Create the new Products/Prices in the Stripe Dashboard.
2. Add the Price IDs to your `.env` file.
3. Update `apps/billing/entitlements.py` to reflect your new tier structures and limits.

### How do I debug Stripe webhooks locally?
Use the Stripe CLI: `stripe listen --forward-to localhost:8000/billing/webhook/`. Ensure the generated webhook secret is pasted into your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### Why am I getting CORS errors on the frontend?
Ensure that your frontend URL (e.g., `http://localhost:5173` or `http://localhost:3000`) is exactly listed in both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in your `.env`.
