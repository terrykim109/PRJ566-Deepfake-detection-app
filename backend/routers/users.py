from fastapi import APIRouter, HTTPException
from firebase_config import db
from helpers import now_iso, log_event

router = APIRouter(tags=["users"])
users_ref = db.collection("users")

@router.put("/users/{user_id}/profile")
async def update_profile(user_id: str, body: dict):
    """Update user profile fields."""
    doc = users_ref.document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    first_name = body.get("first_name", "")
    last_name = body.get("last_name", "")
    display_name = f"{first_name} {last_name}".strip()
    
    update_data = {
        "first_name": first_name,
        "last_name": last_name,
        "email": body.get("email", ""),
        "phone": body.get("phone", ""),
        "display_name": display_name or doc.to_dict().get("display_name", ""),
        "updated_at": now_iso(),
    }
    
    users_ref.document(user_id).update(update_data)
    log_event("profile_update", f"User {user_id} updated profile", user_id)
    
    return {"message": "Profile updated", "user_id": user_id}