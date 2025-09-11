import board
import busio

from adafruit_pn532.i2c import PN532_I2C

# Seconds
TIMEOUT = 0.45


class NFCModule:
    def __init__(self):
        self.i2c = busio.I2C(board.SCL, board.SDA)
        self.nfc_module = PN532_I2C(self.i2c, debug=False)

    def poll(self):
        uid_bytes = self.nfc_module.read_passive_target(timeout=TIMEOUT)
        if type(uid_bytes) == bytearray:
            return uid_bytes.hex()
