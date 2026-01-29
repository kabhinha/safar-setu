from ai.chat import BuddyChat
from ai.embeddings import EmbeddingGenerator
from ai.safety import SafetyPolicy

# Re-exporting for backward compatibility or ease of import
# But recommending use of ai.chat.BuddyChat directly

# Singleton instance for simple imports
_embedder = EmbeddingGenerator()
default_buddy = BuddyChat(_embedder)

def get_buddy_engine():
    return default_buddy

# Keeping the old class name if older code referenced it, 
# but making it a wrapper around the new system.
class BuddyChatEngine:
    def __init__(self):
        self._engine = default_buddy

    def generate_response(self, user_query: str, district_context: str) -> str:
        result = self._engine.generate_response(user_query, district_context)
        return result['response']
