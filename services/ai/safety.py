import re
from typing import List

class SafetyPolicy:
    """
    Enforces Project X's strict safety and privacy rules for AI outputs.
    """
    
    # 1. No exact location data
    # 2. No tracking/surveillance terminologies
    # 3. No unauthorized routing
    PROHIBITED_PATTERNS = [
        r"gps", r"coordinates", 
        r"latitude", r"longitude",
        r"\d{1,3}\.\d+,\s*\d{1,3}\.\d+", # Lat/Long-ish patterns
        r"route to", 
        r"turn-by-turn",
        r"face.*recognition",
        r"license.*plate",
        r"track.*user",
        r"map pin",
        r"biometric",
        r"fingerprint",
        r"secret trail", 
        r"virgin land",
        r"unexplored",
        r"hidden gem"
    ]

    SENSITIVE_CONTENT_WARNINGS = {
        "sacred_grove": "This area is culturally sensitive. Please follow local guide instructions strictly.",
        "border_zone": "This is a restricted border area. No photography allowed."
    }

    @staticmethod
    def is_content_safe(text: str) -> bool:
        """
        Returns False if text contains any prohibited patterns.
        """
        if not text:
            return True
        normalized_text = text.lower()
        for pattern in SafetyPolicy.PROHIBITED_PATTERNS:
            if re.search(pattern, normalized_text):
                return False
        return True

    @staticmethod
    def sanitize_output(text: str) -> str:
        """
        Redacts or blocks unsafe content. 
        For now, we simply block the whole response if unsafe logic is triggered elsewhere,
        but this helper can strip PII if needed.
        """
        if not SafetyPolicy.is_content_safe(text):
            return "Content blocked by Safety Policy (Pattern Violation)."
        return text

    @staticmethod
    def get_cultural_warning(tags: List[str]) -> str:
        """
        Returns specific warning messages based on tags.
        """
        warnings = []
        for tag in tags:
            if tag in SafetyPolicy.SENSITIVE_CONTENT_WARNINGS:
                warnings.append(SafetyPolicy.SENSITIVE_CONTENT_WARNINGS[tag])
        
        return " ".join(warnings)
