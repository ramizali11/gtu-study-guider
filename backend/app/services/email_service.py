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
      try:
        message = EmailMessage()

        message["From"] = SMTP_EMAIL
        message["To"] = email
        message["Subject"] = "Reset your Study Guider Password"

        message.set_content(
            f"""
Reset your Study Guider password

Click the link below to reset your password:

{link}

This link expires in 15 minutes.

If you did not request a password reset, you can safely ignore this email.
"""
        )

        # Because your function is currently synchronous,
        # use the synchronous SMTP helper.
        import smtplib

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(
                SMTP_EMAIL,
                SMTP_APP_PASSWORD
            )
            server.send_message(message)

        print("RESET EMAIL SENT TO:", email)
        return True

      except Exception as e:
        print(
            "RESET EMAIL ERROR:",
            type(e).__name__,
            str(e)
        )
        return False

   
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
