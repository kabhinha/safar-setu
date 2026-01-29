import cv2
import time
import logging

logger = logging.getLogger(__name__)

class VideoStream:
    def __init__(self, source_path, is_file=False):
        self.source_path = source_path
        self.is_file = is_file
        self.cap = cv2.VideoCapture(self.source_path)
        
        if not self.cap.isOpened():
            logger.error(f"Cannot open video source: {self.source_path}")
            raise ValueError(f"Cannot open video source: {self.source_path}")

    def get_frame(self):
        ret, frame = self.cap.read()
        
        if not ret:
            if self.is_file:
                # If file ends, loop back to start
                logger.info(f"End of file reached for {self.source_path}, looping...")
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = self.cap.read()
            else:
                # If stream ends/breaks, try to reconnect (simplified)
                logger.warning("Stream disconnected. Attempting reconnect...")
                self.cap.release()
                time.sleep(1) # Wait before reconnect
                self.cap = cv2.VideoCapture(self.source_path)
                ret, frame = self.cap.read()

        return frame if ret else None

    def release(self):
        if self.cap:
            self.cap.release()
