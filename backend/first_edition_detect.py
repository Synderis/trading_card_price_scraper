import cv2
import numpy as np


def process_images_and_match(img_data):
    image = np.array(img_data)

    template = cv2.imread(r'assets/first_edition_logo_fire.png')  # Symbol to match

    # Define target dimensions for source image
    image_width = 322
    image_height = 450

    # Resize the larger image to match the symbol's size (26x20)
    resized_image = cv2.resize(image, (image_width, image_height), interpolation=cv2.INTER_CUBIC)

    roi = resized_image[220:280, 0:70]

    # Convert ROI and template to grayscale
    roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    # Apply template matching to the ROI
    result = cv2.matchTemplate(roi_gray, template_gray, cv2.TM_CCOEFF_NORMED)

    # Set a threshold for a match (e.g., 0.8 means 80% similarity)
    threshold = 0.8
    locations = np.where(result >= threshold)

    # Return True if a match is found, False otherwise
    if len(locations[0]) > 0:
        print('First Edition symbol detected', flush=True)
        return True
    else:
        print('First Edition NOT symbol detected', flush=True)
        return False
