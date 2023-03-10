from datetime import datetime, timedelta
from I2C_LCD_driver import lcd

# 20x4 Display
class Display:
    EVENT_HANG_TIME = timedelta(seconds=5)
    COLUMNS = 20
    LINES = 4

    display = None
    display_lines = ["", "", "", ""]
    last_event_time = None
    last_event = None
    hold_display = False

    def __init__(self):
        self.display = lcd()
        self.display_loading()

    def scanning(self):
        self.set_event([
            "".ljust(self.COLUMNS, " "),
            "SCANNING...".center(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
        ])

    def unrecognized_nfc(self, nfc_id):
        self.set_event([
            "UNRECOGNIZED NFC".ljust(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
            nfc_id.center(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
        ])

    def clock_in(self, name, when):
        self.set_event([
            "CLOCK IN".center(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
            name.center(self.COLUMNS, " "),
            when.strftime("at %I:%M:%S").center(self.COLUMNS, " "),
        ])

    def clock_out(self, name, when):
        self.set_event([
            "CLOCK OUT".center(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
            name.center(self.COLUMNS, " "),
            when.strftime("at %I:%M:%S").center(self.COLUMNS, " "),
        ])

    def display_idle(self):
        now = datetime.now()

        self.set_display([
            "FRC 2357".center(self.COLUMNS),
            "System Meltdown".center(self.COLUMNS, " "),
            now.strftime("%I:%M:%S %p").center(self.COLUMNS, " "),
            now.strftime("%A %m/%d/%y").center(self.COLUMNS, " "),
        ])

    def display_loading(self):
        self.set_display([
            "".ljust(self.COLUMNS, " "),
            "LOADING...".center(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
            "".ljust(self.COLUMNS, " "),
        ])
    
    def set_event(self, lines):
        if self.hold_display:
          return;

        self.last_event = lines
        self.last_event_time = datetime.now()

    def set_display(self, lines):
        for index in range(4):
            if lines[index] != self.display_lines[index]:
                self.display.lcd_display_string(lines[index], index + 1)

    def update_display(self):
        if self.last_event != None or self.hold_display:
            if self.last_event_time + self.EVENT_HANG_TIME > datetime.now() or self.hold_display:
                # Keep displaying event
                self.set_display(self.last_event)
                return
            else:
                # Event hang time has passed
                self.last_event = None
                self.last_event_time = None
        
        # No event to display
        self.display_idle()
