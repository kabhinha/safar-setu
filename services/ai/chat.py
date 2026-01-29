from typing import List, Dict, Any
from ai.safety import SafetyPolicy
from ai.embeddings import EmbeddingGenerator

class BuddyChat:
    """
    RAG-based Chat Engine for 'Project X' Buddy.
    Strictly follows SafetyPolicy.
    """
    
    SYSTEM_PROMPT = (
        "You are 'Buddy', a knowledgeable, culturally inclusive guide for North-East India. "
        "You prioritise the safety of nature and respect for local communities. "
        "You NEVER provide exact GPS coordinates or turn-by-turn routes. "
        "You answer based on the provided CONTEXT only."
    )

    def __init__(self, embedding_service: EmbeddingGenerator):
        self.embedding_service = embedding_service
        # In a real system, self.index would be a connection to pgvector
        
    def retrieve_context(self, query_vector, district_context: str) -> List[str]:
        """
        Mock RAG Retrieval.
        Returns snippets of cultural/safety docs + relevant hotspot info.
        """
        # 1. Retrieve Canonical Policy
        context_docs = [
            "Sensitivity Rule: Do not enter sacred groves without a local elder.",
            "Safety Rule: Roads in District A close after sunset due to fog.",
            f"Context: You are currently discussing {district_context}."
        ]
        
        # 2. Retrieve relevant hotspots (Mock)
        # In prod: vector_search(query_vector, filter={'district': district_context})
        
        return context_docs

    def generate_response(self, user_query: str, district_context: str, history: List[str] = []) -> Dict[str, Any]:
        """
        Main Chat Loop.
        1. Safety Check
        2. Vectorize Query
        3. Retrieve Context
        4. Synthesize Answer (Mock LLM)
        """
        
        # 1. Hard Safety Guard (Regex)
        # Using new method name
        if not SafetyPolicy.is_content_safe(user_query):
            return {
                "response": "I cannot fulfill this request. Project X policy restricts sharing locations or tracking individuals.",
                "citations": [],
                "safety_flag": True
            }

        # 2. RAG Retrieval
        query_vec = self.embedding_service.generate(user_query)
        context = self.retrieve_context(query_vec, district_context)
        
        # 3. Answer Synthesis (Mock)
        # In prod: call LLM(system=SYSTEM_PROMPT, user=user_query, context=context)
        
        # Simple keywords for mock responses
        response_text = "I don't have enough info on that."
        citations = []
        
        lower_q = user_query.lower()
        
        if "tea" in lower_q:
            response_text = f"The tea gardens in {district_context} are known for their orthodox variety. Please respect the 'Quiet Zones' around the worker colonies."
            citations = ["Listing: Heritage Tea Estate"]
        elif "hike" in lower_q or "trek" in lower_q:
            response_text = f"There are sanctioned trails in {district_context}. The 'Cloud Walk' is popular but requires a guide. Remember: No solo trekking in protected zones."
            citations = ["Listing: Cloud Walk Trail"]
        elif "food" in lower_q or "eat" in lower_q:
            response_text = f"Local cuisine in {district_context} features smoked meats and fermented bamboo shoots. Try the community kitchen near the market."
        else:
            response_text = f"I can help you explore {district_context} responsibly. Ask me about culture, food, or approved activities."

        return {
            "response": response_text,
            "citations": citations,
            "safety_flag": False
        }
