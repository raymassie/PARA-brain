@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo PARA Clipper needs Node.js 22 or newer. Install it from https://nodejs.org, then open this file again.
  pause
  exit /b 1
)
node System\scripts\web-clipper\start.mjs
