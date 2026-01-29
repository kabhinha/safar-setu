# CCTV Footfall Analytics Service (Agent 5)

## Overview
A privacy-focused, standalone microservice for estimating crowd density and flow from CCTV feeds.
**Privacy by Design**: No video is stored. No face recognition is used. Only aggregate stats (count, density level) are persisted.

## Setup

1. **Prerequisites**:
   - Docker installed.
   - Or Python 3.9+ with `pip` for local run.

2. **Installation (Local)**:
   ```bash
   cd cctv_agent
   pip install -r requirements.txt
   ```

3. **In-place Demo**:
   To generate a sample dummy video for testing:
   ```bash
   python tools/generate_sample_video.py
   ```
   (Requires `opencv-python` to be installed)

   Alternatively, place any `.mp4` file in `data/samples/sample.mp4`.

## Running the Service

### Docker (Recommended)
```bash
docker build -t cctv-agent .
docker run -p 8000:8000 -v $(pwd)/data:/app/data cctv-agent
```

### Local
```bash
python -m src.main
```

## Configuration
Edit `config/config.yaml` to map cameras to districts.
```yaml
cameras:
  - id: "cam_1"
    district_id: "district_A"
    source: "sample.mp4" # or rtsp://192.168.1.100:554/stream
```

## API Usage
Explore the Swagger UI at `http://localhost:8000/docs`.

**Get Stats:**
`GET /stats?district_id=district_A`

## Architecture
- **Ingestion**: Reads RTSP/Files via OpenCV.
- **Processing**: Generic HOG Person Detector (no face ID).
- **Storage**: Local SQLite (aggregates only).
- **API**: FastAPI.
