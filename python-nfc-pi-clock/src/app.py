import atexit
from datetime import datetime, timedelta
from flask import Flask, request, json
from apscheduler.schedulers.background import BackgroundScheduler
from nfc_poll import NFCPoll
from display import Display
from write_credentials_json import write_credentials_json
from sheets import Sheets

class LocalState:
    display = None
    sheets = None
    nfc_poll = None
    nfc_tag_id = None

    def __init__(self):
        self.display = Display()
        self.sheets = Sheets()
        self.nfc_poll = NFCPoll()
        self.nfc_poll.nfc_open()


    def update_nfc(self):
        prev_nfc_tag_id = self.nfc_tag_id
        self.nfc_tag_id = self.nfc_poll.nfc_poll()

        if prev_nfc_tag_id != self.nfc_tag_id and self.nfc_tag_id != None:
            self.display.scanning()
            self.handle_clock_in_out(self.nfc_tag_id)

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

local_state = LocalState()

def update_nfc():
    local_state.update_nfc()

def update_display():
    local_state.display.update_display()

write_credentials_json()
local_state.sheets.auth()

scheduler = BackgroundScheduler()
scheduler.add_job(func=update_nfc, trigger="interval", seconds=1)
scheduler.add_job(func=update_display, trigger="interval", seconds=1)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
