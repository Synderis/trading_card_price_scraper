import base64
import torch
import numpy as np
import cv2
from torch import nn
from torchvision import transforms

# Define the CNN model structure to match the one used in training
class CNNModel(nn.Module):
    def __init__(self, num_classes):
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
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 16 * 16, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x

# Load the model and its weights
num_classes = 6  # Adjust based on your dataset labels
model = CNNModel(num_classes=num_classes)
model.load_state_dict(torch.load('trained_ml_models/magic_card_multi_label_classifier.pth', map_location=torch.device('cpu')))
model.eval()

# Preprocessing function for the input image
def preprocess_image(base64_img_str):
    # Decode the base64 string
    base64_img_str = base64_img_str.split(',')[1]
    img_data = base64.b64decode(base64_img_str)
    np_arr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Resize and normalize the image
    image = cv2.resize(image, (128, 128))
    image = image.astype(np.float32) / 255.0  # Normalize to [0, 1]
    image = image.transpose(2, 0, 1)  # Convert to channels-first (C, H, W)
    image_tensor = torch.tensor(image, dtype=torch.float32).unsqueeze(0)  # Add batch dimension
    return image_tensor

# Prediction function
def predict(base64_img_str):
    image_tensor = preprocess_image(base64_img_str)
    with torch.no_grad():
        output = model(image_tensor)
        predictions = torch.sigmoid(output) >= 0.5  # Thresholding at 0.5
        return predictions.numpy().astype(int).flatten()
    
