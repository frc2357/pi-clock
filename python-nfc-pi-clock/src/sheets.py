from __future__ import print_function

import os.path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from flask import json

SPREADSHEET_ID = os.environ["SPREADSHEET_ID"]
TIMESHEET_NAME = "Timesheet"
TIMESHEET_RANGE = "Timesheet!A2:C"
ROSTER_RANGE = "Roster!A2:C"

def roster_range_for_row(rowIndex):
    spreadsheet_row = rowIndex + 2
    return f"Roster!A{spreadsheet_row}:C"

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

        except HttpError as err:
            print(err)

