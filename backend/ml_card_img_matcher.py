import cv2
import numpy as np
import pandas as pd
import base64
import requests

def decode_base64_image(base64_str):
    """Decode a base64 image string to a NumPy array."""
    base64_str = base64_str.split(',')[1]
    
    # Decode the base64 string
    image_data = base64.b64decode(base64_str)
    
    # Convert the byte data to a NumPy array
    np_array = np.frombuffer(image_data, np.uint8)
    
    # Decode the image array into an OpenCV format
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    # Check if the image was successfully decoded
    if img is None:
        raise ValueError("Decoded image is None. The base64 string might be invalid.")
    
    # Convert BGR to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    return img

def read_image_rgb(img_path):
    """Read an image in RGB mode."""
    if img_path.startswith('data:'):
        img = decode_base64_image(img_path)
    elif img_path.startswith('http://') or img_path.startswith('https://'):
        # If img_path is a URL, fetch the image
        response = requests.get(img_path)
        if response.status_code == 200:
            # Convert the response content to a NumPy array
            img_array = np.frombuffer(response.content, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError(f"Failed to decode image from URL: ")
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            raise ValueError(f"Failed to fetch image from URL:  (status code: {response.status_code})")
    else:
        # Handle local image paths
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError(f"Failed to read image at path: ")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    return img

def calculate_orb_similarity(source_img, target_img):
    """Calculate similarity using ORB feature matching."""
    orb = cv2.ORB_create()

    # Detect and compute keypoints and descriptors
    keypoints1, descriptors1 = orb.detectAndCompute(source_img, None)
    keypoints2, descriptors2 = orb.detectAndCompute(target_img, None)

    # Check if descriptors are None (if no keypoints were found)
    if descriptors1 is None or descriptors2 is None:
        return 0  # Return 0 matches if no descriptors are found

    # Use a brute-force matcher for descriptor matching
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(descriptors1, descriptors2)

    # Sort matches by distance (lower distance means better match)
    matches = sorted(matches, key=lambda x: x.distance)

    # Return the number of good matches (you can set a threshold if needed)
    return len(matches)

def matching_results(results):
    # Ensure 'source_image' column exists
    if 'source_image' not in results.columns:
        raise ValueError("The results DataFrame must contain a 'source_image' column.")
    
    # Filter out rows with empty source images
    results = results[results['source_image'] != '']
    
    # Group results by 'card_name' and 'card_id'
    # print(results.head(2), flush=True)
    grouped_results = results.groupby(['card', 'id'])

    scores_list = []

    for (card_name, card_id), group in grouped_results:
        # Use the first row in the group to get the source image
        source_image_base64 = group['source_image'].iloc[0]
        
        # Read the source image in RGB mode
        source_image = read_image_rgb(source_image_base64)

        # Resize the source image to a fixed size (optional, for uniformity)
        source_image = cv2.resize(source_image, (224, 224))

        # Compare with each image link in the group and store similarity scores
        for _, row in group.iterrows():
            img_link = row['img_link']
            try:
                target_image = read_image_rgb(img_link)
                
                # Resize target image to match source image size
                target_image = cv2.resize(target_image, (224, 224))
                
                # Calculate the ORB similarity
                score = calculate_orb_similarity(source_image, target_image)
                scores_list.append((card_name, card_id, img_link, score))

            except ValueError as e:
                # Skip known problematic image paths
                if "/images/no-image-available.png" in str(e):
                    print(f"Skipping image due to error: {e}")
                    continue
                else:
                    print(f"Error reading target image from link {img_link}: {e}")

    # Create a DataFrame from the scores list
    scores_df = pd.DataFrame(scores_list, columns=['card', 'id', 'img_link', 'similarity_score'])

    # Group by 'card_name' and 'card_id' again to find the max score
    max_scores = scores_df.groupby(['card', 'id'])['similarity_score'].max().reset_index()
    max_scores.rename(columns={'similarity_score': 'max_similarity_score'}, inplace=True)

    # Merge max scores back to scores_df
    scores_df = scores_df.merge(max_scores, on=['card', 'id'], how='left')

    # Filter scores that are within 30 points of the maximum score
    filtered_scores_df = scores_df[scores_df['similarity_score'] < (scores_df['max_similarity_score'] - 30)]

    # Return the filtered DataFrame with scores
    return filtered_scores_df[['card', 'id', 'img_link', 'similarity_score']]
