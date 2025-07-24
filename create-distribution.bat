@echo off
echo Creating distribution package for My Family Finances v1.0.5...
cd dist
echo Compressing application files...
powershell -command "Compress-Archive -Path 'MyFamilyFinances-win32-x64' -DestinationPath 'MyFamilyFinances-1.0.5-Windows.zip' -Force"
echo Distribution package created: dist/MyFamilyFinances-1.0.5-Windows.zip
echo.
echo To install:
echo 1. Extract the ZIP file to any folder
echo 2. Run MyFamilyFinances.exe from the extracted folder
echo.
pause