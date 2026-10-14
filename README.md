# Takharuj Internal Portal

A cooperative-training software project for an internal business portal and multi-tenant invoicing platform.

## Overview

The project provides a Django REST Framework backend and a web frontend for managing companies, users, clients, invoices, reports, and related administrative workflows.

## Main Features

- Multi-tenant company isolation
- Role-based access control
- Customer and company management
- Invoice creation and management
- VAT and ZATCA-related invoice fields
- QR/XML-related invoice workflows
- Reports and dashboard data
- Authentication and password reset flows
- Audit and administrative functionality
- Arabic/English interface support

## Technology Stack

- Python
- Django
- Django REST Framework
- PostgreSQL
- HTML, CSS, and JavaScript
- JWT authentication
- Gunicorn / Nginx deployment examples

## Project Structure

```text
backend/
  core/                 Main Django application
  takharuj_backend/     Django project settings and routing
  .env.example          Example environment variables
  manage.py             Django management entry point

public/                  Frontend pages and assets
deploy/                  Sanitized deployment examples
requirements.txt         Python dependencies
```
## Live Demo

[View Live Demo](https://alyasaadgh.github.io/Takharuj-internal-portal/login.html)

Click “Explore demo” to browse the platform with sample data.

## Local Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy the example environment file and provide local values:

```bash
cp backend/.env.example backend/.env
```

4. Set a PostgreSQL `DATABASE_URL`.
5. Run migrations:

```bash
cd backend
python manage.py migrate
```

6. Start the development server:

```bash
python manage.py runserver
```

## Security Note

This public repository contains sanitized configuration examples only. Production credentials, private keys, live customer data, server-specific paths, logs, backups, uploaded media, and runtime environment files are intentionally excluded.
