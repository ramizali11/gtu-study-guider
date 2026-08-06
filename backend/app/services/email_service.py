from dotenv import load_dotenv
from pathlib import Path
import os
import resend

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

print("RESEND_API_KEY =", os.getenv("RESEND_API_KEY"))

resend.api_key = os.getenv("RESEND_API_KEY")


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