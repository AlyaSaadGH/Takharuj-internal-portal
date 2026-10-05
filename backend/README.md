# Fawateer Platform Backend

## Local start

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

PostgreSQL is mandatory. The application refuses to start when `DATABASE_URL` is absent or
points to another engine. Export the connection URL before running Django; see `.env.example`.

## Verification

```bash
.venv/bin/python manage.py check --deploy
.venv/bin/python manage.py test
```
