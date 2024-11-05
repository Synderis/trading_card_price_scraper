import pandas as pd
# import boto3
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

import card_scraper
import ml_card_img_matcher

# Uvicorn start command for production: uvicorn main:app --reload

app = FastAPI()

# Initialize an S3 client
# s3_client = boto3.client('s3')

# Your S3 bucket name
# BUCKET_NAME = 'source-image-holder'

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RowData(BaseModel):
    card_name: str  # Keep camelCase for compatibility with your React app
    card_id: str    # Keep camelCase for compatibility with your React app
    holo: bool
    reverse_holo: bool
    first_edition: bool
    card_count: int
    variant: bool
    variant_type: Optional[str]
    source_image: Optional[str]

class CardInput(BaseModel):
    cards: List[RowData]

def get_results_from_state(request: Request):
    return request.app.state.results

# @app.get("/")
# async def read_root():
#     return {"message": "Hello, World!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/submit")
async def submit_cards(card_input: CardInput, request: Request):  # Accept card_input and request
    # valid_rows = [row for row in card_input.cards if row.card_name.strip() and row.card_id.strip()]
    valid_rows = [row for row in card_input.cards if row.card_name.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Convert valid rows to a list of dictionaries
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            "card": row.card_name,
            "id": row.card_id,
            "holo": row.holo,
            "reverse_holo": row.reverse_holo,
            "first_edition": row.first_edition,
            "card_count": row.card_count,
            "variant": row.variant,
            "variant_type": row.variant_type,
            "source_image": row.source_image
        }
        data.append(card_data)

    # Create a DataFrame
    df = pd.DataFrame(data)
    df['card_count'] = df['card_count'].astype(str)

    # Call the card finder and store the results in app state
    results = card_scraper.card_finder(df)
    
    if (results['source_image'] != '').any():
        results = results[~results['img_link'].str.contains('no-image-available.png')]
        results_to_remove = ml_card_img_matcher.matching_results(results)
        results = results[~results['img_link'].isin(results_to_remove['img_link'])].reset_index(drop=True)
    request.app.state.results = results  # Store the results in app.state
    
    # Print the DataFrame to the console
    print(f"DataFrame:\n{df}", flush=True)

    return {"message": "Data submitted successfully", "valid_rows": df.to_dict(orient="records")}

@app.get("/results")
async def get_results(request: Request):
    results = get_results_from_state(request)
    # card_totals = get_card_totals_from_state(request)

    # Debugging: Log the results and card_totals
    print("Results from get_results_from_state:", results)  # Check what results contain
    # print("Original card_totals:", card_totals)

    if results is None or len(results) == 0:
        raise HTTPException(status_code=404, detail="No results found")

    # print("Final card_totals to return:", totals_dict)  # Log the final totals to be returned
    print("Final results to return:", results)  # Log the final results to be returned

    return {
        "results": results,
    }
    

