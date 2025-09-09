@echo off
echo 🚀 Starting hrbooteh Development Environment...
echo.
echo Installing dependencies...
call npm install
echo.
echo Setting up Python backend...
cd backend
call pip install -r requirements.txt
cd ..
echo.
echo 🌟 Starting both frontend and backend...
echo 📱 Frontend will be available at: http://localhost:8080
echo 🔗 Backend API will be available at: http://localhost:8000
echo 📚 API Documentation will be available at: http://localhost:8000/docs
echo.
call npm run dev
