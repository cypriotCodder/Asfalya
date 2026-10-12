# Asfalya — Insurance Notification & Insights Platform

Asfalya is an insurance management platform for agencies: it streamlines customer communication, tracks policy renewals, and surfaces business insights from the agency's own data. It pairs an asynchronous FastAPI backend with a Next.js frontend.

<p align="center"><em>⬇️ Add screenshots here — see <a href="#screenshots">Screenshots</a>.</em></p>

---

## Overview

The platform is built as two decoupled services: a high-performance async **FastAPI** API and a responsive **Next.js** frontend. Admins onboard customers (individually or in bulk from Excel), customers activate their own accounts through a secure one-time-code flow, and the admin dashboard turns policy and payment data into revenue and growth insights.

## Tech stack

**Backend**
- **FastAPI** — asynchronous Python API layer
- **SQLAlchemy (async)** with **asyncpg** over **PostgreSQL**
- **Celery + Redis** — background jobs (email delivery, bulk imports)
- **python-jose + Passlib/bcrypt** — JWT auth and password hashing
- **Pandas + openpyxl** — Excel ingestion and data cleaning
- **Resend** — transactional email

**Frontend**
- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** with **shadcn/ui** (Radix primitives)
- **Recharts** — analytics visualisations
- **Leaflet / react-leaflet** — interactive "nearby mechanics" map

## Key features

### Admin-led account activation
Rather than open self-signup, Asfalya uses a secure admin-led flow. An admin creates a customer (or imports in bulk); the system generates a temporary password and a 6-digit OTP, hashed before storage with a 15-minute expiry. The customer completes a first-time login — verify email, enter the OTP, set a permanent password — so only authorised customers reach the portal.

### Analytics & insights
The admin dashboard presents real-time financial and behavioural data: monthly revenue trends and growth, automated policy distribution (full, third-party, etc.), and cumulative customer-growth metrics, all visualised with Recharts.

### Bulk Excel import
A bulk-import system bootstraps thousands of records at once, handling both customers and mechanics with automated validation and cleaning (normalising phone numbers, handling missing values, and heuristic coordinate fixing for location data).

### Bilingual UI (TR/EN)
A global language provider built on React Context switches the entire interface between Turkish and English at runtime. UI strings, error messages, and alerts are centralised in a single translations module.

### Nearby mechanics map
An interactive Leaflet map helps customers find nearby service providers, with custom markers, popups, and direct WhatsApp links.

### Session management & security
A global session manager tracks token validity with a 30-minute refresh heartbeat. Authentication uses middleware-backed cookies alongside local-storage tokens for cross-platform compatibility.

## Getting started

### Prerequisites
- Docker Desktop (for PostgreSQL and Redis)
- Node.js 18+
- Python 3.10+

### 1. Clone
```bash
git clone https://github.com/cypriotCodder/Asfalya.git
cd Asfalya
```

### 2. Configure the backend environment
Create a `.env` file in `backend/`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/asfalya
SECRET_KEY=your_super_secret_key_here
```

### 3. Start infrastructure
```bash
docker-compose up -d
```

### 4. Run the services

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API documentation

With the backend running, interactive API docs are available at:
- Swagger UI — http://localhost:8000/docs
- ReDoc — http://localhost:8000/redoc

## Screenshots

> _Add a few screenshots so visitors can see the platform without running it. Suggested shots: the admin analytics dashboard, the Excel import flow, and the nearby-mechanics map. Place image files in `docs/screenshots/` and reference them here, e.g._
>
> ```markdown
> ![Admin dashboard](docs/screenshots/dashboard.png)
> ![Nearby mechanics map](docs/screenshots/map.png)
> ```

## License

Copyright © 2025 Nedim Hüray. All rights reserved.
