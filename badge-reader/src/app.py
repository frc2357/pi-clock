import os
import time
import requests
from pathlib import Path
from dotenv import dotenv_values
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from nfc_module import NFCModule
from display import Display

PING_HOSTNAME = "google.com"

PARENT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = PARENT_DIR / ".env"
env = dotenv_values(ENV_FILE)
API_URL = env['API_URL']


class Timeclock:
    def __init__(self):
        self.has_internet = False
        self.nfc_module = NFCModule()
        self.nfc_id = None
        self.display = Display()

    def start(self):
        self.check_internet()

        print("Scheduling tasks")
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(
            func=self.update_nfc, trigger="interval", seconds=0.5, id="update_nfc"
        )
        self.scheduler.add_job(
            func=self.update_display,
            trigger="interval",
            seconds=0.5,
            id="update_display",
        )
        self.scheduler.add_job(
            func=self.check_internet,
            trigger="interval",
            minutes=15,
            id="check_internet",
        )
        self.scheduler.start()

    def shutdown(self):
        self.scheduler.shutdown()

    def check_internet(self):
        had_internet = self.has_internet
        response = os.system(f"ping -c 1 {PING_HOSTNAME}")
        self.has_internet = response == 0

        if not had_internet and self.has_internet:
            print("Internet connection is UP")
            self.display.done_loading()
        elif had_internet and not self.has_internet:
            print("Internet connection is DOWN")
            self.display.loading()

        return self.has_internet

    def update_display(self):
        self.display.update()

    def update_nfc(self):
        prev_nfc_id = self.nfc_id
        nfc_id = self.nfc_module.poll()

        if nfc_id and nfc_id != prev_nfc_id:
            self.display.scanning()
            self.record_event(nfc_id)
        
        self.nfc_id = nfc_id

    def record_event(self, nfc_id):
        try:
            url = f"{API_URL}/api/events/record?nfc_id={nfc_id}"
            response = requests.post(url)
            status = response.status_code
            data = response.json()

            # User with nfc_id does not exist
            if status == 400:
                return self.display.unrecognized_nfc(nfc_id)
            if status == 200:
                event = data['event']
                username = data['user']['display_name']
                when = datetime.fromisoformat(data['when']).astimezone()
                if event == 'clock_in':
                    return self.display.clock_in(username, when)
                elif event == 'clock_out':
                    return self.display.clock_out(username, when)
            raise Exception(data)
        except Exception as e:
            print(f"Failed to record event: {e}")
            print(f"nfc_id: {nfc_id} - timestamp: {datetime.now()}")


if __name__ == '__main__':
    timeclock = Timeclock()
    timeclock.start()

    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except Exception:
        print("Shutting down...")
        timeclock.shutdown()
