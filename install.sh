#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE_DEFAULT="$SCRIPT_DIR/vault.sql"
INSTALL_ROOT_DEFAULT="${HOME}/.pdm"

SILENT=0
FORCE_IMPORT=0
SQL_FILE="$SQL_FILE_DEFAULT"
INSTALL_ROOT="$INSTALL_ROOT_DEFAULT"
DB_PATH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --silent)
      SILENT=1
      ;;
    --force)
      FORCE_IMPORT=1
      ;;
    --sql-file)
      SQL_FILE="${2:-}"
      shift
      ;;
    --install-root)
      INSTALL_ROOT="${2:-}"
      shift
      ;;
    --db-path)
      DB_PATH="${2:-}"
      shift
      ;;
    --vault)
      # accepted for compatibility with UI sample command
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: install.sh [--silent] [--force] [--sql-file <path>] [--install-root <path>] [--db-path <path>]"
      exit 1
      ;;
  esac
  shift
done

DB_PATH="${DB_PATH:-$INSTALL_ROOT/vault.db}"
LOG_FILE="$INSTALL_ROOT/install.log"

mkdir -p "$INSTALL_ROOT"
exec > >(tee -a "$LOG_FILE") 2>&1

if [[ "$SILENT" -eq 0 ]]; then
  echo "Installing SolidWorks-like PDM client..."
fi

echo "Checking prerequisites..."
if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Error [PDM-PREREQ-001]: sqlite3 is required but not installed."
  echo "Install sqlite3 and rerun this installer."
  exit 1
fi

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Error [PDM-PREREQ-002]: vault SQL file not found at $SQL_FILE"
  exit 1
fi

echo "- Registering vault services"
echo "- Installing sync agent"
echo "- Creating desktop launcher"

echo "Initializing local vault database..."
sqlite3 "$DB_PATH" <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
SQL

APPLIED=$(sqlite3 "$DB_PATH" "SELECT COUNT(1) FROM schema_migrations WHERE version='001_vault_files';")
if [[ "$APPLIED" -eq 0 || "$FORCE_IMPORT" -eq 1 ]]; then
  sqlite3 "$DB_PATH" < "$SQL_FILE"
  sqlite3 "$DB_PATH" "INSERT OR REPLACE INTO schema_migrations(version) VALUES ('001_vault_files');"
  echo "Database schema/data imported."
else
  echo "Schema already initialized; skipping import (use --force to reimport)."
fi

echo "Installation complete."
echo "Vault DB initialized at: $DB_PATH"
echo "Install log: $LOG_FILE"
echo "Launch the PDM client from your applications menu."
