from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

print("SECRET_KEY =", SECRET_KEY)

def create_reset_token(email: str):
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_reset_token(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return payload["email"]