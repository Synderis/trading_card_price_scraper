from io import BytesIO
from PIL import Image, ImageEnhance
import base64
from google.cloud import vision
import pillow_heif

# Register the HEIF opener to enable HEIC format support
pillow_heif.register_heif_opener()

# def preprocess_image_in_memory(image_path):
#     """Process the image in memory without saving it."""
#     # Open the image file
#     with Image.open(image_path) as img:
#         # Convert to grayscale
#         img = img.convert('L')  # 'L' mode is for grayscale  # Adjust this value as needed

#         # Save to a BytesIO object in memory
#         img_byte_arr = BytesIO()
#         img.save(img_byte_arr, format='JPEG')
#         img_byte_arr.seek(0)  # Reset the stream's position to the beginning

#     return img_byte_arr

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


def detect_card_details(test_image_path, client):
    
    # Process image without saving to disk
    img_byte_arr = decode_base64_image(test_image_path)
    
    # Create an Image object for Vision API from the byte stream
    image = vision.Image(content=img_byte_arr.read())

    # Perform text detection
    response = client.document_text_detection(image=image)
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
        test_rows = []

        # Iterate through the lines to find the rows you need
        for i in range(len(lines)):
            line = lines[i]
            if 'HP' in line and i > 0:
                card_name = lines[i - 1]  # The row before the one with 'HP'
            if '/' in line:
                test_rows.append(line)

        if test_rows:
            card_id = test_rows[-1].split('/')[0].split(' ')[-1]
        # Print or store the desired details
        print(f"Card Name: {card_name}")
        print(f"Card ID: {card_id}")

        details['card_name'] = card_name
        details['card_id'] = card_id

    return {'name': card_name, 'number': card_id}
