from typing import List, Union
import numpy as np
import logging

# Force Mock Mode due to Windows DLL Error (WinError 1114)
HAS_TRANSFORMERS = False
# try:
#     from sentence_transformers import SentenceTransformer
#     HAS_TRANSFORMERS = True
# except ImportError:
#     HAS_TRANSFORMERS = False

class EmbeddingGenerator:
    """
    Handles generation of vector embeddings for Travelers (Preferences) and Hotspots (Content).
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.logger = logging.getLogger("AI.Embeddings")
        self.model = None
        if HAS_TRANSFORMERS:
            # Lazy load or handle download in real deploy
            # For this pilot environment, we might fallback to random if weights aren't present
            try:
                self.model = SentenceTransformer(model_name)
            except Exception as e:
                self.logger.warning(f"Warning: Could not load SentenceTransformer: {e}")
        else:
            self.logger.warning("sentence-transformers not found. Using MOCK embeddings.")
        
    def generate(self, text: Union[str, List[str]]) -> np.ndarray:
        """
        Generates a vector embedding for the given text.
        """
        if self.model:
            return self.model.encode(text)
        else:
            # Fallback for dev/test without heavy weights
            # print(f"Returning Mock Embeddings for: {str(text)[:20]}...")
            if isinstance(text, str):
                return np.random.rand(384)
            return np.random.rand(len(text), 384)

    def create_traveler_vector(self, preferences: str, behavior_signals: List[str] = None) -> np.ndarray:
        """
        Combines explicit preferences with implicit signals.
        """
        base_text = preferences
        if behavior_signals:
            # Simple concatenation strategy for Pilot
            base_text += " " + " ".join(behavior_signals)
        
        return self.generate(base_text)

    def create_hotspot_vector(self, description: str, sensory_tags: List[str]) -> np.ndarray:
        """
        Creates vector for a location/hotspot document.
        """
        content = f"{description} {' '.join(sensory_tags)}"
        return self.generate(content)
