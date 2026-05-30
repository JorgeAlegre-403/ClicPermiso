@echo off
title Lanzador ClicPermiso Premium
echo ==========================================
echo    INICIANDO CLICPERMISO (IES ALBARREGAS)
echo ==========================================
echo.

echo [1/3] Levantando Base de Datos (Docker)...
docker-compose up -d

echo.
echo [!] Esperando 10 segundos a que la base de datos este lista...
timeout /t 10 /nobreak > NUL

echo.
echo [2/3] Iniciando Backend (Spring Boot) en puerto 8080...
start "Backend ClicPermiso" cmd /k "cd api_clicpermiso && mvnw spring-boot:run"

echo.
echo [3/3] Iniciando Frontend (React) en puerto 8081...
start "Frontend ClicPermiso" cmd /k "cd clickPermiso && npm run dev"

echo.
echo ==========================================
echo    TODO LISTO! 
echo    Accede a: http://localhost:8081
echo ==========================================
pause
