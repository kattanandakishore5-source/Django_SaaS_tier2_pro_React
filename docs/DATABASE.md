# Database Configuration

This boilerplate is configured to use **SQLite** by default for local development (if no `DB_HOST` is provided), but seamlessly switches to **PostgreSQL** for production.

## Migration Safety
Never execute `makemigrations` in a production environment. 
Always generate migrations locally, commit them to `git`, and run `python manage.py migrate` in production.

## Concurrency and Locking
For limit enforcement (e.g. max projects per user), this boilerplate leverages row-level locks to prevent race conditions.
See `ProjectViewSet.perform_create`:
```python
user = CustomUser.objects.select_for_update().get(id=self.request.user.id)
```
This forces Postgres to lock the user row, preventing concurrent project creations from bypassing limits.

## Database Backups
Refer to `DEPLOYMENT.md` for Postgres backup instructions (Point-In-Time Recovery/PITR).
