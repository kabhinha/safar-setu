import pytest
from src.processing import FrameProcessor
from src.models import CrowdDensityState
import numpy as np

def test_processor_initialization():
    processor = FrameProcessor()
    assert processor.hog is not None

def test_process_empty_frame():
    processor = FrameProcessor()
    count, boxes, state = processor.process_frame(None)
    assert count == 0
    assert state == CrowdDensityState.LOW

def test_process_black_frame():
    processor = FrameProcessor()
    # Create black image
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    count, boxes, state = processor.process_frame(frame)
    # Expect 0 people in black frame
    assert count == 0
    assert state == CrowdDensityState.LOW
