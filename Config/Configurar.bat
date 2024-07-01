@echo off
setlocal

REM Mostrar la ruta actual del archivo .bat (para verificar)
echo Ruta actual del archivo .bat:
echo %cd%
echo.

REM Ruta del ejecutable que deseas copiar
set "executable_path=%~dp0youtube_downloader.exe"

REM Ruta de la carpeta de inicio de programas (Startup)
set "startup_folder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

REM Copiar el archivo ejecutable al inicio de programas
copy "%executable_path%" "%startup_folder%"

REM Verificar si la copia fue exitosa
if exist "%startup_folder%\youtube_downloader.exe" (
    echo Archivo copiado exitosamente al inicio de programas.
    
    REM Ejecutar el archivo .exe copiado
    start "" "%startup_folder%\youtube_downloader.exe"
) else (
    echo Error al copiar el archivo al inicio de programas.
)

pause
