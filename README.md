# pi-clock

A timeclock time tracker for FRC teams that is based on a minimal installation on a Raspberry PI running on Balena using Google Sheets for time logging.

## How it works

### Overall design

This is designed to be as hassle-free as possible, as school teams often have limited/locked down digital capabilities. The "database" for the clock is a single google sheet, and each
clock-in will append a new row in the sheet, and each clock-out will add the clock-out time
to the existing created row. The "server" for the app runs on a Raspberry Pi on a
[Balena](https://www.balena.io/) fleet device, which is port-forwarded to the internet.
Users can authenticate via OAuth2 on the http server app and then clock in and out.
In addition to this method, the Raspberry Pi can be kept by the door of the workshop
and can be fitted with an NFC reader and a character LCD to facilitate using NFC tags
for clocking in and out at the door of the workshop.

## Requirements

### Overall requirements

- A Google Sheet for time log tracking
- A Google Cloud account (for the App ID and Client ID, no billable functionality needed)
- A Raspberry Pi (any will do, Raspberry Pi Zero W is a good choice)
- A Balena account (the first 10 devices are free)

### For web use

- All users need a google account which is granted write access to the google sheet
- (optional) A domain/subdomain with "frame forwarding" functionality

### For in-shop use

- NFC Reader
- Character LCD
- A NFC tag for each user (stickers are fine)
- 3D printer (basically any will do) for the clock housing
- Wi-Fi or ethernet internet connection for the RPi

## Details

### Balena App

The balena app consists of two docker apps. One for the web server, and one for
the local NFC app. The web server app is a node app on the backend and a React
app on the front end. The NFC app is in Python and uses the I2C port on the
Raspberry Pi. The Character LCD also uses I2C for displaying information
when an NFC tag is scanned.

### Network Routing

The http server on the RPi will be port-forwarded to the internet under a balena subdomain.
From here, it's commended to use your own domain but you'll need to use a "frame forwarding"
service (not a simple CNAME entry) which will wrap the SSL certificate as well.

### Security

Since authentication is either done via user OAuth2 privileges or through a local network
device with an App Id (the Raspberry Pi) the security should be just as good as the rest
of Google OAuth2 services. The only security hole is that each user in the system
(including students) will have write access to the spreadsheet and can thus change
their own or other time entries. However, Google Sheets do log history so if there were
any tampering to occur, the change history would be visible.
