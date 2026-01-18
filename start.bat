@echo off
title Project X Launcher
echo ==========================================
echo      PROJECT X PILOT SYSTEM LAUNCHER
echo          (Django + React)
echo          ** LOCAL MODE **
echo ==========================================

echo.
echo [1/2] Starting Backend (Django)...
echo NOTE: Ensure you have a local PostgreSQL running on localhost:5432
echo NOTE: First run requires: cd backend ^& pip install -r requirements.txt ^& python manage.py migrate
start "Project X Backend" cmd /k "cd backend && python manage.py runserver 0.0.0.0:8000"

echo.
echo [2/2] Starting Frontend (React)...
start "Project X Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo    SYSTEMS LAUNCHED
echo ==========================================
echo Web App:     http://localhost:3000
echo Admin Panel: http://localhost:8000/admin
echo.
pause
