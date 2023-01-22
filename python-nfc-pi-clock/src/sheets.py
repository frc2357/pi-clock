from __future__ import print_function

import os.path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SPREADSHEET_ID = os.environ["SPREADSHEET_ID"]
TIMESHEET_NAME = "Timesheet"
TIMESHEET_RANGE = "Timesheet!A2:C"
ROSTER_RANGE = "Roster!A2:C"

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

SERVICE_ACCOUNT_FILE = 'credentials.json'

class Sheets:
    creds = None
    service = None
    sheet = None
    roster = None

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

    def find_roster_row(self, user_name):
        if self.roster == None:
            return None

        for row in self.roster:
            print(row)
            if row[0] == user_name:
                return row

        return None

    def set_nfc(self, user_name, nfc_id):
        try:
            print(f"set_nfc {user_name}, {nfc_id}")

            #result = self.sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=ROSTER_RANGE).execute()
            #values = result.get('values', [])

            #if not values:
            #    print('No roster data found.')
            #    return

            #print('Name, Hours')
            #for row in values:
            #    print('%s, %s' % (row[0], row[1]))

        except HttpError as err:
            print(err)

