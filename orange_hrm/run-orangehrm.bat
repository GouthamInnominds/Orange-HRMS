@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: OrangeHRM Application Launcher (Windows)
:: Runs the PHP Backend, project-local MariaDB, and serves the Web UI.
:: ==============================================================================

cd /d "%~dp0"

:: Handle help flags
if "%~1"=="-h" goto SHOW_HELP
if "%~1"=="--help" goto SHOW_HELP
if "%~1"=="/?" goto SHOW_HELP
if /i "%~1"=="help" goto SHOW_HELP

:: Check for WSL availability
where wsl >nul 2>&1
if %ERRORLEVEL% neq 0 goto NO_WSL

:: Handle stop command
if /i "%~1"=="stop" goto STOP_SERVERS

:: Handle status command
if /i "%~1"=="status" goto CHECK_STATUS

:: Parse arguments and flags
set "ACTION="
set "OPEN_BROWSER=0"

:PARSE_ARGS
if "%~1"=="" goto ARGS_PARSED
if /i "%~1"=="--open" (
    set "OPEN_BROWSER=1"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="-o" (
    set "OPEN_BROWSER=1"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="both" (
    set "ACTION=both"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="remove" (
    set "ACTION=remove"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="add" (
    set "ACTION=add"
    shift
    goto PARSE_ARGS
)

:: If unrecognized argument, show help
echo [ERROR] Unrecognized argument: %~1
goto SHOW_HELP

:ARGS_PARSED
if "%ACTION%"=="" set "ACTION=both"

:: Ensure script exists
if not exist "run-orangehrm.sh" goto NO_SCRIPT

:: Stop any conflicting system mariadb service in WSL to free port 3306
wsl -u root systemctl stop mariadb >nul 2>&1

:: Ensure executable permissions and LF line endings in WSL
wsl chmod +x ./run-orangehrm.sh >nul 2>&1
wsl sed -i "s/\r$//" ./run-orangehrm.sh >nul 2>&1

echo ======================================================================
echo                   OrangeHRM Application Launcher                     
echo ======================================================================
echo   Starting OrangeHRM Backend and Web UI...
echo   Mode: %ACTION%
echo.
if /i "%ACTION%"=="both" (
    echo   Access the Web UI in your browser:
    echo     * Primary Instance [Work Location hidden] : http://localhost:5121
    echo     * Add Instance     [Work Location visible]: http://localhost:5125
)
if /i "%ACTION%"=="remove" (
    echo   Access the Web UI in your browser:
    echo     * Primary Instance [Work Location hidden] : http://localhost:5121
)
if /i "%ACTION%"=="add" (
    echo   Access the Web UI in your browser:
    echo     * Add Instance     [Work Location visible]: http://localhost:5125
)
echo.
echo   Press Ctrl+C in this window at any time to stop the server.
echo ======================================================================
echo.

:: Automatically launch browser if requested
if "%OPEN_BROWSER%"=="1" (
    if /i "%ACTION%"=="add" (
        start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:5125"
    ) else (
        start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:5121"
    )
)

:: Execute the launcher script in WSL
wsl bash ./run-orangehrm.sh %ACTION%

set "EXIT_CODE=%ERRORLEVEL%"
if %EXIT_CODE% neq 0 (
    echo.
    echo [INFO] OrangeHRM exited with code %EXIT_CODE%.
)
exit /b %EXIT_CODE%

:: ------------------------------------------------------------------------------
:STOP_SERVERS
echo ======================================================================
echo   Stopping OrangeHRM services...
echo ======================================================================
wsl bash -c "pkill -f 'php.*-S 0.0.0.0:512' 2>/dev/null; pkill mysqld 2>/dev/null; exit 0"
echo [OK] OrangeHRM web servers and project-local MariaDB instances stopped.
exit /b 0

:: ------------------------------------------------------------------------------
:CHECK_STATUS
echo ======================================================================
echo   Checking OrangeHRM Port Status...
echo ======================================================================
echo Port 5121 [Primary UI/Backend]:
wsl bash -c "ss -ltn | grep -E ':5121 ' || echo '  Not running'"
echo.
echo Port 5125 [Add UI/Backend]:
wsl bash -c "ss -ltn | grep -E ':5125 ' || echo '  Not running'"
echo.
echo Port 3306 [Primary MariaDB]:
wsl bash -c "ss -ltn | grep -E ':3306 ' || echo '  Not running'"
echo.
echo Port 3307 [Add MariaDB]:
wsl bash -c "ss -ltn | grep -E ':3307 ' || echo '  Not running'"
exit /b 0

:: ------------------------------------------------------------------------------
:NO_WSL
echo [ERROR] Windows Subsystem for Linux ^(WSL^) is required to run OrangeHRM.
echo Please install WSL by opening PowerShell as Administrator and running:
echo     wsl --install
echo After rebooting, run this script again.
pause
exit /b 1

:: ------------------------------------------------------------------------------
:NO_SCRIPT
echo [ERROR] run-orangehrm.sh not found in "%~dp0".
pause
exit /b 1

:: ------------------------------------------------------------------------------
:SHOW_HELP
echo.
echo OrangeHRM Windows Launcher
echo.
echo Usage:
echo   run-orangehrm.bat [both ^| remove ^| add ^| stop ^| status] [--open]
echo.
echo Options:
echo   both    - [Default] Start both instances:
echo             - Primary on http://localhost:5121
echo             - Add on http://localhost:5125
echo   remove  - Start only the primary instance on http://localhost:5121
echo   add     - Start only the add instance on http://localhost:5125
echo   stop    - Stop all running OrangeHRM web servers and database instances
echo   status  - Display listening ports for OrangeHRM services
echo   --open  - Automatically open the browser after starting
echo   help    - Show this help message
echo.
exit /b 0
