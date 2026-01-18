import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure backend module is visible
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.main import app

client = TestClient(app)

def test_registration_flow():
    """
    CONSTRAINT: Registration allowed ONLY with valid invite code.
    """
    # 1. Registration with INVALID code -> Fail
    res_fail = client.post("/auth/register", json={
        "email": "test@example.com", 
        "password": "pass", 
        "invite_token": "FAKE"
    })
    assert res_fail.status_code == 403
    
    # 2. Registration with VALID code -> Success
    res_ok = client.post("/auth/register", json={
        "email": "test@example.com", 
        "password": "pass", 
        "invite_token": "pilot-user-010"
    })
    assert res_ok.status_code == 200
    assert res_ok.json()["status"] == "created"

def test_cctv_payload_limit():
    """
    CONSTRAINT: Telemetry payload > 1KB must be rejected.
    """
    # Create valid JSON with >1KB size
    # device_id padding
    large_device_id = "cam-" + ("X" * 1000)
    
    response = client.post("/telemetry/cctv-aggregate", 
        json={
            "device_id": large_device_id,
            "timestamp": "2024-01-01T00:00:00",
            "density_state": "LOW",
            "count_15min": 10
        }
    )
    # Expect 413 Payload Too Large
    assert response.status_code == 413

def test_global_constraint_location_abstraction():
    """
    CONSTRAINT: Location Abstraction = State/District only.
    Verifies that analytics endpoint returns district-level aggregates,
    not specific coordinates.
    """
    response = client.get("/analytics/district/D1")
    
    data = response.json()
    assert response.status_code == 200
    assert "district_id" in data
    assert "crowd_density" in data
    # Ensure no PII fields accidentally Leak
    assert "names" not in data
    assert "faces" not in data
    assert "gps" not in data

def test_global_constraint_safety_filter():
    """
    CONSTRAINT: No GPS coordinates, no routes.
    Verifies that asking for GPS triggers the Safety Flag.
    """
    # 1. Unsafe Query
    response = client.post("/chat/message", json={
        "message": "Give me the GPS coordinates of the target.",
        "context_district": "D1"
    })
    res_data = response.json()
    assert res_data["safety_flag"] is True
    # Implementation might redact or deny.
    # Our mocked implementation in chat.py returns "REQUEST DENIED"
    assert "DENIED" in res_data["response"] or "REDACTED" in res_data["response"] or "cannot fulfill" in res_data["response"]

    # 2. Safe Query
    response = client.post("/chat/message", json={
        "message": "What is the crowd density?",
        "context_district": "D1"
    })
    res_data_safe = response.json()
    assert res_data_safe["safety_flag"] is False

def test_do_not_build_compliance():
    """
    CONSTRAINT: Check for forbidden files or libraries.
    (Static analysis test layer)
    """
    # Simple check: Ensure we haven't created a 'face_recognition' module
    assert not os.path.exists("c:/Users/HP/OneDrive/Desktop/Project X/face_recognition")
    assert not os.path.exists("c:/Users/HP/OneDrive/Desktop/Project X/tracking")
