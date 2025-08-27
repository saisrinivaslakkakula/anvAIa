# Environment Setup for Separate Frontend/Backend Services

## 🏗️ New Architecture

We've split the application into two separate Render services:

1. **Backend Service** (`job-agents-api`): Node.js API server
2. **Frontend Service** (`job-agents-frontend`): Static React app

## 🔧 Environment Variables

### Backend Service (`job-agents-api`)
- `NODE_ENV`: `production`
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: `https://job-agents-frontend.onrender.com`

### Frontend Service (`job-agents-frontend`)
- `VITE_API_BASE_URL`: `https://job-agents-api.onrender.com`

## 🚀 Local Development

### Backend
```bash
cd server
npm install
npm start
# Runs on http://localhost:4000
```

### Frontend
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables for Local Development
Create `.env.local` in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:4000
```

## 🔄 How It Works

1. **Frontend** makes API calls to backend using `VITE_API_BASE_URL`
2. **Backend** redirects non-API requests to frontend service
3. **Users** can access either service directly
4. **No more build issues** - each service handles its own build process

## 📍 Service URLs

- **Backend API**: `https://job-agents-api.onrender.com`
- **Frontend App**: `https://job-agents-frontend.onrender.com`
- **Database**: Managed by Render
