import base64
from rembg import remove
from PIL import Image, ImageChops
from io import BytesIO


def encode_image_to_base64(image):
    """Encode a PIL Image object to a base64 string."""
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
    def trim_image(image):
        # Create a binary mask of the image
        bg = Image.new(image.mode, image.size, (255, 255, 255))
        diff = ImageChops.difference(image, bg)
        bbox = diff.getbbox()
        if bbox:
            return image.crop(bbox)
        return image  # Return original if no cropping is needed

    # Trim the image to remove white space around it
    output = trim_image(output)

    # Convert the processed image to a base64 string and return it
    return encode_image_to_base64(output)
    # return output
