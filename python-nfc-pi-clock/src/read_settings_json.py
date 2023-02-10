import json

def read_settings_json(file_path):
  with open(file_path, "rt") as f:
    json_data = json.load(f)
    return json_data
