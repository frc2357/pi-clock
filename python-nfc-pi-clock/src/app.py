import time
import atexit
from flask import Flask, json
from apscheduler.schedulers.background import BackgroundScheduler
from nfc_poll import NFCPoll

nfcPoll = NFCPoll()

nfcPoll.nfc_open()

currentNfcId = None

nfcData = { "nfc_tag_id": None };

def scan_nfc():
    nfcData["nfc_tag_id"] = nfcPoll.nfc_poll()
    if currentNfcId != None:
        timeStr = time.strftime("%I:%M:%S %p", time.localtime())
        print("{0} {1}".format(timeStr, nfcData["nfc_tag_id"]))

scheduler = BackgroundScheduler()
scheduler.add_job(func=scan_nfc, trigger="interval", seconds=1)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__)

@app.route('/nfc_tag_id')
def nfc_tag_id_endpoint():
    return json.dumps(nfcData)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
