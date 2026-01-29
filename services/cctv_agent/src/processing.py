import cv2
import numpy as np
from .models import CrowdDensityState

class FrameProcessor:
    def __init__(self):
        # Initialize HOG descriptor/person detector
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    def process_frame(self, frame):
        """
        Detect people in a frame and return count and bounding boxes.
        Returns: (count, boxes, density_state)
        """
        if frame is None:
            return 0, [], CrowdDensityState.LOW

        # Resize for faster processing if needed, though HOG handles standard sizes well.
        # Keeping it original size for better accuracy on small far-away people, 
        # but max usage of 640px width is recommended for speed.
        height, width = frame.shape[:2]
        if width > 800:
            scale = 800 / width
            frame = cv2.resize(frame, (800, int(height * scale)))
        
        # Detect people
        # winStride: Step size for window sliding. (4,4) is accurate but slow. (8,8) is faster.
        # padding: Image padding.
        # scale: Downscale ratio for the image pyramid.
        boxes, weights = self.hog.detectMultiScale(
            frame, 
            winStride=(8, 8), 
            padding=(8, 8), 
            scale=1.05
        )

        count = len(boxes)
        
        # Calculate density
        # Simple heuristic: People / Image Area (normalized)
        # Or just raw count thresholds for the pilot.
        # Let's use raw count thresholds for simplicity and robustness.
        
        density_state = CrowdDensityState.LOW
        if count == 0:
            density_state = CrowdDensityState.LOW
        elif count < 5:
            density_state = CrowdDensityState.LOW
        elif count < 15:
            density_state = CrowdDensityState.MODERATE
        elif count < 30: 
            density_state = CrowdDensityState.HIGH
        else:
            density_state = CrowdDensityState.CRITICAL
            
        return count, boxes, density_state

    def estimate_flow(self, prev_frame, curr_frame):
        """
        Optional: Estimate flow using Optical Flow.
        For now returning 0 placeholder to keep it lightweight.
        """
        return 0.0
