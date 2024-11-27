import log
import logging

import board
import busio
from digitalio import DigitalInOut

from adafruit_pn532.i2c import PN532_I2C

UI_POLL_NR = 1
UI_PERIOD = 1

class NFCPoll():
    def __init__(self):
        logLevel = logging.DEBUG
        logFormat = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

        logger = log.initLogger(logLevel, logFormat)

        self.logger = logger
        self.rom = None

        self.i2c_connection = busio.I2C(board.SCL, board.SDA)
        self.nfc_module = PN532_I2C(self.i2c_connection, debug=False)


    def cleanup(self):
        self.logger.debug("cleanup")
        self.nfc_close()

    def nfc_poll(self):
        uidByteArray = self.nfc_module.read_passive_target()
        if (type(uidByteArray) == bytearray):
            return uidByteArray.hex()
        else:
            return None