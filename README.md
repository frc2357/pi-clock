# pi-clock

A timeclock time tracker for FRC teams that is based on a minimal installation on a Raspberry PI running on Balena using Google Sheets for time logging.

## How it works

### Overall design

This is designed to be as hassle-free as possible, as school teams often have limited/locked down digital capabilities.
The "database" for the clock is a single google sheet, and each clock-in will append a new row in the sheet,
and each clock-out will add the clock-out time to the existing created row.

There are two parts to this implementation:

#### Web app hosted by GitHub Pages

This is a single-page React App that is served by GitHub Pages.
It simply hosts the files, and all of the actual code is run in the browser.
Through this app, each user can authenticate to their GMail account, clock in, and clock out.
It is also optimized for mobile browsers. This part can be run
independently of the Raspberry Pi if you have no need for NFC badge clock-in/out.

#### Raspberry Pi NFC Timeclock

The Raspberry Pi Timeclock runs on any Raspberry Pi. We use a Raspberry Pi 3a.
It uses a PN532 NFC module and a 20x4 Character LCD. The python code manages the NFC
module, the LCD, and the connection to Google Sheets.

## Requirements

### Overall requirements

- A Google Sheet for time log tracking
- A Google Cloud account (for the App ID and Client ID, no billable functionality needed)

### For web use

- A GitHub repository that can be used for your GitHub Pages hosted site
- All users need a google account which is granted write access to the google sheet

### For in-shop use

- Raspberry Pi (likely any will do, we use a RPi 3a)
- SD Card (for Raspberry Pi, at least 8gb, and class 10 speed)
- 3 Amp Power Supply for the Raspberry Pi
- PN532 NFC Reader
- 20x4 Character LCD with i2c backpack
- A NFC tag for each user
- 3D printer for the clock housing
- Wi-Fi or ethernet internet connection for the RPi

## Details

Here we go into the details about how to set up this system

### Google Cloud Setup

TODO

### GitHub Pages Setup

You'll want to fork our repo as a start. This will also give you a repo from which you can host your web app.

TODO

### Raspberry Pi Hardware Setup

You'll need to wire up both your NFC reader and LCD via i2c on your Raspberry Pi. You may need to solder
headers or wires to do so. Then they will both need to connect to the i2c bus on your Raspberry Pi GPIO pins.

(Diagram of RPi GPIO pins)

### Raspberry Pi OS Setup

You shouldn't ever need to put a keyboard or monitor on the Raspberry Pi.
All of the following instructions involve accessing it through the network.
Make sure you have an SSH client you can use to connect to it.

#### Install Raspberry Pi OS

Use the Raspberry Pi Imager to configure and setup your Raspberry Pi

1. Download Raspberry Pi Imager from https://www.raspberrypi.com/software/
2. Install and run Imager program
3. Choose Operating System: Raspberry Pi OS (other), then Raspberry Pi OS Lite (32-bit)
4. Insert SD card and choose it for Storage
5. Click the Gear at bottom-right for advanced options
6. Set hostname (we used "timeclock.local")
7. Enable SSH (use password authentication)
8. Set username and password to something other than defaults (we used "frc2357")
9. Configure wireless LAN to your Shop's WiFi if you're using WiFi for your connectivity
10. Set locale settings to your timezone (this will affect clock-in/clock-out times)
11. Click Save, then click Write

After you've done the above, replace the SD Card into your Raspberry Pi and power it up.
After a few minutes you should be able to ping it at the hostname you set in step #6 above

```
$ ping timeclock.local
PING timeclock.local (192.168.xx.20): 56 data bytes
64 bytes from 192.168.xx.20: icmp_seq=0 ttl=64 time=189.155 ms
64 bytes from 192.168.xx.20: icmp_seq=1 ttl=64 time=13.877 ms
64 bytes from 192.168.xx.20: icmp_seq=2 ttl=64 time=12.346 ms
```

Next, SSH into your Raspberry Pi using the username and password you set up in step #8 above.
It will likely want you to confirm an SSH key fingerprint, this is normal.

```
ssh frc2357@timeclock.local
...
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
frc2357@timeclock:~ $
```

Next you'll want to run the Raspberry Pi Configuration tool

```
sudo raspi-config
```

1. Select Interface Options
2. Select I2C
3. Enable I2C
4. Select Finish

From here, you'll want to run these commands on your Raspberry Pi in your ssh session:

```
sudo apt-get update
sudo apt install git
curl -sSL https://get.docker.com/ | sudo sh
git clone https://github.com/frc2357/pi-clock.git  # Substitute the url of your forked repo here
cd pi-clock
sudo docker compose build
```

Then you'll need to add the docker startup to

```
sudo pico /etc/rc.local
```

Inside the editor, paste the following line towards the bottom, just above the `exit 0` line.

```
TZ=`cat /etc/timezone` sudo docker compose --project-directory=/home/frc2357/pi-clock up -d &
```

### Timeclock Software Setup

### Raspbery Pi System Testing

#### 3D Printing

#### Final Testing

### Notes on Security

Since authentication is either done via user OAuth2 privileges or through a local network
device with an App Id (the Raspberry Pi) the security should be just as good as the rest
of Google OAuth2 services. The only security hole is that each user in the system
(including students) will have write access to the spreadsheet and can thus change
their own or other time entries. However, Google Sheets do log history so if there were
any tampering to occur, the change history would be visible.

## Tips and Troubleshooting

### WiFi Setup

If you're shop has WiFi and you're setting this up at home, many home routers have a "guest" SSID you can set to the exact same name and password as your shop WiFi. This makes testing seamless.
