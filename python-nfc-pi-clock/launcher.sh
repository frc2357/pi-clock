#!/bin/sh

cd /
cd home/frc2357/pi-clock/python-nfc-pi-clock
touch /home/frc2357/logs/timeclock.log
python3 -u ./src/app.py
cd /