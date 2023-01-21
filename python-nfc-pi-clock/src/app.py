import atexit
from datetime import datetime
from flask import Flask, json
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

    def update_roster(self):
        self.sheets.fetch_roster()

    def update_nfc(self):
        prev_nfc_tag_id = self.nfc_tag_id
        self.nfc_tag_id = self.nfc_poll.nfc_poll()

        if prev_nfc_tag_id != self.nfc_tag_id:
            if self.nfc_tag_id != None:
                # TODO: Lookup name and show that instead
                # TODO: See if this is a clock in or clock out
                self.clock_in(self.nfc_tag_id)

    def update_display(self):
        self.display.update_display()

    def clock_in(self, nfc_tag_id, now = datetime.now()):
        self.display.clock_in(nfc_tag_id, now)

    def clock_out(self, nfc_tag_id, now = datetime.now()):
        self.display.clock_out(nfc_tag_id, now)

local_state = LocalState()

def update_nfc():
    local_state.update_nfc()

def update_display():
    local_state.update_display()

write_credentials_json()
local_state.sheets.auth()
local_state.update_roster()

scheduler = BackgroundScheduler()
scheduler.add_job(func=update_nfc, trigger="interval", seconds=1)
scheduler.add_job(func=update_display, trigger="interval", seconds=1)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__)

@app.route('/nfc_tag_id')
def nfc_tag_id_endpoint():
    nfcData = { "nfc_tag_id": None }
    return json.dumps(nfcData)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
