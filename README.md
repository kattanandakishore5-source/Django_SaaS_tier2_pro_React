# Django SaaS Tier 2 Pro Boilerplate

Welcome to your new SaaS foundation. This boilerplate combines the power and security of **Django** with the modern, reactive developer experience of **React (Vite, TypeScript, Tailwind CSS, shadcn/ui)**. 

It is designed to be **Server-Authoritative**, meaning it does not rely on fragile client-side logic for billing or access control. Django acts as the absolute source of truth.

## Features
- **Strict TypeScript & React**: Fully typed TanStack Query integration.
- **Session Authentication**: Secure `HttpOnly` cookies, dodging XSS vulnerabilities associated with `localStorage` JWTs.
- **Server-Authoritative Entitlements**: Limits and feature gating enforced at the database level with transaction locking.
- **Stripe Subscriptions**: Seamless Checkout integration with secure webhook handling.
- **Celery & Redis**: Background task processing out-of-the-box.
- **Dockerized Production**: Non-root, multi-stage, hardened Nginx/Gunicorn setup.

## Quick Start (Docker)

The fastest way to get started is using Docker Compose:

1. **Clone & Configure**
   ```bash
   git clone <repo> my-saas
   cd my-saas
   cp .env.example .env
   ```

2. **Start the Stack**
   ```bash
   docker-compose up --build
   ```

3. **Run Migrations**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

4. **Access the App**
   - Frontend: http://localhost:3000 (if using dev server) or via Nginx on http://localhost depending on setup.
   - API: http://localhost:8000

## Quick Start (Manual/Local)

1. **Backend Setup**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

## Documentation Map
All detailed guides are located in the `docs/` folder:
- [Stripe Setup](docs/STRIPE_SETUP.md)
- [Authentication](docs/AUTHENTICATION.md)
- [Entitlements & Gating](docs/ENTITLEMENTS.md)
- [Celery Tasks](docs/CELERY.md)
- [Database Configuration](docs/DATABASE.md)
- [Testing](docs/TESTING.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Deployment](DEPLOYMENT.md)

## Customization

### Theming & Styling
The frontend uses Tailwind CSS and `shadcn/ui`.
- Change primary colors in `frontend/src/index.css`.
- Update components in `frontend/src/components/ui/`.

### APIs & Models
- Django apps are modularly organized in the `apps/` directory (`core`, `billing`, `dashboard`, `accounts`).
- API routes are centrally exposed in `config/urls.py`.

## Support & Operations
Please refer to `OPERATIONS.md` and `RELEASE_CHECKLIST.md` before deploying to production.
