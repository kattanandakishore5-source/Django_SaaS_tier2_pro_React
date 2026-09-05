# Security Architecture

## 1. Zero-Trust Frontend
The React application is treated as an untrusted client. 
- It holds **no Stripe secret keys**.
- It does **not calculate pricing**.
- It is **not the authority** on whether a user has access to a feature. 
- Access control is strictly enforced by the Django backend APIs using `apps/billing/entitlements.py`.

## 2. Session Management
- **HttpOnly Cookies**: Prevents Cross-Site Scripting (XSS) from reading the session token.
- **CSRF Tokens**: Mitigates Cross-Site Request Forgery via Double Submit Cookies.

## 3. Database Integrity
Usage limits (e.g., maximum projects allowed on a Free plan) are enforced within `transaction.atomic()` blocks using `select_for_update()`. This prevents malicious users from bypassing limits via concurrent race conditions.

## 4. Secret Management
Never commit `.env` files. The production `.env` is explicitly ignored via `.gitignore`. 
All sensitive configuration defaults fail securely (e.g., `DEBUG=False` default, `ImproperlyConfigured` exceptions if `SECRET_KEY` is not overridden).

## 5. Dependency Management
Run standard audits (`npm audit`, `pip-audit`) regularly. The provided Dockerfiles run as a non-root user (`uid 1000`) to mitigate container breakout vulnerabilities.
