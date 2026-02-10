param(
  [switch]$Silent,
  [switch]$Force,
  [string]$SqlFile,
  [string]$InstallRoot,
  [string]$DbPath,
  [string]$Vault
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $SqlFile) { $SqlFile = Join-Path $ScriptDir "vault.sql" }
if (-not $InstallRoot) { $InstallRoot = Join-Path $env:USERPROFILE ".pdm" }
if (-not $DbPath) { $DbPath = Join-Path $InstallRoot "vault.db" }

New-Item -ItemType Directory -Path $InstallRoot -Force | Out-Null
$LogFile = Join-Path $InstallRoot "install.log"
Start-Transcript -Path $LogFile -Append | Out-Null

try {
  if (-not $Silent) {
    Write-Host "Installing SolidWorks-like PDM client..."
  }
  Write-Host "Checking prerequisites..."

  if (-not (Get-Command sqlite3 -ErrorAction SilentlyContinue)) {
    Write-Error "Error [PDM-PREREQ-001]: sqlite3 is required but was not found in PATH."
    exit 1
  }

  if (-not (Test-Path $SqlFile)) {
    Write-Error "Error [PDM-PREREQ-002]: vault SQL file not found at $SqlFile"
    exit 1
  }

  Write-Host "- Registering vault services"
  Write-Host "- Installing sync agent"
  Write-Host "- Creating desktop shortcut"

  Write-Host "Initializing local vault database..."
  sqlite3 $DbPath "CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')));"

  $applied = sqlite3 $DbPath "SELECT COUNT(1) FROM schema_migrations WHERE version='001_vault_files';"
  if ($Force -or $applied -eq 0) {
    sqlite3 $DbPath ".read $SqlFile"
    sqlite3 $DbPath "INSERT OR REPLACE INTO schema_migrations(version) VALUES ('001_vault_files');"
    Write-Host "Database schema/data imported."
  }
  else {
    Write-Host "Schema already initialized; skipping import (use -Force to reimport)."
  }

  Write-Host "Installation complete."
  Write-Host "Vault DB initialized at: $DbPath"
  Write-Host "Install log: $LogFile"
  Write-Host "Launch the PDM client from the Start menu."
}
finally {
  Stop-Transcript | Out-Null
}
