from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from .models import Base, AggregateStats

# Use a local SQLite file for this agent.
# In a real cluster, this might point to a shared Postgres, 
# but per instructions, this is a standalone service/module.
DB_PATH = os.getenv("DB_PATH", "sqlite:///data/db/cctv_stats.db")

engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_aggregate(db, stats: dict):
    """
    Save computed aggregate statistics to DB.
    """
    db_item = AggregateStats(
        district_id=stats['district_id'],
        camera_id=stats['camera_id'],
        count=stats['count'],
        density_state=stats['density_state'],
        flow_rate=stats.get('flow_rate', 0.0)
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_aggregates(db, district_id: str = None, limit: int = 100):
    query = db.query(AggregateStats)
    if district_id:
        query = query.filter(AggregateStats.district_id == district_id)
    
    return query.order_by(AggregateStats.timestamp.desc()).limit(limit).all()
