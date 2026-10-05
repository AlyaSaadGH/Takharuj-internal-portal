#!/usr/bin/env bash
set -euo pipefail
umask 077

APP_DIR=/srv/takharuj/backend
RUNTIME_DIR=/srv/takharuj/.config
SECRET_FILE="$RUNTIME_DIR/django-secret-key"

mkdir -p "$RUNTIME_DIR" "$APP_DIR/logs"
if [ ! -s "$SECRET_FILE" ]; then
  openssl rand -hex 64 > "$SECRET_FILE"
fi
if [ -r "$RUNTIME_DIR/email.env" ]; then
  set -a
  . "$RUNTIME_DIR/email.env"
  set +a
fi

export DATABASE_URL='postgresql://dbuser:dbpassword@localhost:5432/takharuj_db'
export DJANGO_SECRET_KEY
DJANGO_SECRET_KEY="$(tr -d '\r\n' < "$SECRET_FILE")"
export DJANGO_DEBUG=0
export DJANGO_ALLOWED_HOSTS='example.com,www.example.com,127.0.0.1,localhost'
export CSRF_TRUSTED_ORIGINS='https://example.com,https://www.example.com'
export CORS_ALLOWED_ORIGINS='https://example.com,https://www.example.com'
export FRONTEND_URL='https://example.com/'

cd "$APP_DIR"
exec .venv/bin/gunicorn takharuj_backend.wsgi:application \
  --bind 127.0.0.1:8090 \
  --workers 3 \
  --timeout 90 \
  --access-logfile "$APP_DIR/logs/access.log" \
  --error-logfile "$APP_DIR/logs/error.log"
