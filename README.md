# Asfalya

Insurance Notification & Insights Platform.

## Prerequisites
- **Docker Desktop** (must be running for Database & Redis)
- **Python 3.10+**
- **Node.js 18+**

## Quick Start

### 1. Start Infrastructure
Make sure Docker is running, then start the database and redis containers:
```bash
docker-compose up -d
```

### 2. Backend Environment Setup
The backend requires a `SECRET_KEY` for signing JWT tokens. Create a `.env` file from the example:

```bash
cd backend
cp .env.example .env
```

Now, open `backend/.env` and replace `your_super_secret_key_here` with a securely generated key. You can generate one with:
```bash
openssl rand -hex 32
```
Your `.env` file should look like this:
```
SECRET_KEY=...some_long_random_string...
DATABASE_URL=postgresql+asyncpg://user:password@localhost/asfalya
ADMIN_PASSWORD=admin123
```
The `DATABASE_URL` is pre-filled for the local Docker setup. The `ADMIN_PASSWORD` is used to seed the initial admin user.


### 3. Start Backend (FastAPI)
Open a new terminal:
```bash
cd backend
# Activate the virtual environment
source venv/bin/activate
# Run the server
uvicorn main:app --reload
```
The Backend API will be available at: [http://localhost:8000](http://localhost:8000)
Interactive Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Start Frontend (Next.js)
Open a new terminal:
```bash
cd frontend
npm run dev
```
The Web App will be available at: [http://localhost:3000](http://localhost:3000)
