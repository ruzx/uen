@echo off
rem Double-click: creates missing WAV files for all packs with the installed Tatar TTS voice.
rem Extra options are passed through, e.g.:  make-voice.bat -Force -Rate -2
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tts-to-wav.ps1" %*
pause
