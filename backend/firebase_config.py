#backend/firebase_config.py
import os
import firebase_admin
from firebase_admin import credentials, firestore

# Find crednetials
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path and os.path.exists("serviceAccountKey.json"):
    cred_path = "serviceAccountKey.json"

if not firebase_admin._apps:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()