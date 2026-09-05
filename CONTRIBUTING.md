# Contributing

As this is a commercial boilerplate template, direct pull requests are managed through the official customer portal.

## Setting Up For Development
Ensure you have run through `docs/ONBOARDING.md`.

## Coding Standards
- **Python**: Follow PEP 8. We recommend using `black` and `ruff`.
- **TypeScript**: We enforce strict type checking (`"strict": true` in `tsconfig.json`). Do not use `any`.
- **React**: Use functional components and hooks. Rely on `shadcn/ui` for base components.

## Running Tests
Before submitting any changes for your own projects, ensure regressions aren't introduced:
```bash
# Backend
python manage.py test

# Frontend
cd frontend
npm run test
```
