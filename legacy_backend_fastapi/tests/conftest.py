
import pytest
from httpx import AsyncClient
import sys
import os
from unittest.mock import MagicMock, AsyncMock


# Append backend directory to sys.path
backend_dir = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "backend"
)
sys.path.append(backend_dir)

from app.main import app
from app.api import deps
from app.core.config import settings

# Mock DB Session
class MockDbSession:
    def __init__(self):
        self.execute = AsyncMock()
        self.add = MagicMock()
        self.commit = AsyncMock()
        self.refresh = AsyncMock()
        self.scalars = MagicMock(return_value=MagicMock(first=MagicMock(return_value=None)))

async def override_get_db():
    try:
        db = MockDbSession()
        yield db
    finally:
        pass

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(autouse=True)
def mock_db_dependency():
    app.dependency_overrides[deps.get_db] = override_get_db
    yield
    app.dependency_overrides = {}

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
def valid_invite_code():
    return settings.PILOT_INVITE_CODE

@pytest.fixture
def invalid_invite_code():
    return "invalid-code-123"
