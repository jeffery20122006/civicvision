import sys
import json
import argparse
import cv2
import numpy as np

# In a real scenario, this would be `from ultralytics import YOLO`
# We will mock the YOLOv8 behavior for the prototype
class MockYOLO:
    def __init__(self, weights_path):
        self.weights = weights_path
        self.classes = ['pothole', 'garbage', 'broken streetlight']

    def __call__(self, img):
        # Mocking an inference result
        # Randomly choose one of the classes
        import random
        random.seed()
        
        detected_class_idx = random.randint(0, len(self.classes) - 1)
        
        # Mock bounding box: [x1, y1, x2, y2]
        # Let's say image size is 640x640 (after preprocessing)
        img_h, img_w = img.shape[:2]
        
        # Random size for the bounding box
        box_w = random.uniform(0.1, 0.6) * img_w
        box_h = random.uniform(0.1, 0.6) * img_h
        
        x1 = random.uniform(0, img_w - box_w)
        y1 = random.uniform(0, img_h - box_h)
        x2 = x1 + box_w
        y2 = y1 + box_h
        
        confidence = random.uniform(0.65, 0.98)
        
        class MockResult:
            def __init__(self, cls_idx, conf, box):
                self.boxes = self.MockBoxes(cls_idx, conf, box)
                self.names = {0: 'pothole', 1: 'garbage', 2: 'broken streetlight'}
                
            class MockBoxes:
                def __init__(self, cls_idx, conf, box):
                    self.cls = [cls_idx]
                    self.conf = [conf]
                    self.xyxy = [box]
        
        return [MockResult(detected_class_idx, confidence, [x1, y1, x2, y2])]

def determine_severity(box_area, img_area):
    """
    Determine severity based on the relative size of the bounding box.
    """
    ratio = box_area / img_area
    if ratio > 0.30:
        return "High"
    elif ratio > 0.10:
        return "Medium"
    else:
        return "Low"

def main():
    parser = argparse.ArgumentParser(description="AI Image Processing Pipeline for Civic Issues")
    parser.add_argument('image_path', type=str, help='Path to the image file to process')
    args = parser.parse_args()

    try:
        # 1. Read the image using OpenCV
        img = cv2.imread(args.image_path)
        if img is None:
            raise FileNotFoundError(f"Could not load image at {args.image_path}")

        # 2. Preprocess the image
        # Resize to YOLO's typical input size (e.g., 640x640)
        target_size = (640, 640)
        resized_img = cv2.resize(img, target_size)
        
        # Normalize (Convert to RGB and scale to 0-1 range for potential custom models)
        # Ultralytics YOLOv8 does normalization internally, but demonstrating it as requested
        normalized_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB) / 255.0
        
        # For our mock YOLO, we'll just pass the resized shape for accurate bounding box math
        
        # 3. Load Model and Predict
        # Mocking the custom weights
        model = MockYOLO('yolov8_civic_custom.pt')
        results = model(resized_img)
        
        # 4. Extract and Process Results
        output_data = []
        img_area = target_size[0] * target_size[1]
        
        result = results[0]
        
        if len(result.boxes.cls) > 0:
            for i in range(len(result.boxes.cls)):
                cls_id = int(result.boxes.cls[i])
                issue_name = result.names[cls_id]
                confidence = float(result.boxes.conf[i])
                
                # Bounding box coordinates
                x1, y1, x2, y2 = result.boxes.xyxy[i]
                
                # Calculate Area for Severity classification
                box_area = (x2 - x1) * (y2 - y1)
                severity = determine_severity(box_area, img_area)
                
                output_data.append({
                    "detectedIssue": issue_name,
                    "confidence": round(confidence, 3),
                    "boundingBox": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2)
                    },
                    "severity": severity
                })
        
        # 5. Output JSON string
        print(json.dumps(output_data))
        
    except Exception as e:
        # Output error as JSON to be safely parseable by the Node backend
        error_json = json.dumps({"error": str(e)})
        print(error_json, file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
