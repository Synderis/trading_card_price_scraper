import functools
from io import BytesIO
from PIL import Image, ImageEnhance
import base64
from google.cloud import vision
import pillow_heif
import json
import re

# Register the HEIF opener to enable HEIC format support
pillow_heif.register_heif_opener()

@functools.cache
def read_google_credentials() -> dict:
    with open('google_info.json', 'r') as file:
        google_credentials = json.load(file)
    return google_credentials

# def decode_base64_image(base64_str: str) -> bytes:
# def decode_base64_image(base64_str) -> bytes:
def preprocess_image(image):
    image = image.convert('L')

    # Enhance brightness (1.0 = original)
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.5)
    
    # Save the processed image to a BytesIO object
    temp_image_byte_arr = BytesIO()
    image.save(temp_image_byte_arr, format='JPEG')
    return temp_image_byte_arr.getvalue()


def extract_number_case1(text):
    # Regular expression to match a 3-digit number followed by a letter (e.g., 372 M)
    match = re.search(r'(\d{3})\s([A-Za-z])\s', text)
    
    if match:
        # Extract the 3-digit number and the letter (but we are focusing on the number)
        if f'/{match.group(1)}' in text:
            number = text.split(f'/{match.group(1)}')[0][-3:0]
            # print('stripped number', number)
        else:
            number = match.group(1)
        # print(f"Extracted number: {number}")
        return number
    else:
        # print("No matching number found.")
        return None
    
def extract_number_case2(text):
    match = re.search(r'([A-Za-z])\s(\d{4})', text)
    
    if match:
        # Extract the 4-digit number and the letter (but we are focusing on the number)
        number = match.group(2)
        # print(f"Extracted number: {number}")
        return number
    else:
        # print("No matching number found.")
        return None



# def detect_card_details(test_image_base64: str) -> dict[str, str | bool | None]:
def detect_card_details(test_image_data) -> dict[str, str | bool | None]:
    google_credentials_info = read_google_credentials()
    google_vision_client = vision.ImageAnnotatorClient.from_service_account_info(google_credentials_info)
    
    # Process image without saving to disk
    img_byte_arr = preprocess_image(test_image_data)
    
    # Create an Image object for Vision API from the byte stream
    image = vision.Image(content=img_byte_arr)

    # Perform text detection
    response = google_vision_client.document_text_detection(image=image)
    texts = response.text_annotations

    # Check for errors in the response
    if response.error.message:
        raise Exception(f'{response.error.message}')

    # Process the detected text
    details = {}
    
    if texts:
        # The first annotation is the full text detected
        full_text = texts[0].description
        print(f'Detected text: {full_text}')

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
        elif test_id_rows_2:
                card_id = test_id_rows_2[-1].split('/')[0].split(' ')[-1]
        
        if extract_number_case1(full_text):
            if 'Nintendo' not in full_text:
                print('case 1')
                card_id = extract_number_case1(full_text)
            
        if extract_number_case2(full_text):
            if 'Nintendo' not in full_text:
                print('case 2')
                card_id = extract_number_case2(full_text)
        
        if 'Wizards of the Coast, Inc.' in full_text:
            partial = full_text.split('/')[0]
            card_id = partial.split('Wizards of the Coast, Inc. ')[1].strip()

        # Print or store the desired details
        print(f'Card Name: {card_name}')
        print(f'Card ID: {card_id}')

    return {'name': card_name, 'number': card_id, 'edition': card_edition}
