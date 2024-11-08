from io import BytesIO
from PIL import Image, ImageEnhance
import base64
from google.cloud import vision
import pillow_heif
import json

# Register the HEIF opener to enable HEIC format support
pillow_heif.register_heif_opener()

def read_google_credentials():
    with open('google_info.json', 'r') as file:
        google_credentials = json.load(file)
    return google_credentials

def decode_base64_image(base64_str):
    """Decode a base64 image string to an image file in memory."""
    base64_str = base64_str.split(',')[1]  # Remove the base64 prefix
    # Decode the base64 string
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data))
    
    image = image.convert('L')

    # Enhance brightness (1.0 = original)
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.5)
    
    # Save the processed image to a BytesIO object
    temp_image_byte_arr = BytesIO()
    image.save(temp_image_byte_arr, format='JPEG')
    temp_image_byte_arr.seek(0)  # Reset the stream's position to the beginning

    return temp_image_byte_arr


def detect_card_details(test_image_path):
    
    google_credentials_info = read_google_credentials()
    google_vision_client = vision.ImageAnnotatorClient.from_service_account_info(google_credentials_info)
    
    # Process image without saving to disk
    img_byte_arr = decode_base64_image(test_image_path)
    
    # Create an Image object for Vision API from the byte stream
    image = vision.Image(content=img_byte_arr.read())

    # Perform text detection
    response = google_vision_client.document_text_detection(image=image)
    texts = response.text_annotations

    # Check for errors in the response
    if response.error.message:
        raise Exception(f"{response.error.message}")

    # Process the detected text
    details = {}
    
    if texts:
        # The first annotation is the full text detected
        full_text = texts[0].description
        print(f"Detected text: {full_text}")

        # Split the detected text into lines
        lines = full_text.splitlines()
        
        # Initialize variables to hold the desired text
        card_name = None
        card_id = None
        card_edition = False
        test_id_rows_1 = []
        test_id_rows_2 = []
        
        for i in range(len(lines)):
            line = lines[i]
            if '1st Edition' in line:
                card_edition = True
            if 'HP' in line and i > 0:
                card_name = lines[i - 1]

        if not card_name:
            card_name = lines[0]

        for i in range(len(lines)):
            line = lines[i]
            if '-' in line and i > 0:
                test_id_rows_1.append(lines[i])
            if '/' in line and i > 0:
                test_id_rows_2.append(lines[i])

        if any('[' in item for item in lines):
            if test_id_rows_1:
                card_id = test_id_rows_1[-1].strip()
            else:
                card_id = None
        else:
            if test_id_rows_2:
                card_id = test_id_rows_2[-1].split('/')[0].split(' ')[-1]
            else:
                card_id = None

        # Print or store the desired details
        print(f"Card Name: {card_name}")
        print(f"Card ID: {card_id}")

        details['card_name'] = card_name
        details['card_id'] = card_id
        details['edition'] = card_edition

    return {'name': card_name, 'number': card_id, 'edition': card_edition}
