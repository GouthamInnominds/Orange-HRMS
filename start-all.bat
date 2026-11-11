@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: ==============================================================================
:: OrangeHRM Quality Engineering Platform - Unified Service Launcher (Windows)
:: Starts / checks / stops ALL project services in one command:
::   1. Neo4j Graph Database        (Docker: orangehrm-neo4j -> 7474, 7687)
::   2. MariaDB Relational Database (WSL local mysqld       -> 3306)
::   3. OrangeHRM Web Application   (WSL PHP 8 workers      -> 5121)
::   4. MariaDB Web UI (Adminer)    (WSL PHP Web UI         -> 8080)
::   5. QE Intelligence & Chatbot   (Node.js Express/LLM    -> 4500)
:: ==============================================================================

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"

set "ACTION=start"
set "OPEN_BROWSER=1"
set "NO_PAUSE=0"

:PARSE_ARGS
if "%~1"=="" goto ARGS_DONE
if /i "%~1"=="-h" goto SHOW_HELP
if /i "%~1"=="--help" goto SHOW_HELP
if /i "%~1"=="/?" goto SHOW_HELP
if /i "%~1"=="help" goto SHOW_HELP
if /i "%~1"=="start" (
    set "ACTION=start"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="stop" (
    set "ACTION=stop"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="status" (
    set "ACTION=status"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="restart" (
    set "ACTION=restart"
    shift
    goto PARSE_ARGS
)
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
if /i "%~1"=="--no-open" (
    set "OPEN_BROWSER=0"
    shift
    goto PARSE_ARGS
)
if /i "%~1"=="--no-pause" (
    set "NO_PAUSE=1"
    shift
    goto PARSE_ARGS
)
echo [ERROR] Unrecognized argument: %~1
goto SHOW_HELP

:ARGS_DONE
if /i "%ACTION%"=="status" goto CMD_STATUS
if /i "%ACTION%"=="stop" goto CMD_STOP
if /i "%ACTION%"=="restart" (
    call :DO_STOP
    timeout /t 2 /nobreak >nul
    goto CMD_START
)
goto CMD_START

:: ==============================================================================
:CMD_START
echo ============================================================================
echo   OrangeHRM Quality Engineering Platform - Unified Launcher
echo ============================================================================
echo.

:: 1. Preflight checks
where docker >nul 2>&1 || (
    echo [ERROR] Docker CLI is required but was not found in PATH.
    exit /b 1
)
where wsl >nul 2>&1 || (
    echo [ERROR] Windows Subsystem for Linux ^(WSL^) is required but was not found.
    exit /b 1
)
where node >nul 2>&1 || (
    echo [ERROR] Node.js is required but was not found in PATH.
    exit /b 1
)
if not exist "%ROOT_DIR%\orange_hrm\run-orangehrm.sh" (
    echo [ERROR] Missing "%ROOT_DIR%\orange_hrm\run-orangehrm.sh"
    exit /b 1
)
if not exist "%ROOT_DIR%\tools\qe_app\server.js" (
    echo [ERROR] Missing "%ROOT_DIR%\tools\qe_app\server.js"
    exit /b 1
)
if not exist "%ROOT_DIR%\tools\db_web_ui\index.php" (
    echo [ERROR] Missing "%ROOT_DIR%\tools\db_web_ui\index.php"
    exit /b 1
)
if not exist "%ROOT_DIR%\tools\.env" (
    echo [WARN]  Missing tools\.env - QE Chatbot LLM / DB connectors may fail.
)
if not exist "%ROOT_DIR%\tools\node_modules" (
    echo [1/4] Installing Node dependencies in tools\...
    call npm --prefix "%ROOT_DIR%\tools" install
    if errorlevel 1 (
        echo [ERROR] npm install failed in tools\.
        exit /b 1
    )
)

:: 2. Start Docker Desktop (if needed) & Neo4j container
echo [1/4] Checking Neo4j Graph Database ^(orangehrm-neo4j^)...
call :ENSURE_DOCKER
if errorlevel 1 exit /b 1

docker container inspect orangehrm-neo4j >nul 2>&1
if not errorlevel 1 goto CHECK_EXISTING_NEO4J

echo       Creating Neo4j container orangehrm-neo4j ^(neo4j:5.20-community + APOC^)...
powershell -NoProfile -Command "docker run -d --name orangehrm-neo4j -p 7474:7474 -p 7687:7687 -e 'NEO4J_AUTH=neo4j/admin123' -e 'NEO4J_PLUGINS=[\"apoc\"]' -e 'NEO4J_dbms_security_procedures_unrestricted=apoc.*' mirror.gcr.io/library/neo4j:5.20-community | Out-Null"
if errorlevel 1 (
    echo [ERROR] Failed to create orangehrm-neo4j container.
    exit /b 1
)
goto AFTER_NEO4J

:CHECK_EXISTING_NEO4J
set "NEO_RUNNING="
for /f "delims=" %%S in ('docker inspect -f "{{.State.Running}}" orangehrm-neo4j 2^>nul') do set "NEO_RUNNING=%%S"
if /i "!NEO_RUNNING!"=="true" (
    echo       [OK] Neo4j container is already running.
) else (
    echo       Starting existing orangehrm-neo4j container...
    docker start orangehrm-neo4j >nul
    if errorlevel 1 (
        echo [ERROR] Failed to start orangehrm-neo4j container.
        exit /b 1
    )
)
:AFTER_NEO4J

:: 3. Prepare WSL environment and start OrangeHRM (5121) + project MariaDB (3306)
echo [2/4] Checking MariaDB ^(3306^) and OrangeHRM App ^(5121^)...
call :IS_PORT_UP 5121
set "OHRM_UP=!PORT_UP!"
call :IS_PORT_UP 3306
set "MDB_UP=!PORT_UP!"

if "!OHRM_UP!"=="1" if "!MDB_UP!"=="1" (
    echo       [OK] OrangeHRM ^(5121^) and MariaDB ^(3306^) are already listening.
    goto AFTER_ORANGEHRM
)

:: Stop any conflicting WSL system mariadb service and normalize script line endings
wsl -u root systemctl stop mariadb >nul 2>&1
wsl -e chmod +x orange_hrm/run-orangehrm.sh >nul 2>&1
wsl -e sed -i "s/\r$//" orange_hrm/run-orangehrm.sh >nul 2>&1

echo       Launching MariaDB + OrangeHRM in background window...
start "OrangeHRM + MariaDB (5121 / 3306)" /min wsl -e bash orange_hrm/run-orangehrm.sh remove

:AFTER_ORANGEHRM

:: 4. Start MariaDB Web UI (Adminer) on port 8080
echo [3/4] Checking MariaDB Web UI ^(8080^)...
call :IS_PORT_UP 8080
if "!PORT_UP!"=="1" (
    echo       [OK] MariaDB Web UI ^(8080^) is already listening.
) else (
    echo       Launching MariaDB Web UI ^(Adminer^) in background window...
    start "MariaDB Web UI (8080)" /min wsl -e php -d opcache.enable=0 -S 0.0.0.0:8080 -t tools/db_web_ui
)

:: 5. Start QE Intelligence Web App & Agentic Chatbot on port 4500
echo [4/4] Checking QE Intelligence Platform ^& Chatbot ^(4500^)...
call :IS_PORT_UP 4500
if "!PORT_UP!"=="1" (
    echo       [OK] QE Intelligence Platform ^(4500^) is already listening.
) else (
    echo       Launching QE Intelligence Platform ^(Node.js^) in background window...
    start "QE Intelligence Platform (4500)" /min node tools/qe_app/server.js
)

:: 6. Wait for all TCP + HTTP services to return HTTP 200 / accept connections
echo.
echo Waiting for all services and Web UIs to become ready ^(up to 75s^)...
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; $tcp=@(@{Name='MariaDB SQL';Port=3306},@{Name='Neo4j Bolt';Port=7687}); $http=@(@{Name='QE Platform';Url='http://127.0.0.1:4500/api/v2/quality/metrics'},@{Name='MariaDB Web UI';Url='http://127.0.0.1:8080/'},@{Name='Neo4j Browser';Url='http://127.0.0.1:7474/browser/'},@{Name='OrangeHRM App';Url='http://127.0.0.1:5121/web/index.php/auth/login'}); $deadline=(Get-Date).AddSeconds(75); $ready=@{}; while((Get-Date) -lt $deadline){ foreach($p in $tcp){ if(-not $ready[$p.Name]){ $c=New-Object System.Net.Sockets.TcpClient; try{ $ar=$c.BeginConnect('127.0.0.1',$p.Port,$null,$null); if($ar.AsyncWaitHandle.WaitOne(200,$false) -and $c.Connected){ $c.EndConnect($ar); $ready[$p.Name]=$true; Write-Host ('  [READY] {0,-16} -> 127.0.0.1:{1}' -f $p.Name,$p.Port) } }catch{}finally{ $c.Close() } } }; foreach($h in $http){ if(-not $ready[$h.Name]){ try{ $r=Invoke-WebRequest -UseBasicParsing -Uri $h.Url -TimeoutSec 15; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 400){ $ready[$h.Name]=$true; Write-Host ('  [READY] {0,-16} -> {1} (HTTP {2})' -f $h.Name,$h.Url,$r.StatusCode) } }catch{} } }; if($ready.Count -eq ($tcp.Count + $http.Count)){ exit 0 }; Start-Sleep -Milliseconds 500 }; foreach($p in $tcp){ if(-not $ready[$p.Name]){ Write-Host ('  [TIMEOUT] {0,-14} -> 127.0.0.1:{1}' -f $p.Name,$p.Port) } }; foreach($h in $http){ if(-not $ready[$h.Name]){ Write-Host ('  [TIMEOUT] {0,-14} -> {1}' -f $h.Name,$h.Url) } }; exit 1"
set "WAIT_RC=%ERRORLEVEL%"

echo.
echo ============================================================================
if "%WAIT_RC%"=="0" (
    echo   ALL SERVICES ARE UP AND READY
) else (
    echo   STARTUP COMPLETED WITH WARNINGS ^(see [TIMEOUT] endpoints above^)
)
echo ============================================================================
echo   Browser Web UIs:
echo     1. QE Intelligence ^& Chatbot : http://127.0.0.1:4500
echo     2. OrangeHRM Application     : http://127.0.0.1:5121/web/index.php/auth/login  ^(Admin / Admin@123456^)
echo     3. MariaDB Web UI ^(Adminer^)  : http://127.0.0.1:8080  ^(root / root / orangehrm_mysql^)
echo     4. Neo4j Browser UI          : http://127.0.0.1:7474/browser/  ^(neo4j / admin123^)
echo   Database Protocol Ports ^(non-HTTP - use DB UI / clients^):
echo     5. Neo4j Bolt Endpoint       : bolt://127.0.0.1:7687
echo     6. MariaDB SQL Port          : 127.0.0.1:3306
echo ----------------------------------------------------------------------------
echo   Useful commands:
echo     start-all.bat status    - Check live health of all 6 endpoints
echo     start-all.bat stop      - Stop all OrangeHRM / QE / DB / Neo4j services
echo     start-all.bat --no-open - Start services without launching browser tabs
echo ============================================================================
echo.

if "%OPEN_BROWSER%"=="1" (
    echo Opening Web UIs in default browser...
    start "" "http://127.0.0.1:4500"
    powershell -NoProfile -Command "Start-Sleep -Milliseconds 300" >nul
    start "" "http://127.0.0.1:5121/web/index.php/auth/login"
    powershell -NoProfile -Command "Start-Sleep -Milliseconds 300" >nul
    start "" "http://127.0.0.1:8080"
    powershell -NoProfile -Command "Start-Sleep -Milliseconds 300" >nul
    start "" "http://127.0.0.1:7474/browser/"
)

if "%NO_PAUSE%"=="1" goto AFTER_PAUSE
set "_CMD=%cmdcmdline%"
powershell -NoProfile -Command "if ($env:_CMD -match '(?i)/c') { exit 0 } else { exit 1 }"
if not errorlevel 1 (
    echo Services are running in minimized background windows.
    pause
)
:AFTER_PAUSE
exit /b %WAIT_RC%

:: ==============================================================================
:CMD_STATUS
echo ============================================================================
echo   OrangeHRM Quality Engineering Platform - Service Status
echo ============================================================================
powershell -NoProfile -Command "$ports = @(@{Name='MariaDB SQL';Port=3306;Url='127.0.0.1:3306'},@{Name='QE Intelligence & Chat';Port=4500;Url='http://127.0.0.1:4500'},@{Name='OrangeHRM Web App';Port=5121;Url='http://127.0.0.1:5121'},@{Name='Neo4j HTTP Browser';Port=7474;Url='http://127.0.0.1:7474'},@{Name='Neo4j Bolt';Port=7687;Url='bolt://127.0.0.1:7687'},@{Name='MariaDB Web UI';Port=8080;Url='http://127.0.0.1:8080'}); foreach ($p in $ports) { $c = New-Object System.Net.Sockets.TcpClient; $ok = $false; try { $ar = $c.BeginConnect('127.0.0.1', $p.Port, $null, $null); if ($ar.AsyncWaitHandle.WaitOne(250, $false) -and $c.Connected) { $c.EndConnect($ar); $ok = $true } } catch {} finally { $c.Close() }; if ($ok) { Write-Host ('  [UP]   {0,-24} ({1})' -f $p.Name, $p.Url) } else { Write-Host ('  [DOWN] {0,-24} ({1})' -f $p.Name, $p.Url) } }"
echo ============================================================================
exit /b 0

:: ==============================================================================
:CMD_STOP
call :DO_STOP
exit /b 0

:DO_STOP
echo ============================================================================
echo   Stopping All OrangeHRM QE Platform Services...
echo ============================================================================
echo   [1/4] Stopping QE Intelligence Platform ^(port 4500^)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 4500 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo   [2/4] Stopping MariaDB Web UI ^(port 8080^)...
wsl -e bash -c "pkill -f 'php.*-S 0\.0\.0\.0:8080' 2>/dev/null || true" >nul 2>&1

echo   [3/4] Stopping OrangeHRM ^(5121/5125^) and project-local MariaDB...
wsl -e bash -c "pkill -f 'php.*-S 0\.0\.0\.0:512' 2>/dev/null || true; pkill -TERM -f 'orange_hrm/.runtime/mariadb/usr/sbin/mysqld' 2>/dev/null || true" >nul 2>&1
:: Wait briefly for graceful InnoDB shutdown
powershell -NoProfile -Command "$deadline=(Get-Date).AddSeconds(8); while((Get-Date)-lt $deadline){ $up = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue; if(-not $up){ break }; Start-Sleep -Milliseconds 300 }" >nul 2>&1

echo   [4/4] Stopping Neo4j container ^(orangehrm-neo4j^)...
docker stop orangehrm-neo4j >nul 2>&1

echo [OK] Stop signal sent to all services. Run "start-all.bat status" to verify.
exit /b 0

:: ==============================================================================
:ENSURE_DOCKER
docker info >nul 2>&1
if not errorlevel 1 exit /b 0
set "DOCKER_EXE="
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" set "DOCKER_EXE=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if "!DOCKER_EXE!"=="" if exist "%LocalAppData%\Programs\Docker\Docker\Docker Desktop.exe" set "DOCKER_EXE=%LocalAppData%\Programs\Docker\Docker\Docker Desktop.exe"
if "!DOCKER_EXE!"=="" (
    echo [ERROR] Docker Engine is not running and Docker Desktop.exe was not found.
    exit /b 1
)
echo       Starting Docker Desktop...
start "" "!DOCKER_EXE!"
set /a _dwait=0
:WAIT_DOCKER_LOOP
docker info >nul 2>&1
if not errorlevel 1 exit /b 0
set /a _dwait+=1
if !_dwait! GEQ 30 (
    echo [ERROR] Timed out waiting for Docker Engine to become ready.
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto WAIT_DOCKER_LOOP

:: ==============================================================================
:IS_PORT_UP
set "PORT_UP=0"
netstat -ano -p TCP 2>nul | findstr /R /C:":%~1 .*LISTENING" >nul 2>&1
if %ERRORLEVEL% equ 0 set "PORT_UP=1"
exit /b 0

:: ==============================================================================
:SHOW_HELP
echo.
echo Usage: start-all.bat [start ^| stop ^| restart ^| status ^| help] [--no-open] [--no-pause]
echo.
echo   start       Start all services and open Web UIs in default browser (default)
echo   stop        Stop all project services gracefully
echo   restart     Stop and start all project services
echo   status      Show UP/DOWN status for every service port
echo   --no-open   Start services without opening browser tabs
echo   --no-pause  Do not wait for keypress when invoked via cmd /c
echo.
exit /b 0
