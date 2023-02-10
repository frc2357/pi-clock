import json

def write_credentials_json(settings):
    with open("credentials.json", "w") as f:
        project_id = settings['project_id']
        private_key_id = settings['private_key_id']
        private_key = settings['private_key']
        client_email = settings['client_email']
        client_id = settings['client_id']
        client_x509_cert_url = settings['client_x509_cert_url']

        json_data = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": private_key_id,
            "private_key": private_key,
            "client_email": client_email,
            "client_id": client_id,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": client_x509_cert_url,
        }

        f.writelines([json.dumps(json_data)])
