import base64
from rembg import remove
from PIL import Image, ImageChops
from io import BytesIO


def encode_image_to_base64(image):
    """Encode a PIL Image object to a base64 string."""
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def process_image(img_data):
    """Remove the background from the image and return it as a base64 string."""
    # Decode the base64 image to a PIL Image object
    input_image = Image.open(BytesIO(img_data))

    # Removing the background from the image
    output = remove(input_image)

    # Convert to RGB with white background if it's in RGBA mode
    if output.mode == 'RGBA':
        # Create a white background image
        background = Image.new("RGB", output.size, (255, 255, 255))
        # Paste the output image onto the white background, using alpha as mask
        background.paste(output, mask=output.split()[3])  # 3 is the alpha channel
        output = background
    
    

    # Function to auto-crop the borders
    def trim_image(image, threshold=20):
        # Create a binary mask of the image
        bg = Image.new(image.mode, image.size, (255, 255, 255))
        diff = ImageChops.difference(image, bg)
        bbox = diff.getbbox()
        
        # Only crop if a significant part of the edges differ from the background
        if bbox:
            # Calculate the difference between background and actual content
            diff_data = diff.getdata()
            non_background_pixels = sum(1 for pixel in diff_data if sum(pixel) > threshold)

            # If more than 2% of the pixels are non-background, crop; otherwise, skip cropping
            if non_background_pixels > 0.02 * (image.size[0] * image.size[1]):
                return image.crop(bbox)
        return image  # Return original if no cropping is needed
    
    output = trim_image(output)
    
    def corner_check(image, offset_ratio=0.05, tolerance=50):
        width, height = image.size
        # Calculate the offset as a percentage of the image size
        offset_x = int(width * offset_ratio)
        offset_y = int(height * offset_ratio)
        
        # List of relative corner coordinates
        corners = [
            (offset_x, offset_y),  # top-left
            (width - offset_x - 1, offset_y),  # top-right
            (offset_x, height - offset_y - 1),  # bottom-left
            (width - offset_x - 1, height - offset_y - 1)  # bottom-right
        ]
        print(corners)
        
        # Check each inward corner pixel
        any_white = False
        for x, y in corners:
            pixel = image.getpixel((x, y))
            print(f"Checking pixel at ({x}, {y}) with RGB values: {pixel}")
            if all(abs(channel - 255) <= tolerance for channel in pixel):  # Check if pixel is close to white
                any_white = True
        return any_white
        
    if corner_check(output):
        print('Background removal likely uneccessary using source image', flush=True)
        output = input_image
    else:
        output = trim_image(output)
        print('Background removed successfully', flush=True)

    # Convert the processed image to a base64 string and return it
    return encode_image_to_base64(output)
    # return output
