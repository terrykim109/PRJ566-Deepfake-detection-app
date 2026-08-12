from fastapi import APIRouter, HTTPException
from firebase_config import db
from helpers import now_iso, log_event, user_from_doc
from schemas import ProfileUpdate, UserResponse

router = APIRouter(tags=["users"])
users_ref = db.collection("users")

@router.put("/users/{user_id}/profile", response_model=UserResponse)
async def update_profile(user_id: str, body: ProfileUpdate):
    """Update user profile fields, including phone, in Firestore."""
    doc_ref = users_ref.document(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    existing = doc.to_dict() or {}
    first_name = (body.first_name or "").strip()
    last_name = (body.last_name or "").strip()
    display_name = f"{first_name} {last_name}".strip() or existing.get("display_name", "")

    phone = (body.phone or "").strip() or existing.get("phone") or ""
    email = (body.email or "").strip() or existing.get("email") or ""

    update_data = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "phone": phone,
        "phone_number": phone,
        "display_name": display_name,
        "updated_at": now_iso(),
    }

    try:
        doc_ref.set(update_data, merge=True)
        print(f"[profile] saved {user_id} phone_len={len(phone)} email_set={bool(email)}")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to save profile: {exc}") from exc

    try:
        log_event("profile_update", f"User {user_id} updated profile", user_id, {"phone": update_data["phone"]})
    except Exception:
        pass

    fresh = doc_ref.get().to_dict() or {**existing, **update_data}
    return user_from_doc(user_id, {**fresh, "user_id": user_id})