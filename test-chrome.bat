@echo off
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="%cd%/.chrometemp" --disable-web-security "%cd%/test/index.html"
