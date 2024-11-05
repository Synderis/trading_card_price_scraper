import torch
import torch.nn as nn
import cv2
import numpy as np

# Define the same model structure as used during training
def reverse_holo_test(test_image_path):
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
                nn.MaxPool2d(kernel_size=2, stride=2)
            )
            self.fc_layers = nn.Sequential(
                nn.Flatten(),
                nn.Linear(128 * 16 * 16, 128),
                nn.ReLU(),
                nn.Linear(128, 2)  # Binary classification: reverse holo or not reverse holo
            )

        def forward(self, x):
            x = self.conv_layers(x)
            x = self.fc_layers(x)
            return x

    # Load the trained model
    model = CNNModel()
    model.load_state_dict(torch.load('pokemon_card_classifier.pth'))
    model.eval()

    # Function to preprocess and test a single image
    def test_single_image(image_path):
        # Load the image using OpenCV
        img = cv2.imread(image_path)
        if img is None:
            print("Error: Image not found.")
            return
        # Resize and normalize the image
        img = cv2.resize(img, (128, 128))
        img = np.array(img, dtype=np.float32) / 255.0  # Normalize to [0, 1]
        img = img.transpose(2, 0, 1)  # Convert to channels-first format for PyTorch
        img_tensor = torch.tensor(img, dtype=torch.float32).unsqueeze(0)  # Add batch dimension

        # Pass the image through the model
        with torch.no_grad():
            output = model(img_tensor)
            _, predicted = torch.max(output, 1)
        
        # Interpret the output
        class_labels = ['reverse_holo', 'not_reverse_holo']
        prediction = class_labels[predicted.item()]
        print(f"Prediction: {prediction}")

        return prediction

    # Test the model with a single card image
    # test_image_path = r"C:\Users\Dylan\Downloads\drowzee_rh_test.jpg"
    prediction_output = test_single_image(test_image_path)
    return prediction_output
