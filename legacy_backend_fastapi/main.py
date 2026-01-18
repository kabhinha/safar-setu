from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Import Agent 3 Modules
try:
    from ai.chat_engine import get_buddy_engine
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False

app = FastAPI(title="Project X Pilot API", version="1.0.1")

# --- DATA MODELS ---

# --- DATA MODELS ---

class LoginRequest(BaseModel):
    invite_token: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    invite_token: str

class TelemetryData(BaseModel):
    device_id: str
    timestamp: datetime
    density_state: str # LOW, MODERATE, HIGH, CRITICAL
    count_15min: int

class DistrictMetrics(BaseModel):
    district_id: str
    timestamp: datetime
    active_cameras: int
    crowd_density: int       # 0-100
    vehicle_flow: int        # vehicles/min

class ChatIncoming(BaseModel):
    message: str
    context_district: str

class ChatOutgoing(BaseModel):
    response: str
    safety_flag: bool

# --- IN-MEMORY STORE (MOCK DB) ---
# Agent 5 will populate this in a real scenario
DISTRICT_DATA = {
    "D1": {"district_id": "D1", "crowd_density": 34, "vehicle_flow": 12, "active_cameras": 5},
    "D2": {"district_id": "D2", "crowd_density": 76, "vehicle_flow": 45, "active_cameras": 8}
}
VALID_INVITE_CODES = {"pilot-admin-001", "pilot-user-010"}
# In-memory user store for demo
REGISTERED_USERS = {} 

# --- ENDPOINTS ---

@app.get("/health")
def health():
    return {"status": "operational", "version": "1.0.1", "ai_module": AI_AVAILABLE}

@app.post("/auth/register")
def register(data: RegisterRequest):
    # 1. Check Invite Code
    if data.invite_token not in VALID_INVITE_CODES:
        raise HTTPException(status_code=403, detail="Invalid Invite Code")
    
    # 2. Check if Code already used (Simulated)
    # if data.invite_token in used_tokens...
    
    # 3. Create User
    REGISTERED_USERS[data.email] = {"password": data.password, "role": "GUEST"}
    
    return {"status": "created", "email": data.email}

@app.post("/auth/login")
def login(creds: LoginRequest):
    # Legacy token login or check registered users
    # For pilot simplicity, valid token = logged in
    if creds.invite_token in VALID_INVITE_CODES:
        return {"token": "sess_" + creds.invite_token, "valid": True}
    raise HTTPException(status_code=401, detail="Invalid Invite Token")

@app.get("/analytics/district/{district_id}", response_model=DistrictMetrics)
def get_metrics(district_id: str):
    if district_id not in DISTRICT_DATA:
         # Return default/empty for unknown districts to avoid crashing frontend
         return DistrictMetrics(
             district_id=district_id,
             timestamp=datetime.now(),
             active_cameras=0,
             crowd_density=0,
             vehicle_flow=0
         )
    
    data = DISTRICT_DATA[district_id]
    return DistrictMetrics(
        district_id=district_id,
        timestamp=datetime.now(),
        active_cameras=data["active_cameras"],
        crowd_density=data["crowd_density"],
        vehicle_flow=data["vehicle_flow"]
    )

@app.post("/telemetry/cctv-aggregate")
async def ingest_telemetry(request: Request, data: TelemetryData):
    # 1. Enforce Payload Size Limit (1KB)
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > 1024:
        raise HTTPException(status_code=413, detail="Payload too large. Max 1KB.")
    
    # Double check body size just in case header is missing/fake
    body_bytes = await request.body()
    if len(body_bytes) > 1024:
        raise HTTPException(status_code=413, detail="Payload too large.")

    return {"status": "accepted", "device": data.device_id}

@app.post("/chat/message", response_model=ChatOutgoing)
def chat_endpoint(payload: ChatIncoming):
    if not AI_AVAILABLE:
        return ChatOutgoing(response="System Error: AI Module not loaded.", safety_flag=True)
    
    engine = get_buddy_engine()
    # Agent 2 passes request to Agent 3
    # Note: Agent 2 trusts Agent 3 to handle safety, but could double-check here.
    
    result = engine.generate_response(payload.message, payload.context_district)
    
    return ChatOutgoing(
        response=result["response"],
        safety_flag=result["safety_flag"]
    )

if __name__ == "__main__":
    import uvicorn
    # Listen on all interfaces for Docker compatibility
    uvicorn.run(app, host="0.0.0.0", port=8000)
