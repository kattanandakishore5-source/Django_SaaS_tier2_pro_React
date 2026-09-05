# Troubleshooting

## Frontend API 403 Forbidden Errors
**Symptom**: Dashboard stats are failing to load, showing a 403 error in the console.
**Cause**: The dashboard stats endpoint uses `IsAdminUser`. By design, standard users will receive a 403, and the UI gracefully degrades to an empty fallback state. This is normal.

## Infinite Redirect Loops
**Symptom**: The browser complains of too many redirects on the login page.
**Cause**: You are deployed behind a reverse proxy (like Nginx/Cloudflare) over HTTPS, but Django thinks it's HTTP.
**Fix**: Ensure `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')` is triggering in `settings.py`.

## CORS Errors
**Symptom**: React throws CORS preflight errors when fetching API endpoints.
**Cause**: The frontend URL isn't in `CORS_ALLOWED_ORIGINS` or `CSRF_TRUSTED_ORIGINS`.
**Fix**: Update `.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,https://yourdomain.com
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8000,https://yourdomain.com
```

## Celery / Redis Connection Issues
**Symptom**: `redis.exceptions.ConnectionError: Error 111 connecting to redis:6379`.
**Cause**: Redis container is not running, or the `.env` URL is incorrect.
**Fix**: Ensure `docker-compose up -d redis` is running.

## Stripe Webhook Fails
**Symptom**: Webhook returns 400 Bad Request.
**Cause**: `STRIPE_WEBHOOK_SECRET` does not match the incoming event signature.
**Fix**: Verify your webhook secret matches the exact environment (Test vs Live).
