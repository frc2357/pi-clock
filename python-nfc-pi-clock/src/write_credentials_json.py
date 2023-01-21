import os

def write_credentials_json():
    PROJECT_ID = os.environ['PROJECT_ID']
    CLIENT_ID = os.environ['CLIENT_ID']
    CLIENT_EMAIL = os.environ['CLIENT_EMAIL']
    CLIENT_X509_CERT_URL = os.environ['CLIENT_X509_CERT_URL']
    PRIVATE_KEY_ID = os.environ['PRIVATE_KEY_ID']
    PRIVATE_KEY = os.environ['PRIVATE_KEY']

    with open("credentials.json", "w") as f:
        f.writelines([
            '{',
            '"type": "service_account",',
            f'"project_id": "{PROJECT_ID}",',
            f'"private_key_id": "{PRIVATE_KEY_ID}",',
            f'"private_key": "{PRIVATE_KEY}",',
            f'"client_email": "{CLIENT_EMAIL}",',
            f'"client_id": "{CLIENT_ID}",',
            '"auth_uri": "https://accounts.google.com/o/oauth2/auth",',
            '"token_uri": "https://oauth2.googleapis.com/token",',
            '"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",',
            f'"client_x509_cert_url": "{CLIENT_X509_CERT_URL}"',
            '}',
        ])
