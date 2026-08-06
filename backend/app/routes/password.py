from fastapi import APIRouter, HTTPException
from app.schemas import ForgotPasswordRequest, ResetPasswordRequest
from app.services.token_service import verify_reset_token
from app.database import SessionLocal
from app.models import User
from app.security import hash_password

from app.services.token_service import (
    create_reset_token,
    verify_reset_token,
)

from app.services.email_service import send_reset_email

import os

router = APIRouter(
    prefix="/auth",
    tags=["Password"],
)


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    

    db = SessionLocal()

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        db.close()
        raise HTTPException(404, "Email not found")

    token = create_reset_token(user.email)

    reset_link = (
        f"{os.getenv('FRONTEND_URL')}"
        f"/reset-password?token={token}"
    )

    print("reset link: ", reset_link)

    send_reset_email(user.email, reset_link)

    db.close()

    return {
        "status": "success",
        "message": "Password reset link sent."
    }

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):

    try:
        email = verify_reset_token(data.token)

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.password)

    db.commit()
    db.close()

    return {
        "status": "success",
        "message": "Password changed successfully"
    }