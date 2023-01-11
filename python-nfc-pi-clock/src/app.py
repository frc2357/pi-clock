import time
import atexit
from flask import Flask, json
from apscheduler.schedulers.background import BackgroundScheduler
from nfc_poll import NFCPoll

nfcPoll = NFCPoll()

nfcPoll.nfc_open()

currentNfcId = None

def print_date_time():
    currentNfcId = nfcPoll.nfc_poll()
    if currentNfcId != None:
        timeStr = time.strftime("%I:%M:%S %p", time.localtime())
        print("{0} {1}".format(timeStr, currentNfcId))

scheduler = BackgroundScheduler()
scheduler.add_job(func=print_date_time, trigger="interval", seconds=1)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__)

@app.route('/nfc_tag_id')
def nfc_tag_id_endpoint():
    data = {"nfc_tag_id": currentNfcId}
    return json.dumps(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
