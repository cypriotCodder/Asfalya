import resend
import os
from dotenv import load_dotenv

# Explicitly load .env from the current directory
load_dotenv()

api_key = os.getenv("RESEND_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

if api_key:
    resend.api_key = api_key
    
    # Try a simple send to the owner's email (or a known one)
    # Note: If using the free test domain, 'to' must be the email you signed up with.
    test_email = input("Enter the email address you signed up for Resend with: ")
    
    params = {
        "from": "onboarding@resend.dev",
        "to": [test_email],
        "subject": "Resend Diagnostic Test",
        "html": "<strong>It works!</strong>"
    }

    print("Attempting to send test email...")
    try:
        response = resend.Emails.send(params)
        print("Response received:")
        print(response)
    except Exception as e:
        print("\n--- ERROR ---")
        print(str(e))
        print("-------------\n")
else:
    print("Error: RESEND_API_KEY not found in .env file.")
