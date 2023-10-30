@echo off
setlocal enabledelayedexpansion

for %%I in (curl.exe) do (
	set "request=%%~$PATH:I"
)

set "list="
for /r "%~3" %%F in (*.csv) do (
	set "list=!list! %%F"
)

for %%L in (%list%) do (
	set "name=%%~nxL"
	set "route=%%~dpL"

	set "folder=!route:~0,-1!"
	set "folder=!folder:%~3\=!"

	set "drive=/Backup Diario/%~2/!folder!"
	if "!folder!"=="%~3" set "drive=/Backup Diario/%~2"

	set "url=%~1/api/upload-file"

	echo.
	echo Uploading !name! ...
	echo.

	!request! -X POST ^
		-H "accept: application/json" ^
		-H "Content-Type: multipart/form-data" ^
		-F "file=@"!route!!name!;type=text/csv"" ^
		-F "path=!drive!" ^
		!url! >nul 2>nul

	echo OK
	echo.
)
