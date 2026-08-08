# helpers.py

from datetime import datetime, timezone
import uuid

from firebase_config import db

audit_logs_ref = db.collection("audit_logs")

def now_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()

def generate_id(prefix: str) -> str:
    """Generate a short unique ID with a prefix (e.g., U001, R001)."""
    return f"{prefix}{uuid.uuid4().hex[:8].upper()}"

def log_event(
    event_type: str,
    description: str,
    user_id: str | None = None,
    meta: dict | None = None
) -> None:
    """Write an entry to the audit log collection."""
    doc = {
        "log_id": generate_id("L"),
        "user_id": user_id,
        "event_type": event_type,
        "event_description": description,
        "timestamp": now_iso(),
        "metadata": meta or {}
    }
    audit_logs_ref.add(doc)