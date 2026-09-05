# Celery & Asynchronous Tasks

Celery handles long-running background tasks (like sending emails or generating reports) so your web requests stay fast.

## Architecture
- **Broker**: Redis (Handles the queue of tasks).
- **Backend**: Redis (Stores the results of completed tasks).
- **Worker**: The Celery process executing the tasks.

## Configuration
Controlled via `config/settings.py` and `.env`:
```env
CELERY_BROKER_URL=redis://redis:6379/0
```

## Running Celery Locally
If using Docker, it runs automatically:
```bash
docker-compose up
```

Without Docker:
```bash
celery -A config worker --loglevel=info
```

## Creating a Task
Put tasks in `tasks.py` inside any Django app:
```python
# apps/core/tasks.py
from celery import shared_task

@shared_task
def send_welcome_email(user_id):
    # logic here
    pass
```

## Calling a Task
```python
from apps.core.tasks import send_welcome_email

send_welcome_email.delay(user.id)
```

## Security Note
We explicitly set `CELERY_TASK_SERIALIZER = 'json'` in `settings.py` to prevent pickle-related security vulnerabilities. Do not pass complex ORM objects to Celery; pass primary keys (IDs) instead.
