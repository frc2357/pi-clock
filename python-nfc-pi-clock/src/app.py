import board

print(dir(board))

exit()

import os
import atexit
import asyncio
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from nfc_poll import NFCPoll
from display import Display
from read_settings_json import read_settings_json
from write_credentials_json import write_credentials_json
from sheets import Sheets

SETTINGS_FILE = "./timeclock.json"
PING_HOSTNAME = "google.com"

settings = read_settings_json(SETTINGS_FILE)

class LocalState:
    has_internet = False
    display = None
    sheets = None
    nfc_poll = None
    nfc_tag_id = None

    def __init__(self):
        self.display = Display()
        self.sheets = Sheets(settings["spreadsheet_id"])
        self.nfc_poll = NFCPoll()
        self.nfc_poll.nfc_open()

    def check_internet(self):
        response = os.system(f"ping -c 1 {PING_HOSTNAME}")
        had_internet = self.has_internet
        self.has_internet = (response == 0)
        
        if not had_internet and self.has_internet:
            print("Internet connection is UP")
            self.sheets.auth()
        elif had_internet and not self.has_internet:
            print("Internet connection is DOWN")

        return self.has_internet

    def update_nfc(self):
        prev_nfc_tag_id = self.nfc_tag_id
        self.nfc_tag_id = self.nfc_poll.nfc_poll()

        if prev_nfc_tag_id != self.nfc_tag_id and self.nfc_tag_id != None:
            self.display.scanning()
            self.handle_clock_in_out(self.nfc_tag_id)

    def update_display(self):
        self.display.update_display()

    def handle_clock_in_out(self, nfc_tag_id):
        when = datetime.now()
        self.sheets.fetch_roster()
        user_name = self.sheets.find_name_by_nfc(nfc_tag_id)

        if user_name == None:
            self.display.unrecognized_nfc(nfc_tag_id)
            return

        self.sheets.fetch_timesheet()
        clock_in_row = self.sheets.find_timesheet_clocked_in_row(user_name)

        if clock_in_row:
            self.sheets.clock_out(clock_in_row, when)
            self.display.clock_out(user_name, when)
        else:
            self.sheets.clock_in(user_name, when)
            self.display.clock_in(user_name, when)

print("Creating local state...")
local_state = LocalState()

scheduler = BackgroundScheduler()
def update_nfc():
    local_state.update_nfc()

def update_display():
    local_state.update_display()

def check_internet():
    local_state.check_internet()

print("Scheduling tasks...")
scheduler.add_job(func=update_display, trigger="interval", seconds=1, id="update_display")
scheduler.add_job(func=check_internet, trigger="interval", minutes=15, id="check_internet")
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

write_credentials_json(settings)
check_internet()

print("Main loop")

async def main():
    while True:
        update_nfc()
        await asyncio.sleep(0.5)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
