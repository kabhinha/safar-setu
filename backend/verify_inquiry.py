import requests
import json

url = "http://127.0.0.1:8000/api/v1/bookings/public/inquire"
payload = {
    "phone": "9876543210",
    "name": "Pilot Tester",
    "resource_type": "GENERAL",
    "resource_id": "test-pilot"
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("SUCCESS: Inquiry created.")
    else:
        print("FAILURE: Inquiry creation failed.")
except Exception as e:
    print(f"ERROR: {e}")
