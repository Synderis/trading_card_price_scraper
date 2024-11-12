import base64
import torch
import numpy as np
import cv2
from torch import nn

# Define the CNN model structure
class CNNModel(nn.Module):
    def __init__(self):
        super(CNNModel, self).__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 16 * 16, 128),
            nn.ReLU(),
            nn.Linear(128, 2),  # Binary classification: reverse holo or not reverse holo
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x

# Load the model and its weights
model = CNNModel()
model.load_state_dict(torch.load('trained_ml_models/pokemon_card_classifier.pth', map_location=torch.device('cpu'), weights_only=True))
model.eval()

def remove_background(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply a binary threshold to separate the background
    _, binary_mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Invert the mask to have the card as the foreground
    binary_mask = cv2.bitwise_not(binary_mask)
    
    # Use the mask to isolate the card
    foreground = cv2.bitwise_and(image, image, mask=binary_mask)
    return foreground


# Preprocess function for the base64 input image with brightness adjustment
def preprocess_image(base64_img_str):
    img_data = base64.b64decode(base64_img_str)
    np_arr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Remove background
    # image = remove_background(image)
    
    # Resize, adjust brightness, and normalize
    brightness_factor = 1.2
    image = cv2.convertScaleAbs(image, alpha=brightness_factor, beta=0)
    image = cv2.resize(image, (128, 128))
    image = image.astype(np.float32) / 255.0
    image = image.transpose(2, 0, 1)
    image_tensor = torch.tensor(image, dtype=torch.float32).unsqueeze(0)
    return image_tensor


# Prediction function
def predict(base64_img_str):
    image_tensor = preprocess_image(base64_img_str)
    with torch.no_grad():
        output = model(image_tensor)
        _, predicted = torch.max(output, 1)

    # Map prediction to label
    label_map = {0: True, 1: False}
    prediction = label_map[predicted.item()]

    return prediction
