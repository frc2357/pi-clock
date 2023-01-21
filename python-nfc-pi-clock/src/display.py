from datetime import datetime, timedelta
from I2C_LCD_driver import lcd

# 20x4 Display
class Display:
  EVENT_HANG_TIME = timedelta(seconds=10)
  COLUMNS = 20
  LINES = 4

  display = None
  display_lines = ["", "", "", ""]
  last_event_time = None
  last_event = None

  def __init__(self):
    self.display = lcd()
    self.display_idle()

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

  def set_event(self, lines):
    self.last_event = lines
    self.last_event_time = datetime.now()

  def set_display(self, lines):
      for index in range(4):
          if lines[index] != self.display_lines[index]:
              self.display.lcd_display_string(lines[index], index + 1)

  def update_display(self):
    if self.last_event != None:
      if self.last_event_time + self.EVENT_HANG_TIME > datetime.now():
        # Keep displaying event
        self.set_display(self.last_event)
        return
      else:
        # Event hang time has passed
        self.last_event = None
        self.last_event_time = None
    
    # No event to display
    self.display_idle()
