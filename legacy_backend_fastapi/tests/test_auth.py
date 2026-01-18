
import pytest
from httpx import AsyncClient

# Constants
SIGNUP_URL = "/api/v1/signup"
LOGIN_URL = "/api/v1/login/access-token"

@pytest.mark.asyncio
async def test_signup_valid_invite(async_client: AsyncClient, valid_invite_code):
    payload = {
        "email": "pilot_user@example.com",
        "password": "securepassword123",
        "invite_code": valid_invite_code,
        "role": "traveler"
    }
    response = await async_client.post(SIGNUP_URL, json=payload)
    # Since we mock DB, the user won't be found, so it tries to create.
    # The MockDbSession.add won't fail.
    # We expect 200 OK
    assert response.status_code == 200, f"Response text: {response.text}"
    data = response.json()
    assert data["email"] == payload["email"]
    assert "id" in data

@pytest.mark.asyncio
async def test_signup_invalid_invite_code(async_client: AsyncClient, invalid_invite_code):
    payload = {
        "email": "hacker@example.com",
        "password": "securepassword123",
        "invite_code": invalid_invite_code,
        "role": "traveler"
    }
    response = await async_client.post(SIGNUP_URL, json=payload)
    assert response.status_code == 403
    assert "Invalid Invite Code" in response.json()["detail"]

@pytest.mark.asyncio
async def test_signup_no_invite_code(async_client: AsyncClient):
    payload = {
        "email": "random@example.com",
        "password": "pass",
        "role": "traveler"
    }
    response = await async_client.post(SIGNUP_URL, json=payload)
    # Should fail validation (Invite code required in schema?) or check
    # Schema says Optional[str] = None. 
    # Logic: if PILOT_MODE: verify invite code.
    # So correct response is 403.
    assert response.status_code == 403
