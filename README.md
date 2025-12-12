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

### 2. Start Backend (FastAPI)
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

### 3. Start Frontend (Next.js)
Open a new terminal:
```bash
cd frontend
npm run dev
```
The Web App will be available at: [http://localhost:3000](http://localhost:3000)
