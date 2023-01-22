import atexit
from datetime import datetime, timedelta
from flask import Flask, request, json
from apscheduler.schedulers.background import BackgroundScheduler
from nfc_poll import NFCPoll
from display import Display
from write_credentials_json import write_credentials_json
from sheets import Sheets

class LocalState:
    NFC_HOLD_TIME = timedelta(seconds=10)

    display = None
    sheets = None
    nfc_poll = None
    nfc_tag_id = None
    nfc_user_name = None
    nfc_hold_start = None

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

        if self.nfc_hold_start != None:
            if self.nfc_hold_start + self.NFC_HOLD_TIME < datetime.now():
                self.nfc_timeout()
                return
            else:
                if prev_nfc_tag_id == None and self.nfc_tag_id != None:
                    self.nfc_assign_complete()
                    return

        if prev_nfc_tag_id != self.nfc_tag_id and self.nfc_tag_id != None:
            # TODO: Lookup name and show that instead
            # TODO: See if this is a clock in or clock out
            self.clock_in(self.nfc_tag_id)


    def update_display(self):
        self.display.update_display()

    def clock_in(self, nfc_tag_id, now = datetime.now()):
        self.display.clock_in(nfc_tag_id, now)

    def clock_out(self, nfc_tag_id, now = datetime.now()):
        self.display.clock_out(nfc_tag_id, now)

    def nfc_assign_start(self, user_name):
        self.nfc_user_name = user_name
        self.nfc_hold_start = datetime.now()
        self.display.nfc_scan(user_name)

    def nfc_assign_complete(self):
        self.sheets.set_nfc(self.nfc_user_name, self.nfc_tag_id)
        self.display.nfc_set(self.nfc_user_name)
        self.nfc_hold_start = None
        self.nfc_user_name = None

    def nfc_timeout(self):
        self.display.nfc_timeout()
        self.nfc_hold_start = None
        self.nfc_user_name = None

local_state = LocalState()

def update_nfc():
    local_state.update_nfc()

def update_display():
    local_state.update_display()

def update_roster():
    local_state.update_roster()

write_credentials_json()
local_state.sheets.auth()
local_state.update_roster()

scheduler = BackgroundScheduler()
scheduler.add_job(func=update_nfc, trigger="interval", seconds=1)
scheduler.add_job(func=update_display, trigger="interval", seconds=1)
scheduler.add_job(func=update_roster, trigger="interval", hours=1)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__)

@app.route('/nfc_tag_assign', methods=['POST'])
def nfc_tag_assign():
    try:
        request_data = request.get_json()
        user_name = request_data["userName"]
        local_state.nfc_assign_start(user_name)

        return json.dumps({'success': True, 'message': ''})
    except:
        return json.dumps({'success': False, 'message': 'NFC Error'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
