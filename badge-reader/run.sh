#!/bin/sh

project_folder="/home/frc2357/pi-clock/badge-reader"

current_time_ms=$(date +%s%3N)
log_file_path="/home/frc2357/logs/$current_time_ms.timeclock.log"

cd /
cd $project_folder
touch $log_file_path
/usr/bin/python3 -u ./src/app.py > $log_file_path 2>&1
cd /
