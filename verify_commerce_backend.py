import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1/commerce"

def run_test():
    print("1. Fetching Products...")
    try:
        res = requests.get(f"{BASE_URL}/products/")
        if res.status_code != 200:
            print(f"FAILED: {res.status_code} - {res.text}")
            return
        products = res.json()
        if not products:
            print("FAILED: No products found.")
            return
        product = products[0]
        print(f"SUCCESS: Found {len(products)} products. Selected: {product['title']} (ID: {product['id']})")
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

    print("\n2. Initiating Deal...")
    try:
        payload = {
            "product_id": product['id'],
            "kiosk_id": "TEST_KIOSK",
            "district_id": "TEST_DISTRICT"
        }
        res = requests.post(f"{BASE_URL}/deals/initiate/", json=payload)
        if res.status_code != 200:
            print(f"FAILED: {res.status_code} - {res.text}")
            return
        deal_data = res.json()
        deal_id = deal_data['deal_id']
        token_value = deal_data['token_value']
        print(f"SUCCESS: Deal Initiated. ID: {deal_id}, Token: {token_value}")
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

    print("\n3. Scanning Token (Vendor Confirmation)...")
    try:
        payload = {"token_value": token_value}
        res = requests.post(f"{BASE_URL}/scan/", json=payload)
        if res.status_code != 200:
            print(f"FAILED: {res.status_code} - {res.text}")
            return
        scan_res = res.json()
        print(f"SUCCESS: Scan Result: {scan_res['message']}")
        if scan_res['status'] != 'VENDOR_CONFIRMED':
            print(f"WARNING: Expected VENDOR_CONFIRMED, got {scan_res['status']}")
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

    print("\n4. Checking Final Status...")
    try:
        res = requests.get(f"{BASE_URL}/deals/{deal_id}/status/")
        if res.status_code != 200:
            print(f"FAILED: {res.status_code} - {res.text}")
            return
        status_data = res.json()
        print(f"SUCCESS: Final Status: {status_data['status']}")
        if status_data['status'] == 'VENDOR_CONFIRMED':
            print("VERIFICATION COMPLETE: Flow working correctly.")
        else:
            print("VERIFICATION FAILED: Incorrect final status.")
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

if __name__ == "__main__":
    run_test()
