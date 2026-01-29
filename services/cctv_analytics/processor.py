import time
import random
import json
import os
from datetime import datetime

class CameraStreamSimulator:
    """
    Simulates a CCTV stream by generating metadata frames only.
    DOES NOT GENERATE VIDEO FILES (Strict Privacy Compliance).
    """
    def __init__(self, district_id: str, camera_id: str):
        self.district_id = district_id
        self.camera_id = camera_id

    def get_frame_metrics(self):
        """
        Returns random crowd/vehicle counts to simulate activity.
        """
        # Simulation Logic: weighted randoms
        people = random.randint(0, 50)
        vehicles = random.randint(0, 20)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "camera_id": self.camera_id,
            "district_id": self.district_id,
            "people_count": people,
            "vehicle_count": vehicles
        }

class Aggregator:
    """
    Agent 5 Logic: Aggregates raw counts into Safety Metrics.
    output = State/District density index.
    """
    def __init__(self):
        self.db_path = "../backend/district_state.json"
        
    def process_streams(self, streams):
        district_sums = {}
        
        for stream in streams:
            data = stream.get_frame_metrics()
            d_id = data["district_id"]
            
            if d_id not in district_sums:
                district_sums[d_id] = {"people": 0, "vehicles": 0, "cams": 0}
            
            district_sums[d_id]["people"] += data["people_count"]
            district_sums[d_id]["vehicles"] += data["vehicle_count"]
            district_sums[d_id]["cams"] += 1
            
        # Write aggregations
        results = {}
        for d_id, metrics in district_sums.items():
            results[d_id] = {
                "district_id": d_id,
                "active_cameras": metrics["cams"],
                # Simple Index Calculation
                "crowd_density": min(100, metrics["people"] * 2), 
                "vehicle_flow": metrics["vehicles"]
            }
            
        return results

if __name__ == "__main__":
    # Setup simulated environment
    sim_streams = [
        CameraStreamSimulator("D1", "CAM-01"),
        CameraStreamSimulator("D1", "CAM-02"),
        CameraStreamSimulator("D2", "CAM-03"),
        CameraStreamSimulator("D3", "CAM-04"),
    ]
    
    aggregator = Aggregator()
    
    print("Agent 5: CCTV Analytics Engine Running...")
    print("Press Ctrl+C to stop.")
    
    while True:
        try:
            stats = aggregator.process_streams(sim_streams)
            print(f"[{datetime.now().time()}] Updated Stats: {json.dumps(stats)}")
            # In real system, write to DB. Here we just print or mock.
            time.sleep(2)
        except KeyboardInterrupt:
            break
