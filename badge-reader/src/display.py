from datetime import datetime, timedelta
from RPLCD.i2c import CharLCD

EVENT_DURATION = timedelta(seconds=5)

I2C_EXPANDER = 'PCF8574'
CHARACTER_MAP = 'A02'
ADDRESS = 0x27
PORT = 1
COLUMNS = 20
ROWS = 4


class Display(CharLCD):
    def __init__(self):
        super().__init__(
            i2c_expander=I2C_EXPANDER,
            address=ADDRESS,
            port=PORT,
            cols=COLUMNS,
            rows=ROWS,
            charmap=CHARACTER_MAP,
        )

        self.display_lines = None
        self.last_event_time = None

    def update(self):
        if self.has_event_elapsed():
            self.idle()

        self.render()

    def render(self):
        for i, line in enumerate(self.display_lines):
            self.write_line(line, i)

    def set_event(self, lines):
        self.display_lines = lines
        self.last_event_time = datetime.now()

    def idle(self):
        now = datetime.now()
        self.last_event_time = None
        self.display_lines = [
            self.align("FRC 2357"),
            self.align("System Meltdown"),
            self.align(now.strftime("%I:%M:%S %p")),
            self.align(now.strftime("%A %m/%d/%y")),
        ]

    def loading(self):
        self.display_lines = [
            "",
            self.align("LOADING"),
            "",
            "",
        ]

    def scanning(self):
        self.display_lines = [
            "",
            self.align("SCANNING"),
            "",
            "",
        ]

    def unrecognized_nfc(self, nfc_id):
        self.set_event(
            [
                self.align("UNRECOGNIZED NFC"),
                "",
                self.align(nfc_id),
                "",
            ]
        )

    def clock_in(self, name, when):
        self.set_event(
            [
                self.align("CLOCK IN"),
                "",
                self.align(name),
                self.align(when.strftime("at %I:%M:%S")),
            ]
        )

    def clock_out(self, name, when):
        self.set_event(
            [
                self.align("CLOCK OUT"),
                "",
                self.align(name),
                self.align(when.strftime("at %I:%M:%S")),
            ]
        )

    def has_event_elapsed(self):
        return (
            self.last_event_time
            and self.last_event_time + EVENT_DURATION > datetime.now()
        )

    def align(self, text, align='center', character=' '):
        match align:
            case 'center':
                return text.center(COLUMNS, character)
            case 'left':
                return text.ljust(COLUMNS, character)
            case 'right':
                return text.rjust(COLUMNS, character)
        return text

    def write_line(self, text, line=0):
        self.cursor_pos = (line, 0)
        self.write_string(text)
