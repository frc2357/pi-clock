from __future__ import print_function

import os.path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta

SPREADSHEET_ID = os.environ["SPREADSHEET_ID"]
TIMESHEET_NAME = "Timesheet"
TIMESHEET_RANGE = "Timesheet!A2:D"
ROSTER_RANGE = "Roster!A2:C"
DATETIME_FORMAT = "%m/%d/%Y, %I:%M:%S %p"
MAX_SHIFT_LENGTH = timedelta(hours=12)

def roster_range_for_row(rowIndex):
    spreadsheet_row = rowIndex + 2
    return f"Roster!A{spreadsheet_row}:C"

def timesheet_range_for_row(rowIndex):
    spreadsheet_row = rowIndex + 2
    return f"Timesheet!A{spreadsheet_row}:D"

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

SERVICE_ACCOUNT_FILE = 'credentials.json'

class Sheets:
    creds = None
    service = None
    sheet = None
    roster = None
    timesheet = None

    def auth(self):
        self.creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES) 

        try:
            self.service = build('sheets', 'v4', credentials=self.creds)
            self.sheet = self.service.spreadsheets()
        except HttpError as err:
            print(err)

    def fetch_roster(self):
        try:
            result = self.sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=ROSTER_RANGE).execute()
            values = result.get('values', [])

            if not values:
                print('No roster data found.')
                return

            self.roster = values

        except HttpError as err:
            print(err)

    def fetch_timesheet(self):
        try:
            result = self.sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=TIMESHEET_RANGE).execute()
            values = result.get('values', [])

            if not values:
                print('No timesheet data found.')
                return

            self.timesheet = values

        except HttpError as err:
            print(err)

    def find_timesheet_clocked_in_row(self, user_name):
        if self.timesheet == None:
            return None

        for row in self.timesheet:
            is_match = row[0] == user_name
            if is_match and len(row) == 2:
                # This row doesn't have an end time. Check to see if it's less than 12 hours ago
                clock_in_time = datetime.strptime(row[1], DATETIME_FORMAT)

                if clock_in_time + MAX_SHIFT_LENGTH > datetime.now():
                    # This clock-in time is still valid, use it
                    return row
        
        # No row is a current clock-in
        return None

    def find_roster_row(self, user_name):
        if self.roster == None:
            return None

        for row in self.roster:
            if row[0] == user_name:
                return row

        return None

    def find_roster_row_by_nfc(self, nfc_id):
        if self.roster == None:
            return None

        for row in self.roster:
            print(row)
            if len(row) >= 3 and row[2] == nfc_id:
                return row

        return None

    def find_name_by_nfc(self, nfc_id):
        row = self.find_roster_row_by_nfc(nfc_id)

        if row:
            return row[0]

        return None

    def set_nfc(self, user_name, nfc_id):
        try:
            print(f"set_nfc {user_name}, {nfc_id}")

            row = self.find_roster_row(user_name)

            if len(row) >= 3:
                raise ValueError("NFC tag already exists")

            row.append(nfc_id)
            rowIndex = self.roster.index(row)

            body = { "values": [row] }

            result = self.sheet.values().update(
                spreadsheetId=SPREADSHEET_ID,
                range=roster_range_for_row(rowIndex),
                valueInputOption="USER_ENTERED",
                body=body,
            ).execute()

            print(f"{result.get('updatedCells')} cells updated.")
            self.fetch_roster()

        except HttpError as err:
            print(err)

    def clock_in(self, user_name, when):
        try:
            row = [ user_name, when.strftime(DATETIME_FORMAT) ]
            body = { "values": [row] }

            result = self.sheet.values().append(
                spreadsheetId=SPREADSHEET_ID,
                range=TIMESHEET_RANGE,
                valueInputOption="USER_ENTERED",
                body=body,
            ).execute()

            print(f"{(result.get('updates').get('updatedCells'))} cells appended.")

        except HttpError as err:
            print(err)

    def clock_out(self, clock_in_row, clock_out_time):
        try:
            clock_in_time = datetime.strptime(clock_in_row[1], DATETIME_FORMAT)
            duration = clock_out_time - clock_in_time

            clock_in_row.append(clock_out_time.strftime(DATETIME_FORMAT))
            clock_in_row.append(duration.seconds / 60 / 60)

            rowIndex = self.timesheet.index(clock_in_row)
            body = { "values": [clock_in_row] }

            result = self.sheet.values().update(
                spreadsheetId=SPREADSHEET_ID,
                range=timesheet_range_for_row(rowIndex),
                valueInputOption="USER_ENTERED",
                body=body,
            ).execute()

            print(f"{result.get('updatedCells')} cells updated.")

        except HttpError as err:
            print(err)
