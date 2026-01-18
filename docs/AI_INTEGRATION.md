# AI Module Integration Guide

## Overview
The `ai/` module provides three core services:
1.  **Safety Policy**: Hard constraints on inputs/outputs.
2.  **Recommendation Engine**: Vector-based matching + Ethical/Crowd Constraints.
3.  **Buddy Chat**: RAG-based chat with safety guardrails.

## Setup
Ensure requirements are installed:
```bash
pip install -r backend/requirements.txt
```
(Requires `numpy`, `sentence-transformers`, `pgvector`)

## Usage

### 1. Initializing Services
Recmmended to initialize as singletons in `backend/main.py`.

```python
from ai.embeddings import EmbeddingGenerator
from ai.recommendations import RecommendationEngine
from ai.chat import BuddyChat

# Initialize once (loads model)
embedder = EmbeddingGenerator()
rec_engine = RecommendationEngine(embedder)
chat_engine = BuddyChat(embedder)
```

### 2. Getting Recommendations
Use in `GET /listings`:

```python
# district_crowd_index: Fetch latest from DB/Process
crowd_data = {"district_id_123": "HIGH"} 

recs = rec_engine.recommend(
    user_profile_text="I like tea and hiking",
    candidate_hotspots=all_hotspots_list,
    district_crowd_index=crowd_data
)
```

### 3. Buddy Chat
Use in `POST /chat/message`:

```python
response = chat_engine.generate_response(
    user_query="Where can I find tea?",
    district_context="District A"
)

if response['safety_flag']:
    # Handle rejection (log attempt?)
    return {"text": response['response']}
else:
    return {"text": response['response'], "citations": response['citations']}
```

## Safety Constraints
- **Coordinates**: The system will automatically block requests asking for coordinates.
- **Crowd Control**: If a district is marked `HIGH` density, recommendation scores are penalized by 30%.
