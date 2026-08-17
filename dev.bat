@echo off
title GOALS Platform Dev Server (Port 5173)
cd /d "%~dp0"
echo ========================================================
echo   Iniciando GOALS Platform en http://localhost:5173
echo ========================================================
npx vite --port 5173 --host
pause
