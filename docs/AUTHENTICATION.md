# Authentication Guide

This boilerplate relies on **Session-based Authentication** via Django's secure HTTP-only cookies, combined with Django REST Framework (DRF) and React.

## Why Session Auth?
Session Auth is more secure out-of-the-box for SPAs (Single Page Applications) than JWTs stored in `localStorage`. 
- **XSS Protection**: Cookies are `HttpOnly`, meaning malicious JavaScript cannot steal the session token.
- **CSRF Protection**: Handled via Django's `CsrfViewMiddleware` and double-submit cookies.

## How It Works
1. React posts credentials to `/api/auth/login/`.
2. Django validates credentials and sets a `sessionid` and `csrftoken` cookie.
3. Axios automatically includes `withCredentials: true` on all subsequent requests.
4. React checks the session state via `GET /api/auth/users/profile/`.

## 2FA (Two-Factor Authentication)
Users can enable TOTP (Time-Based One-Time Passwords).
- Powered by `apps.accounts.middleware.Pending2FAMiddleware`.
- If a user has 2FA enabled, login succeeds partially; they are placed in a restricted state until they post the correct code to `/api/auth/2fa/verify/`.

## Magic Links
Users can log in without a password via Magic Links.
1. User enters their email.
2. A secure, short-lived token is generated and emailed.
3. User clicks the link, arriving at the React frontend (`/magic-login?token=...`).
4. React posts the token to Django to establish the session.

Configurable in `.env`:
```env
MAGIC_LINK_EXPIRY_MINUTES=15
```
