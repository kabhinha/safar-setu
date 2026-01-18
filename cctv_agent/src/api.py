from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .storage import get_db, get_aggregates
from .models import AggregateStats

app = FastAPI(title="CCTV Analytics Service", version="1.0")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/stats", response_model=List[dict])
def get_stats(
    district_id: Optional[str] = None, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get generic crowd statistics.
    """
    stats = get_aggregates(db, district_id, limit)
    return [s.to_dict() for s in stats]

@app.get("/stats/latest")
def get_latest_stats(district_id: str, db: Session = Depends(get_db)):
    """
    Get the single latest aggregate for a district.
    """
    stats = get_aggregates(db, district_id, limit=1)
    if not stats:
        raise HTTPException(status_code=404, detail="No data found for this district")
    return stats[0].to_dict()
