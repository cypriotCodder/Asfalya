# Asfalya - Insurance Notification & Insights Platform

Asfalya is a modern insurance management platform designed to streamline customer communications, manage policy renewals, and provide actionable business insights for insurance agencies.

## 🚀 Implementation Overview

The project is built with a decoupled architecture, using **FastAPI** for a high-performance asynchronous backend and **Next.js** for a premium, responsive frontend experience.

### 🏗️ Technology Stack

#### Backend
- **FastAPI**: Asynchronous Python web framework for the API layer.
- **SQLAlchemy (Async)**: For database ORM with asynchronous PostgreSQL support via `asyncpg`.
- **PostgreSQL**: Robust relational database for persistent storage.
- **JWT & Passlib**: Secure authentication using JSON Web Tokens and bcrypt password hashing.
- **Pandas & Openpyxl**: Powerful Excel processing for bulk data imports.
- **Doxygen-style Documentation**: Comprehensive docstrings for all modules and endpoints.

#### Frontend
- **Next.js 15 (App Router)**: Modern React framework for routing and server-side rendering.
- **Tailwind CSS**: Utility-first CSS for a sleek, responsive UI.
- **shadcn/ui**: High-quality, accessible UI components.
- **Recharts**: Dynamic visualization for analytics and trends.
- **Leaflet**: Interactive mapping for location-based services (Nearby Mechanics).
- **TypeScript**: Ensuring type safety across the frontend codebase.

---

## 💎 Key Features & Implementation Details

### 1. Admin-Led User Activation Flow
Instead of traditional self-signup, Asfalya implements a secure admin-led activation process:
- **Creation**: Admin creates a customer or imports via Excel. A temporary random password and a 6-digit OTP are generated.
- **Security**: The OTP is hashed before storage in the database with a 15-minute expiry.
- **Activation**: The user performs a "First Time Login" by entering their email, verifying the OTP, and then setting their permanent password. This ensures only authorized customers can access the portal.

### 2. Advanced Analytics & Insights
The Admin Dashboard provides real-time financial and behavioral data:
- **Revenue Trends**: Visualization of monthly turnover and growth.
- **Policy Distribution**: Automated categorization of policies (Full, Third-Party, etc.) using `Recharts`.
- **Customer Growth**: Cumulative metrics tracking platform adoption.

### 3. Smart Excel Integration
A robust bulk import system allows admins to bootstrap thousands of records in seconds:
- Handles both **Customers** and **Mechanics**.
- Automated validation and data cleaning (e.g., cleaning phone numbers, handling missing values).
- Heuristic-based coordinate fixing for location data.

### 4. Multi-Language Support (TR/EN)
A global `LanguageProvider` using React Context allows for seamless, real-time switching between Turkish and English across the entire application. All UI strings, error messages, and alerts are centralized in `translations.ts`.

### 5. Nearby Mechanics Map
Integrated with **Leaflet**, the platform provides customers with an interactive map to find nearby service providers. It includes custom markers, popup details, and direct WhatsApp links for quick interaction.

### 6. Session Management & Security
- **Global `SessionManager`**: Monitors token validity and provides a 30-minute auto-refresh heartbeat.
- **Secure Cookies**: Middleware-based auth using cookies and local storage tokens for cross-platform compatibility.

---

## 🛠️ Getting Started

### Prerequisites
- **Docker Desktop** (Required for PostgreSQL and Redis)
- **Node.js 18+**
- **Python 3.10+**

### 1. Clone & Setup
```bash
git clone <repository-url>
cd Asfalya
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/asfalya
SECRET_KEY=your_super_secret_key_here
```

### 3. Run with Docker Compose
The easiest way to start the infrastructure:
```bash
docker-compose up -d
```

### 4. Start Development Servers

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 API Documentation
Once the backend is running, you can access the interactive API documentation at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📄 License
© 2025 Asfalya. All rights reserved.
