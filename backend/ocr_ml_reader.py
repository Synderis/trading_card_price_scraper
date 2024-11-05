import cv2
from google.cloud import vision
import io
import numpy as np

def detect_card_details(test_image_path):
    # Create a Google Vision client
    # api = open(r"C:\Users\Dylan\Desktop\google_vision_api_key.txt", 'r').read()
    client = vision.ImageAnnotatorClient.from_service_account_json(r"C:\Users\Dylan\Downloads\steam-canto-440401-f9-2de1c7608dd0.json")

    # Load image
    image = cv2.imread(test_image_path)
    
    # Define bounding box parameters for "name" and "number" regions
    bounding_boxes = {
        'name': (0.5, 0.06, 1.0, 0.12),  # x_center, y_center, width, height for the name region
        'number': (0.5, 0.94, 1.0, 0.12)  # x_center, y_center, width, height for the number region
    }

    def get_absolute_bbox(image_shape, bbox_params):
        img_height, img_width = image_shape[:2]
        x_center, y_center, width, height = bbox_params
        x_min = int((x_center - width / 2) * img_width)
        y_min = int((y_center - height / 2) * img_height)
        x_max = int((x_center + width / 2) * img_width)
        y_max = int((y_center + height / 2) * img_height)
        return x_min, y_min, x_max, y_max

    details = {}

    # Process each bounding box
    for key, bbox in bounding_boxes.items():
        # Get absolute bounding box coordinates
        region_coords = get_absolute_bbox(image.shape, bbox)
        
        # Crop the region from the image
        region = image[region_coords[1]:region_coords[3], region_coords[0]:region_coords[2]]

        # Convert cropped region to bytes for Google Vision
        _, buffer = cv2.imencode('.png', region)
        image_bytes = buffer.tobytes()

        # Use Google Cloud Vision for OCR
        image = vision.Image(content=image_bytes)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        
        # Extract text based on the bounding box
        if texts:
            if key == 'name':
                # Assuming the name is the first detected text
                details['name'] = texts[0].description
            elif key == 'number':
                # Assuming the number is the last detected text
                details['number'] = texts[-1].description.split('/')[0]  # Extracting just the number part

    return details

# Example usage
# card_details = detect_card_details('path/to/card/image.png')
# print(f"Card Name: {card_details.get('name', 'N/A')}, Card Number: {card_details.get('number', 'N/A')}")
