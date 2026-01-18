import threading
import time
import logging
import yaml
import uvicorn
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI

from .api import app as api_app
from .ingestion import VideoStream
from .processing import FrameProcessor
from .storage import init_db, SessionLocal, save_aggregate

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Config loading
CONFIG_PATH = os.getenv("CONFIG_PATH", "config/config.yaml")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        logger.warning(f"Config file not found at {CONFIG_PATH}. Using manual defaults.")
        return {"cameras": []}
    with open(CONFIG_PATH, 'r') as f:
        return yaml.safe_load(f)

# Global flag to stop threads
STOP_EVENT = threading.Event()

def processing_loop():
    logger.info("Starting processing loop...")
    init_db()
    config = load_config()
    
    # Initialize streams
    streams = []
    processor = FrameProcessor()
    
    for cam in config.get('cameras', []):
        try:
            # Check if source is a file or stream
            # For this MVP, we assume files are local paths in 'data/samples/'
            source = cam['source']
            is_file = False
            
            # Simple heuristic for file vs stream url
            if not source.startswith('rtsp://') and not source.startswith('http'):
                 is_file = True
                 # Adjust path if relative
                 if not os.path.isabs(source):
                     source = os.path.join("data", "samples", source)

            stream = VideoStream(source, is_file=is_file)
            streams.append({
                "stream": stream,
                "id": cam['id'],
                "district_id": cam['district_id']
            })
            logger.info(f"Initialized camera {cam['id']} for district {cam['district_id']}")
        except Exception as e:
            logger.error(f"Failed to init camera {cam.get('id')}: {e}")

    # Main Loop
    # In a real system, we might use multiprocessing or async properly.
    # Here, we sequentially process frames from all cameras.
    db = SessionLocal()
    
    while not STOP_EVENT.is_set():
        if not streams:
            logger.warning("No active streams. Sleeping...")
            time.sleep(5)
            continue

        for item in streams:
            stream = item['stream']
            frame = stream.get_frame()
            
            if frame is not None:
                # Process
                count, _, density_state = processor.process_frame(frame)
                
                # Log to DB (Throttling: In real production, we wouldn't write EVERY frame.
                # maybe every 5 seconds or 1 minute average.)
                # For this pilot implementation/demo, we'll write every ~Nth frame or just simple sleep.
                
                # Let's aggregate 1 reading per 5 seconds per camera to save DB space
                # But here in the loop, we are running fast.
                
                # Implementation: Just write it for now, let's assume low framerate in loop.
                aggregate = {
                    "district_id": item['district_id'],
                    "camera_id": item['id'],
                    "count": count,
                    "density_state": density_state,
                    "flow_rate": 0.0 # Placeholder
                }
                
                # Only log if changed or periodically? 
                # Let's log periodically.
                # (Skipping sophisticated throttling for this MVP code, just log execution)
                
                save_aggregate(db, aggregate)
                logger.debug(f"Cam {item['id']}: Count={count}, Density={density_state.value}")

        # Sleep to simulate interval (e.g., 1 frame per second processing rate)
        time.sleep(1)

    db.close()
    for item in streams:
        item['stream'].release()
    logger.info("Processing loop stopped.")

# FastAPI Lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    t = threading.Thread(target=processing_loop, daemon=True)
    t.start()
    yield
    # Shutdown
    STOP_EVENT.set()
    t.join(timeout=2)

# Mount the lifespan to the imported API app (or create a new wrapper)
# Since we imported 'app' from .api, we should modify it.
api_app.router.lifespan_context = lifespan

if __name__ == "__main__":
    uvicorn.run("src.main:api_app", host="0.0.0.0", port=8000, reload=True)
