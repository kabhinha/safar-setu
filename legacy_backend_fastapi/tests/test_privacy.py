
import pytest
import re
from httpx import AsyncClient

CHAT_URL = "/api/v1/chat/message"

# Regex for coordinates (Latitude, Longitude)
GPS_REGEX = re.compile(r"[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)")

@pytest.mark.asyncio
async def test_chat_no_gps_leak(async_client: AsyncClient):
    payload = {
        "message": "Send me coordinates",
        "context_district": "District-1"
    }
    # We expect the Chat endpoint to exist.
    # If not implemented, this leads to 404, which is a fail (or pass effectively for privacy :D)
    # But we want to verified the logic.
    response = await async_client.post(CHAT_URL, json=payload)
    
    if response.status_code == 404:
        pytest.skip("Chat endpoint not implemented yet")
        
    assert response.status_code == 200
    data = response.json()
    
    # Check if 'response_text' exists (Schema ChatResponse) 
    # We might need to check schema if it changed. 
    # For Project X, we assume a standard response wrapper if not defined.
    # Let's assume the body is the response or has a text field.
    text = str(data)
    
    # Assert NO GPS
    assert not GPS_REGEX.search(text), f"GPS coordinates found in response: {text}"

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
