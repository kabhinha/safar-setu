from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class CrowdDensityState(str, enum.Enum):
    LOW = 'LOW'
    MODERATE = 'MODERATE'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'

class AggregateStats(Base):
    __tablename__ = 'aggregates'

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String, index=True, nullable=False)
    camera_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    count = Column(Integer, nullable=False)
    density_state = Column(SQLEnum(CrowdDensityState), nullable=False)
    flow_rate = Column(Float, nullable=True) # People per minute approximation

    def to_dict(self):
        return {
            "id": self.id,
            "district_id": self.district_id,
            "camera_id": self.camera_id,
            "timestamp": self.timestamp.isoformat(),
            "count": self.count,
            "density_state": self.density_state.value,
            "flow_rate": self.flow_rate
        }
