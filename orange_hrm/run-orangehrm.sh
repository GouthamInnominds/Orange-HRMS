#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_PORT=5121
ADD_PORT=5125
DEFAULT_DB_PORT=3306
ADD_DB_PORT=3307
RUNTIME_DIR="$ROOT_DIR/.runtime"
PHP_EXTENSION_DIR="$RUNTIME_DIR/php/usr/lib/php/20190902"
MARIADB_DIR="$RUNTIME_DIR/mariadb"
BASE_MARIADB_DATA_DIR="$RUNTIME_DIR/mariadb-data"
ADD_MARIADB_DATA_DIR="$RUNTIME_DIR/mariadb-data-add"
RUN_DIR="$RUNTIME_DIR/run"
BASE_SESSION_DIR="$RUNTIME_DIR/sessions"
PROXY_DIR="$ROOT_DIR/src/config/proxy"
WORK_LOCATION_ACTION="${1:-both}"
PORT="$DEFAULT_PORT"
DB_PORT="$DEFAULT_DB_PORT"
MARIADB_DATA_DIR="$BASE_MARIADB_DATA_DIR"
SESSION_DIR="$BASE_SESSION_DIR-remove"

if [[ "$WORK_LOCATION_ACTION" == "keep" || "$WORK_LOCATION_ACTION" == "remove" ]]; then
    SESSION_DIR="$BASE_SESSION_DIR-remove"
fi

if [[ "$WORK_LOCATION_ACTION" == "add" ]]; then
    PORT="$ADD_PORT"
    DB_PORT="$ADD_DB_PORT"
    MARIADB_DATA_DIR="$ADD_MARIADB_DATA_DIR"
    SESSION_DIR="$BASE_SESSION_DIR-add"
fi

MARIADB_PID_FILE="$RUN_DIR/mariadb-${DB_PORT}.pid"
MYSQL_SOCKET="/tmp/mysql-${DB_PORT}.sock"
MARIADB_LOG_FILE="$RUN_DIR/mariadb-${DB_PORT}.log"
APP_ENV_VARS=(
    "OHRM_DB_HOST=127.0.0.1"
    "OHRM_DB_PORT=$DB_PORT"
    "OHRM_DB_NAME=orangehrm_mysql"
    "OHRM_DB_USER=root"
    "OHRM_DB_PASS=root"
)

if [[ "$WORK_LOCATION_ACTION" == "both" ]]; then
    echo "Starting remove instance on port $DEFAULT_PORT and add instance on port $ADD_PORT..."
    "$ROOT_DIR/run-orangehrm.sh" remove &
    remove_pid="$!"

    "$ROOT_DIR/run-orangehrm.sh" add &
    add_pid="$!"

    cleanup_both() {
        kill "$remove_pid" "$add_pid" 2>/dev/null || true
        wait "$remove_pid" 2>/dev/null || true
        wait "$add_pid" 2>/dev/null || true
    }

    trap cleanup_both EXIT
    trap 'exit 130' INT TERM

    wait -n "$remove_pid" "$add_pid"
    status="$?"
    echo "One OrangeHRM instance exited; stopping the other."
    exit "$status"
fi

port_is_listening() {
    local port="$1"
    ss -H -ltn 2>/dev/null | awk -v suffix=":${port}" '$4 ~ suffix "$" { found = 1 } END { exit !found }'
}

listener_pids() {
    local port="$1"
    ss -H -ltnp 2>/dev/null \
        | awk -v suffix=":${port}" '$4 ~ suffix "$"' \
        | grep -oE 'pid=[0-9]+' \
        | cut -d= -f2 \
        | sort -u || true
}

process_command() {
    local pid="$1"
    tr '\0' ' ' <"/proc/$pid/cmdline" 2>/dev/null || true
}

wait_for_port_to_close() {
    local port="$1"
    for _ in {1..20}; do
        port_is_listening "$port" || return 0
        sleep 1
    done
    return 1
}

fail() {
    echo "OrangeHRM launcher error: $*" >&2
    exit 1
}

cleanup() {
    true
}

trap cleanup EXIT
trap 'exit 130' INT TERM

sync_work_location_menu() {
    local ext_args=()
    for extension in mysqlnd pdo_mysql; do
        if ! php -m 2>/dev/null | grep -qi "^$extension$"; then
            if [[ -f "$PHP_EXTENSION_DIR/${extension}.so" ]]; then
                ext_args+=(-d "extension=$PHP_EXTENSION_DIR/${extension}.so")
            fi
        fi
    done

    env "${APP_ENV_VARS[@]}" ACTION="$WORK_LOCATION_ACTION" ROOT_DIR="$ROOT_DIR" SESSION_DIR="$SESSION_DIR" php \
        -d "session.save_path=$SESSION_DIR" \
        -d session.use_cookies=0 \
        -d session.cache_limiter= \
        "${ext_args[@]}" <<'PHP'
<?php

$action = getenv('ACTION');
$rootDir = getenv('ROOT_DIR');
$sessionDir = getenv('SESSION_DIR');

require $rootDir . '/src/vendor/autoload.php';
require $rootDir . '/lib/confs/Conf.php';

$conf = new Conf();
$pdo = new PDO(
    sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $conf->getDbHost(),
        $conf->getDbPort(),
        $conf->getDbName()
    ),
    $conf->getDbUser(),
    $conf->getDbPass(),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

if ($action === 'add') {
    $pdo->exec(<<<'SQL'
INSERT INTO ohrm_menu_item
    (menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
SELECT
    'Work Location', screen.id, job.id, 3, 600, 1, NULL
FROM ohrm_menu_item job
JOIN ohrm_screen screen ON screen.action_url = 'viewLocations'
WHERE job.menu_title = 'Job'
  AND job.level = 2
  AND NOT EXISTS (
      SELECT 1
      FROM ohrm_menu_item existing
      WHERE existing.menu_title = 'Work Location'
        AND existing.parent_id = job.id
  )
LIMIT 1
SQL);
} elseif ($action === 'remove') {
    $pdo->exec(<<<'SQL'
DELETE child
FROM ohrm_menu_item child
JOIN ohrm_menu_item parent ON parent.id = child.parent_id
WHERE child.menu_title = 'Work Location'
  AND parent.menu_title = 'Job'
  AND parent.level = 2
SQL);
}

$status = $pdo->query(<<<'SQL'
SELECT COUNT(*)
FROM ohrm_menu_item child
JOIN ohrm_menu_item parent ON parent.id = child.parent_id
WHERE child.menu_title = 'Work Location'
  AND parent.menu_title = 'Job'
  AND parent.level = 2
SQL)->fetchColumn();

$cleared = 0;
foreach (glob($sessionDir . '/sess_*') as $file) {
    $sessionId = substr(basename($file), 5);
    if (!preg_match('/^[a-zA-Z0-9,-]+$/', $sessionId)) {
        continue;
    }

    session_id($sessionId);
    if (!session_start()) {
        continue;
    }

    $changed = false;
    if (isset($_SESSION['_sf2_attributes']) && is_array($_SESSION['_sf2_attributes'])) {
        foreach (array_keys($_SESSION['_sf2_attributes']) as $key) {
            if (
                $key === 'core.menu.side_panel'
                || $key === 'core.menu.top_ribbon_keys'
                || strpos($key, 'core.menu.top_ribbon.') === 0
            ) {
                unset($_SESSION['_sf2_attributes'][$key]);
                $changed = true;
            }
        }
    }

    session_write_close();
    if ($changed) {
        $cleared++;
    }
}

echo 'Work Location: ' . ($status > 0 ? 'visible' : 'hidden') . "\n";
echo "Menu caches cleared: $cleared\n";
PHP
}

stop_existing_web_server() {
    port_is_listening "$PORT" || return 0

    local pids=()
    mapfile -t pids < <(listener_pids "$PORT")
    [[ ${#pids[@]} -gt 0 ]] || fail "Port $PORT is in use, but its process could not be identified."

    local pid command cwd
    for pid in "${pids[@]}"; do
        command="$(process_command "$pid")"
        cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
        if [[ "$cwd" != "$ROOT_DIR" || "$command" != *"php "* || "$command" != *"-S 0.0.0.0:$PORT"* ]]; then
            fail "Port $PORT is used by an unrelated process (PID $pid); refusing to stop it."
        fi
    done

    echo "Stopping existing OrangeHRM web server on port $PORT..."
    for pid in "${pids[@]}"; do
        kill "$pid"
    done
    wait_for_port_to_close "$PORT" || fail "The existing web server did not stop within 20 seconds."
}

ensure_mariadb_running() {
    local pids=()
    local pid command

    if port_is_listening "$DB_PORT"; then
        mapfile -t pids < <(listener_pids "$DB_PORT")
        [[ ${#pids[@]} -gt 0 ]] || fail "Port $DB_PORT is in use, but its process could not be identified."

        for pid in "${pids[@]}"; do
            command="$(process_command "$pid")"
            if [[ "$command" != *"$MARIADB_DIR/usr/sbin/mysqld"* || "$command" != *"--datadir=$MARIADB_DATA_DIR"* ]]; then
                fail "Port $DB_PORT is used by an unrelated database (PID $pid); refusing to continue."
            fi
        done

        echo "Reusing existing project-local MariaDB on port $DB_PORT..."
        return 0
    fi

    rm -f "$MARIADB_PID_FILE"

    echo "Starting project-local MariaDB on 127.0.0.1:$DB_PORT..."
    env LD_LIBRARY_PATH="$MARIADB_DIR/usr/lib/x86_64-linux-gnu" \
        "$MARIADB_DIR/usr/sbin/mysqld" \
        --no-defaults \
        --basedir="$MARIADB_DIR/usr" \
        --datadir="$MARIADB_DATA_DIR" \
        --plugin-dir="$MARIADB_DIR/usr/lib/mysql/plugin" \
        --bind-address=0.0.0.0 \
        --port="$DB_PORT" \
        --socket="$MYSQL_SOCKET" \
        --pid-file="$MARIADB_PID_FILE" \
        --log-error="$MARIADB_LOG_FILE" \
        --user="$(id -un)" \
        --innodb-flush-log-at-trx-commit=2 \
        --innodb-buffer-pool-size=256M \
        --skip-name-resolve &
    local started_mariadb_pid="$!"

    local mariadb_is_running=false
    for _ in {1..30}; do
        if port_is_listening "$DB_PORT"; then
            mariadb_is_running=true
            break
        fi
        kill -0 "$started_mariadb_pid" 2>/dev/null || fail "MariaDB failed to start; check $RUN_DIR/mariadb.log."
        sleep 1
    done

    [[ "$mariadb_is_running" == true ]] || fail "MariaDB did not become ready within 30 seconds."
}

ensure_add_mariadb_data_dir() {
    if [[ "$WORK_LOCATION_ACTION" != "add" ]]; then
        return 0
    fi

    if [[ -d "$MARIADB_DATA_DIR/mysql" ]]; then
        return 0
    fi

    [[ -d "$BASE_MARIADB_DATA_DIR/mysql" ]] || fail "Base MariaDB data directory is not initialized."

    echo "Initializing add-mode MariaDB data directory..."
    cp -a "$BASE_MARIADB_DATA_DIR" "$MARIADB_DATA_DIR"
}

command -v php >/dev/null || fail "PHP is not installed."
command -v ss >/dev/null || fail "The 'ss' command is required."

if [[ "$WORK_LOCATION_ACTION" != "keep" && "$WORK_LOCATION_ACTION" != "add" && "$WORK_LOCATION_ACTION" != "remove" && "$WORK_LOCATION_ACTION" != "both" ]]; then
    fail "Usage: $0 [add|remove|both]"
fi

[[ -f "$ROOT_DIR/src/vendor/autoload.php" ]] || fail "Run Composer install first; src/vendor/autoload.php is missing."
[[ -f "$ROOT_DIR/web/dist/js/app.js" ]] || fail "Build the frontend first; web/dist/js/app.js is missing."
[[ -x "$MARIADB_DIR/usr/sbin/mysqld" ]] || fail "The project-local MariaDB runtime is missing from .runtime."
[[ -d "$BASE_MARIADB_DATA_DIR/mysql" ]] || fail "The project-local MariaDB data directory is not initialized."

PHP_ARGS=(
    -d "session.save_path=$SESSION_DIR"
    -d "opcache.enable=1"
    -d "opcache.enable_cli=1"
    -d "opcache.memory_consumption=256"
    -d "opcache.interned_strings_buffer=16"
    -d "opcache.max_accelerated_files=20000"
    -d "opcache.revalidate_freq=60"
    -d "opcache.fast_shutdown=1"
    -d "realpath_cache_size=4096k"
    -d "realpath_cache_ttl=600"
    -d "memory_limit=512M"
)

# Load extensions from .runtime only if they are not already built into system PHP
for extension in gd ldap mysqlnd pdo_mysql; do
    if ! php -m 2>/dev/null | grep -qi "^$extension$"; then
        if [[ -f "$PHP_EXTENSION_DIR/${extension}.so" ]]; then
            PHP_ARGS+=(-d "extension=$PHP_EXTENSION_DIR/${extension}.so")
        fi
    fi
done

mkdir -p "$RUN_DIR" "$SESSION_DIR" "$PROXY_DIR"

ensure_add_mariadb_data_dir

stop_existing_web_server
ensure_mariadb_running

sync_work_location_menu

if [[ ! -f "$PROXY_DIR/__CG__OrangeHRMEntityEmployee.php" ]]; then
    echo "Generating Doctrine proxy classes..."
    env "${APP_ENV_VARS[@]}" php "${PHP_ARGS[@]}" "$ROOT_DIR/bin/console" orm:generate-proxies
fi

echo "Clearing OrangeHRM application cache..."
env "${APP_ENV_VARS[@]}" php "${PHP_ARGS[@]}" "$ROOT_DIR/bin/console" cache:clear

echo "Starting optimized OrangeHRM (8 workers + OPcache) at http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop OrangeHRM."
cd "$ROOT_DIR"
env "${APP_ENV_VARS[@]}" PHP_CLI_SERVER_WORKERS=8 php "${PHP_ARGS[@]}" -S "0.0.0.0:$PORT"
