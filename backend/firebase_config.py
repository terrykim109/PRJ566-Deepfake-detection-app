#backend/firebase_config.py
import os
import firebase_admin
from firebase_admin import credentials, firestore

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

# Find credentials (env var, backend folder, or cwd)
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path or not os.path.exists(cred_path):
    for candidate in (
        os.path.join(_BACKEND_DIR, "serviceAccountKey.json"),
        os.path.join(os.getcwd(), "serviceAccountKey.json"),
        "serviceAccountKey.json",
    ):
        if os.path.exists(candidate):
            cred_path = candidate
            break

if not firebase_admin._apps:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()