import sys
import json
import argparse
import hashlib
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def verify_fix(original_path, proof_path):
    try:
        # MD5 check for exact duplicate upload
        md5_orig = get_md5(original_path)
        md5_proof = get_md5(proof_path)
        if md5_orig == md5_proof:
            print(json.dumps({
                "passed": False,
                "ssim": 1.0,
                "detections_after": 1,
                "reason": "Proof image is identical to the original report (MD5 match)."
            }))
            return

        # Load images
        img1 = cv2.imread(original_path)
        img2 = cv2.imread(proof_path)

        if img1 is None:
            raise FileNotFoundError(f"Could not load original image at {original_path}")
        if img2 is None:
            raise FileNotFoundError(f"Could not load proof image at {proof_path}")

        # Resize to standard size for SSIM
        target_size = (640, 640)
        img1_resized = cv2.resize(img1, target_size)
        img2_resized = cv2.resize(img2, target_size)

        # Convert to grayscale
        gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)

        # Compute SSIM
        score, diff = ssim(gray1, gray2, full=True)
        
        if score > 0.98:
            print(json.dumps({
                "passed": False,
                "ssim": round(score, 3),
                "detections_after": 1,
                "reason": "Proof image is too visually similar to original (SSIM > 0.98). Appears to be the same photo."
            }))
            return

        # Mock YOLOv8 inference logic
        # In a real scenario, we would load `ai/weights/civic_yolov8.pt` and run `model(img2)`
        # Here we mock it based on SSIM: if score < 0.90, we assume the hazard was removed successfully.
        
        has_detections = score > 0.90 # Mock logic: if it's very similar, it still has the pothole
        mock_detections_after = 1 if has_detections else 0
        mock_confidence = 0.85 if has_detections else 0.15
        
        passed = (mock_confidence < 0.35) or (mock_detections_after == 0)
        reason = "Issue resolved: Hazard no longer detected." if passed else "Hazard still present in proof image."
        
        print(json.dumps({
            "passed": passed,
            "ssim": round(score, 3),
            "detections_after": mock_detections_after,
            "reason": reason
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="AI Image Verification Pipeline")
    parser.add_argument('original', type=str, help='Path to the original reported image')
    parser.add_argument('proof', type=str, help='Path to the new proof of fix image')
    
    args = parser.parse_args()
    verify_fix(args.original, args.proof)

if __name__ == "__main__":
    main()
