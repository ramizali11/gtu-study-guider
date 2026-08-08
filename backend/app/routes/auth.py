from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserLogin
from app.auth import hash_password, verify_password
from app.security import create_access_token
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from app.schemas import (
    UserCreate,
    UserLogin,
    VerifyOTPRequest,
    ResendOTPRequest
)

from app.schemas import (
    UserCreate,
    UserLogin,
    VerifyOTPRequest,
    ResendOTPRequest
)

from app.services.otp_services import (
    generate_otp,
    hash_otp,
    verify_otp
)

from app.services.email_service import send_otp_email

from app.database import get_db
from app.models import User
from app.auth import hash_password
from app.models_otp import RegistrationOTP

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if email is already registered
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    otp_record = db.query(RegistrationOTP).filter(
        RegistrationOTP.email == user.email
    ).first()

    # Generate OTP
    otp = generate_otp()
    otp_hash = hash_otp(otp)

    now = datetime.utcnow()

    # Save registration information temporarily
    if otp_record:
        otp_record.name = user.name
        otp_record.password = hash_password(user.password)
        otp_record.otp_hash = otp_hash
        otp_record.expires_at = now + timedelta(minutes=10)
        otp_record.attempts = 0
        otp_record.last_sent_at = now
    else:
        otp_record = RegistrationOTP(
            name=user.name,
            email=user.email,
            password=hash_password(user.password),
            otp_hash=otp_hash,
            expires_at=now + timedelta(minutes=10),
            attempts=0,
            last_sent_at=now
        )
    db.add(otp_record)
    db.commit()
    email_sent = await send_otp_email(user.email, otp)

    if not email_sent:
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=503,
            detail="Unable to send OTP email. Please try again later."
        )

    return {
        "message": "OTP sent to your email. Please verify your email."
    }
@router.post("/verify-otp")
def verify_registration_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    otp_record = db.query(RegistrationOTP).filter(
        RegistrationOTP.email == data.email
    ).first()
    

    if not otp_record:
        raise HTTPException(
            
            status_code=400,
            detail="OTP request not found."
        )

    if datetime.utcnow() > otp_record.expires_at:
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired."
        )

    if otp_record.attempts >= 5:
        raise HTTPException(
            status_code=429,
            detail="Too many incorrect attempts."
        )

    if not verify_otp(data.otp, otp_record.otp_hash):
        otp_record.attempts += 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    # OTP is correct → NOW create the actual user
    new_user = User(
        name=otp_record.name,
        email=otp_record.email,
        password=otp_record.password
    )

    db.add(new_user)

    # Delete temporary OTP record
    db.delete(otp_record)

    db.commit()

    return {
        "message": "Registration successful."
    }
    
@router.post("/resend-otp")
async def resend_otp(
    data: ResendOTPRequest,
    db: Session = Depends(get_db)
):

    otp_record = db.query(RegistrationOTP).filter(
        RegistrationOTP.email == data.email
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="No OTP request found."
        )

    now = datetime.utcnow()

    # 60-second resend limit
    if now - otp_record.last_sent_at < timedelta(seconds=60):
        raise HTTPException(
            status_code=429,
            detail="Please wait 60 seconds before requesting another OTP."
        )

    # Generate new OTP
    otp = generate_otp()

    otp_record.otp_hash = hash_otp(otp)
    otp_record.expires_at = now + timedelta(minutes=10)
    otp_record.last_sent_at = now
    otp_record.attempts = 0

    db.commit()

    await send_otp_email(data.email, otp)

    return {
        "message": "A new OTP has been sent to your email."
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
    {
        "sub": db_user.email
    }
    )

    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email
        }
}

