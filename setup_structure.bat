@echo off
REM Chemin Windows : C:\SOGAS-RH V2.0\setup_structure.bat
REM Script de création automatique de la structure frontend

echo ========================================
echo   CREATION STRUCTURE FRONTEND
echo   SOGAS-RH V2.0
echo ========================================
echo.

set ROOT_DIR=C:\SOGAS-RH V2.0
set FRONTEND_SRC=%ROOT_DIR%\frontend\src

echo [1/3] Verification du repertoire frontend...
if not exist "%ROOT_DIR%\frontend" (
    echo ERREUR: Le dossier frontend n'existe pas!
    echo Verifiez le chemin: %ROOT_DIR%\frontend
    pause
    exit /b 1
)
echo ✓ Dossier frontend trouve

echo.
echo [2/3] Creation des dossiers manquants...

REM Créer src si n'existe pas
if not exist "%FRONTEND_SRC%" mkdir "%FRONTEND_SRC%"
echo ✓ src\

REM Créer api
if not exist "%FRONTEND_SRC%\api" mkdir "%FRONTEND_SRC%\api"
echo ✓ src\api\

REM Créer contexts
if not exist "%FRONTEND_SRC%\contexts" mkdir "%FRONTEND_SRC%\contexts"
echo ✓ src\contexts\

REM Créer pages
if not exist "%FRONTEND_SRC%\pages" mkdir "%FRONTEND_SRC%\pages"
echo ✓ src\pages\

REM Créer pages\auth
if not exist "%FRONTEND_SRC%\pages\auth" mkdir "%FRONTEND_SRC%\pages\auth"
echo ✓ src\pages\auth\

REM Créer utils
if not exist "%FRONTEND_SRC%\utils" mkdir "%FRONTEND_SRC%\utils"
echo ✓ src\utils\

echo.
echo [3/3] Verification de la structure...
echo.
dir /b "%FRONTEND_SRC%" | findstr /C:"api" >nul && echo ✓ api\ existe || echo ✗ api\ MANQUANT
dir /b "%FRONTEND_SRC%" | findstr /C:"contexts" >nul && echo ✓ contexts\ existe || echo ✗ contexts\ MANQUANT
dir /b "%FRONTEND_SRC%" | findstr /C:"pages" >nul && echo ✓ pages\ existe || echo ✗ pages\ MANQUANT
dir /b "%FRONTEND_SRC%" | findstr /C:"utils" >nul && echo ✓ utils\ existe || echo ✗ utils\ MANQUANT

echo.
echo ========================================
echo   STRUCTURE CREEE AVEC SUCCES
echo ========================================
echo.
echo Structure finale:
echo %FRONTEND_SRC%\
echo   ├── api\
echo   ├── contexts\
echo   ├── pages\
echo   │   └── auth\
echo   └── utils\
echo.
echo PROCHAINES ETAPES:
echo 1. Copiez les fichiers corriges dans les dossiers:
echo    - axios.ts         → %FRONTEND_SRC%\api\
echo    - auth.api.ts      → %FRONTEND_SRC%\api\
echo    - AuthContext.tsx  → %FRONTEND_SRC%\contexts\
echo    - LoginPage.tsx    → %FRONTEND_SRC%\pages\auth\
echo    - storage.ts       → %FRONTEND_SRC%\utils\
echo.
echo 2. Redemarrez le serveur frontend:
echo    cd %ROOT_DIR%\frontend
echo    npm run dev
echo.
pause