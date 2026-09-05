# Production Release Checklist

## 1. Pre-Deployment
- [ ] Ensure all code is merged into `main` and CI pipeline passes.
- [ ] Verify `DEBUG=False` in production `.env`.
- [ ] Confirm no secrets (e.g. `STRIPE_SECRET_KEY`) are hardcoded or tracked in Git.
- [ ] Confirm `STRIPE_WEBHOOK_SECRET` is configured for the production Stripe endpoint.
- [ ] Ensure database backups are verified and up-to-date.

## 2. Deployment
- [ ] Pull latest changes on production server.
- [ ] Rebuild Docker containers: `docker-compose -f docker-compose.prod.yml build`
- [ ] Run containers in detached mode: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Check logs for immediate crashes: `docker-compose -f docker-compose.prod.yml logs -f web`

## 3. Post-Deployment Smoke Tests
- [ ] Check `/health/` endpoint returns HTTP 200 `{"status": "ok"}`.
- [ ] Log in as a test user and verify session establishment.
- [ ] Navigate to the Billing dashboard and verify plans render.
- [ ] Generate a test checkout session and verify redirection to Stripe.
- [ ] Ensure static files and media are served correctly.

## 4. Rollback Readiness
- [ ] If issues occur, verify the Docker image rollback procedure in `DEPLOYMENT.md` is understood.
- [ ] Do NOT rollback database migrations automatically. Refer to DBA runbooks for PITR (Point-In-Time Recovery) if necessary.
