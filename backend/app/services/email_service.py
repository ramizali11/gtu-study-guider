from dotenv import load_dotenv
from email.message import EmailMessage
import aiosmtplib
import resend
from pathlib import Path
import os
import resend

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD")

print("RESEND_API_KEY =", os.getenv("RESEND_API_KEY"))

resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = "GTU AI Study Assistant <onboarding@resend.dev>"


def send_reset_email(email: str, link: str):

    resend.Emails.send({

        "from": "GTU AI Study Assistant <onboarding@resend.dev>",

        "to": email,

        "subject": "Reset your password",

        "html": f"""
        <h2>Reset Password</h2>

        <p>Click the button below.</p>

        <a href="{link}"
           style="
             background:#2563eb;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;">
             Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
        """
    })

async def send_otp_email(email: str, otp: str):
    try:
        message = EmailMessage()

        message["From"] = SMTP_EMAIL
        message["To"] = email
        message["Subject"] = "Your Study Guider Verification Code"

        message.set_content(
            f"""
Your Study Guider registration OTP is: {otp}

This OTP will expire in 10 minutes.

If you did not try to register, you can ignore this email.
"""
        )

        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=SMTP_EMAIL,
            password=SMTP_APP_PASSWORD,
        )

        return True

    except Exception as e:
        print("OTP EMAIL ERROR:", e)
        print("SMTP_EMAIL =", SMTP_EMAIL)
        print("SMTP_APP_PASSWORD configured =", bool(SMTP_APP_PASSWORD))
        return False
