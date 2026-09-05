# Testing Guide

We maintain strict test coverage for both the Django backend and the React frontend.

## Backend (Django)
Tests are written using Django's built-in `TestCase` and DRF's `APIClient`.

Run tests:
```bash
python manage.py test
```

Key areas covered:
- **Entitlements & Limits**: Ensuring race conditions via `select_for_update` are tested securely.
- **Stripe Webhooks**: Validating signature handling and subscription state mutations.

## Frontend (React/Vite)
We use **Vitest**, **React Testing Library**, and **MSW** (Mock Service Worker).

Run tests:
```bash
cd frontend
npm run test
```

### MSW Integration
MSW intercepts HTTP requests in testing, simulating our Django API.
Check `frontend/src/test/handlers.ts` to see or add mock API responses.

## Deployment Audits
Always run Django's deployment check before releasing:
```bash
python manage.py check --deploy
```
