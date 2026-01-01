import resend
import os
from dotenv import load_dotenv

load_dotenv()

##
# @brief Configuration for the Resend API.
# @details The API key must be set in the RESEND_API_KEY environment variable.
#
async def send_activation_email(to_email: str, otp: str):
    """
    @brief Sends an account activation email via Resend.
    
    @param to_email The recipient's email address.
    @param otp The 6-digit activation code.
    @return The API response.
    """
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        return None
        
    resend.api_key = api_key

    params = {
        "from": "onboarding@resend.dev",
        "to": [to_email],
        "subject": "Asfalya - Your Activation Code",
        "html": f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">Welcome to Asfalya</h2>
            <p>Thank you for choosing Asfalya for your insurance management needs. To activate your account, please use the following one-time code:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 25px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">{otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes. If you did not request this activation, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">© 2025 Asfalya. All rights reserved.</p>
        </div>
        """,
    }

    try:
        response = resend.Emails.send(params)
        return response
    except Exception as e:
        # Keep logging errors for production monitoring
        print(f"Error sending email via Resend: {e}")
        raise e
