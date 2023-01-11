from ctypes import *
import log
import logging

UI_POLL_NR = 1
UI_PERIOD = 1

class NFCPoll():
    def __init__(self):
        logLevel = logging.DEBUG
        logFormat = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

        logger = log.initLogger(logLevel, logFormat)

        self.logger = logger
        self.rom = None

        self.libnfc = CDLL("libnfc.so")
        self.libnfcutils = CDLL("libnfcutils.so")

    def cleanup(self):
        self.logger.debug("cleanup")
        self.nfc_close()

    def nfc_open(self):
        res = self.libnfcutils.nfcutils_open()

        if res < 0:
            raise OSError("Error: Unable to open NFC device: {0}".format(res))
        else:
            self.logger.info("NFC Device Open")

    def nfc_close(self):
        self.libnfcutils.nfcutils_close()

    def nfc_poll(self):
        charArray20 = c_char * 20
        uidString = charArray20()

        res = self.libnfcutils.nfcutils_poll(UI_POLL_NR, UI_PERIOD, uidString)

        # (KK) -104 when tag is not present.
        if res == -104 or res == 0:
            return None
        elif res < 0:
            self.logger.debug("Warning: nfc poll: {0}".format(res))
            return None
        elif res == 1:
            return uidString.value.decode("utf-8")
