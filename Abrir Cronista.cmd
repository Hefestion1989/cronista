@echo off
set "CRONISTA_DIR=%~dp0"
start "" "http://127.0.0.1:4327"
cd /d "%CRONISTA_DIR%"
python -m http.server 4327
