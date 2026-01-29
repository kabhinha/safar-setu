import requests
import json

url = "http://localhost:8000/api/public/kiosk/discover/"
headers = {"Content-Type": "application/json"}
data = {
    "available_time": 120,
    "interest_tags": ["Nature", "Crafts"],
    "district_id": "Guwahati"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
