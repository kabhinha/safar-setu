# Agent 5 Integration Guide

## For Agent 2 (Backend)

### Consumption
You should poll our API to update your internal hotspot status.

**Endpoint**: `GET http://cctv-service:8000/stats/latest?district_id={DISTRICT_ID}`

**Response**:
```json
{
  "district_id": "district_A",
  "camera_id": "cam_01",
  "timestamp": "2023-10-27T10:00:00",
  "count": 12,
  "density_state": "MODERATE", // LOW, MODERATE, HIGH, CRITICAL
  "flow_rate": 0.0
}
```

### Alerting Logic
If `density_state` is `HIGH` or `CRITICAL`, triggers a flag in your database for that district to warn incoming travelers.

## For Agent 3 (AI Constraints)

### RAG Ingestion
Your RAG system can ingest the historical stats to answer questions like "How busy is {District} usually at 10 AM?".
Query `GET /stats?district_id={id}&limit=1000` to build your context.

### Ethical Constraints
- This agent **guarantees** no PII is emitted.
- You can safely use these aggregates in LLM contexts without risk of leaking identity.
