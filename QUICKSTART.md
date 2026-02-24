# DermaGen - Quick Start Guide

Get DermaGen up and running in 3 minutes!

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)

## Quick Setup

### 1. Configure and start Backend (Terminal 1)

```bash
cd backend

# (first time only)
npm install

# configure backend port and AI URL
echo PORT=5000 > .env
echo AI_SERVICE_URL=http://localhost:8000 >> .env

# start with auto-reload
npm run dev
```

Wait for: `Server is running on http://localhost:5000`

### 2. Configure and start AI Service (Terminal 2)

```bash
cd ai_service

# (first time only)
python -m venv venv
.\venv\Scripts\activate  # On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

# configure AI service port (optional, defaults shown)
echo PORT=8000 > .env
echo HOST=0.0.0.0 >> .env

# start FastAPI via uvicorn using env-based port
python main.py
```

Wait for logs ending with: `Application startup complete.`

### 3. Start Frontend (Terminal 3)

```bash
cd ..  # Back to project root (frontend)

# (first time only)
npm install

# start Vite dev server
npm run dev
```

Open browser to: `http://localhost:5173`

## Verify Installation

1. Backend: http://localhost:5000/health
2. AI Service: http://localhost:8000/health
3. Frontend: http://localhost:5173

## Test Image Generation

1. Click "Generate" in navigation
2. Select "AKIEC" from dropdown
3. Enter "3" for count
4. Click "Generate Images"
5. Wait 5-10 seconds for results

## Troubleshooting

### Port already in use?
```bash
# Kill process on port
lsof -ti:5000 | xargs kill  # Backend
lsof -ti:8000 | xargs kill  # AI Service
lsof -ti:5173 | xargs kill  # Frontend
```

### AI Service not connecting?
Check that backend/.env has: `AI_SERVICE_URL=http://localhost:8000`

## Architecture

```
Frontend (React)     →  Backend (Node.js)  →  AI Service (Python)
http://localhost:5173   http://localhost:5000  http://localhost:8000
```

## Next Steps

- Read full README.md for detailed documentation
- Train your own GAN model
- Customize disease classes
- Deploy to production

Happy generating! 🎨🧬
