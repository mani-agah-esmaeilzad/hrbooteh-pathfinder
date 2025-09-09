# hrbooteh - Professional Skills Assessment Platform

A full-stack application for comprehensive professional skills assessment with interactive AI-powered evaluations.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Git**

### Option 1: Simple Development Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd hrbooteh-pathfinder

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Start both frontend and backend in development mode
npm run dev
```

This will start:
- **Frontend**: http://localhost:8080 (React + Vite)
- **Backend**: http://localhost:8000 (FastAPI)
- **API Docs**: http://localhost:8000/docs

### Option 2: Docker Setup

```bash
# Development with Docker
docker-compose -f docker-compose.dev.yml up

# Production with Docker
docker-compose up --build
```

## 📁 Project Structure

```
hrbooteh-pathfinder/
├── src/                          # React frontend source
│   ├── components/               # Reusable UI components
│   ├── pages/                   # Application pages
│   ├── contexts/                # React contexts
│   └── lib/                     # Utilities and API client
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/routes/      # API route handlers
│   │   ├── core/               # Core functionality
│   │   ├── models/             # Database models
│   │   ├── schemas/            # Pydantic schemas
│   │   └── services/           # Business logic
│   ├── tests/                  # Backend tests
│   └── requirements.txt        # Python dependencies
├── public/                     # Static assets
└── docker-compose.yml         # Docker configuration
```

## 🛠️ Development

### Frontend Development

```bash
# Start frontend dev server
npm run frontend:dev

# Build frontend
npm run frontend:build

# Lint and format
npm run frontend:lint
npm run frontend:format
```

### Backend Development

```bash
# Start backend dev server
npm run backend:dev
# or
cd backend && python start-dev.py

# Run tests
npm run backend:test
# or
cd backend && python -m pytest

# Lint and format
npm run backend:lint
npm run backend:format
```

### Full Stack Commands

```bash
# Start both frontend and backend
npm run dev

# Build both
npm run build

# Run all tests
npm run test

# Format all code
npm run format

# Clean all build artifacts
npm run clean
```

## 🗄️ Database

### Development (SQLite)
The development setup uses SQLite by default. The database file will be created automatically at `backend/hrbooteh.db`.

### Production (PostgreSQL)
For production, configure PostgreSQL in your environment variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/hrbooteh_db
```

## 🔧 Configuration

### Environment Variables

Copy and customize the environment files:

```bash
# Backend
cp backend/.env.development backend/.env
cp backend/.env.production.example backend/.env.production

# Frontend
cp .env.development .env.local
```

### Key Backend Environment Variables

```bash
# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///hrbooteh.db  # or PostgreSQL URL

# AI (Optional)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## 📊 Features

- **🔐 Authentication**: JWT-based authentication with refresh tokens
- **📝 Interactive Assessments**: AI-powered skill assessments
- **📈 Progress Tracking**: Visual progress timeline
- **🎯 Multi-type Assessments**: Independence, confidence, negotiation, leadership, communication
- **💬 Chat-based Interface**: Natural conversation flow
- **📊 Detailed Analysis**: Comprehensive results and recommendations
- **🔄 Real-time Updates**: Live assessment progress
- **📱 Responsive Design**: Works on all devices

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest                    # Run all tests
python -m pytest tests/test_auth.py # Run specific tests
python -m pytest -v                 # Verbose output
```

### Frontend Tests
```bash
npm run frontend:test               # Run frontend tests
```

## 🚀 Deployment

### Using Docker

1. **Production Deployment**:
   ```bash
   docker-compose up -d --build
   ```

2. **Environment Configuration**:
   - Copy `.env.production.example` to `.env.production`
   - Update all production variables
   - Ensure secure SECRET_KEY
   - Configure your database

### Manual Deployment

1. **Build Frontend**:
   ```bash
   npm run frontend:build
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

### Health Checks

- **Frontend**: http://your-domain/health
- **Backend**: http://your-domain:8000/health

## 📚 API Documentation

When running in development mode, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 API Integration

The backend provides the following main endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

### Assessments
- `POST /api/v1/assessments/start` - Start new assessment
- `POST /api/v1/assessments/{id}/message` - Send message
- `GET /api/v1/assessments/{id}/results` - Get results
- `GET /api/v1/assessments/user` - Get user assessments

## 🎯 Assessment Types

1. **استقلال** (Independence)
2. **اعتماد به نفس** (Confidence)
3. **مهارت‌های مذاکره** (Negotiation Skills)
4. **مهارت‌های رهبری** (Leadership Skills)
5. **مهارت‌های ارتباطی** (Communication Skills)

## 💡 AI Integration

The system includes a pluggable AI service that can be configured with:
- **OpenAI GPT models** (GPT-3.5-turbo, GPT-4)
- **Anthropic Claude models**
- **Custom AI implementations**

For development, it uses a stub implementation that simulates realistic conversations.

## 🔄 Development Workflow

This project works similar to **Next.js** but with React + FastAPI:

1. **Start Development**: `npm run dev` (starts both frontend and backend)
2. **Hot Reload**: Both frontend and backend support hot reload
3. **Unified Build**: `npm run build` builds both parts
4. **Single Config**: Environment variables managed centrally
5. **Docker Ready**: Complete containerization support

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ using React, FastAPI, and modern web technologies**
