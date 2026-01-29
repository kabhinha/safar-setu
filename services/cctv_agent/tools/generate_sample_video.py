import cv2
import numpy as np

def create_sample_video(output_path="data/samples/sample.mp4", duration=10, fps=30):
    width, height = 640, 480
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    if not out.isOpened():
        print("Error opening video writer")
        return

    frames = duration * fps
    
    # Simulating 3 people moving
    people = [
        {"x": 100, "y": 200, "dx": 2, "dy": 0, "color": (255, 255, 255)}, # White box
        {"x": 500, "y": 300, "dx": -2, "dy": -1, "color": (200, 200, 200)}, 
        {"x": 300, "y": 100, "dx": 0, "dy": 2, "color": (150, 150, 150)},
    ]

    for _ in range(frames):
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Draw "People" (HOG detects upright humans, simple rectangles might NOT trigger it. 
        # Actually HOG is trained on gradients of human shapes. Rectangles won't work well for HOG.
        # But for 'testing the pipeline' (ingestion -> loop -> db), any video works.
        # If we want HOG to detect, we need real human images. 
        # Since I can't generate a real human, I will accept that for this synthetic video, 
        # count might be 0, but the PIPELINE acts correctly.
        # Wait, I can try to draw a stick figure? No, HOG is complex.
        # I will document that this video tests the *system*, not the *model accuracy*.
        
        for p in people:
            # Update pos
            p["x"] += p["dx"]
            p["y"] += p["dy"]
            
            # Bounce bounds
            if p["x"] < 0 or p["x"] > width: p["dx"] *= -1
            if p["y"] < 0 or p["y"] > height: p["dy"] *= -1
            
            # Draw rectangle
            cv2.rectangle(frame, (int(p["x"]), int(p["y"])), (int(p["x"]+40), int(p["y"]+100)), p["color"], -1)
            
        out.write(frame)

    out.release()
    print(f"Video saved to {output_path}")

if __name__ == "__main__":
    create_sample_video()
