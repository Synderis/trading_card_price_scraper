import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import card_scraper
import magic_card_scraper
import ml_card_img_matcher
import ocr_ml_reader
import magic_variant_ml
# import reverse_holo_ml

# Uvicorn start command for production: uvicorn main:app --reload

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Replace "*" with specific origins for production
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
class RowData(BaseModel):
    card_name: str 
    card_id: str
    foil: bool
    reverse_holo: bool
    first_edition: bool
    surgefoil: bool
    etched: bool
    extended_art: bool
    full_art: bool
    card_count: int
    variant: bool
    variant_type: str | None
    source_image: str | None

class MagicCard(BaseModel):
    card_name: str
    collector_number: str
    foil: bool
    card_count: int
    variant: bool
    variant_type: str | None
    source_image: str | None

class CardInput(BaseModel):
    cards: list[RowData]
    
class ImgPayload(BaseModel):
    img_str: str

def get_results_from_state(request: Request):
    return request.app.state.results

@app.get('/health')
async def health_check():
    return {'status': 'ok'}

@app.post('/mlmodel')
async def card_ml_reader(card_img: ImgPayload):
    # should return an image to be ran against the ml model
    # need to pass the index too
    img_str = str(card_img.img_str)
    try:
        card_info = ocr_ml_reader.detect_card_details(img_str)
        card_name = card_info.get('name', '')
        card_id = card_info.get('number', '')
        card_edition = card_info.get('edition', False)
        if not isinstance(card_edition, bool):
            card_edition = False
        print(card_name, card_id, card_edition, flush=True)
        return {'card_name': card_name, 'card_id': card_id, 'first_edition': card_edition}
    except Exception as e:
        return {'error': 'Failed to process image', 'details': str(e)}
    
    # holo_status = reverse_holo_ml.reverse_holo_test(card_image)
    # if holo_status is None:
    #     holo_status = 0
    # elif holo_status == 'reverse_holo':
    #     holo_status = 1
    # elif holo_status == 'not_reverse_holo':
    #     holo_status = 0
    # else:
    #     holo_status = 0
    
    # return {"card_name": card_name, "card_id": card_id, "reverse_holo": holo_status}
    
@app.post('/magic-mlmodel')
async def magic_card_ml_reader(card_img: ImgPayload):
    # should return an image to be ran against the ml model
    # need to pass the index too
    img_str = str(card_img.img_str)
    try:
        card_info = ocr_ml_reader.detect_card_details(img_str)
        card_name = card_info.get('name', '')
        card_id = card_info.get('number', '')
        card_variants = magic_variant_ml.predict(img_str).tolist()
        variants_dict = {'foil': card_variants[1],
                    'surgefoil': card_variants[2],
                    'etched': card_variants[3],
                    'extended_art': card_variants[4],
                    'full_art': card_variants[5]}
        for variant in variants_dict:
            if variants_dict[variant] == 1:
                variants_dict[variant] = True
            else:
                variants_dict[variant] = False
        # print(card_name, card_id, card_edition, flush=True)
        return {'card_name': card_name,
                'card_id': card_id,
                'foil': variants_dict['foil'],
                'surgefoil': variants_dict['surgefoil'],
                'etched': variants_dict['etched'],
                'extended_art': variants_dict['extended_art'],
                'full_art': variants_dict['full_art']}
    except Exception as e:
        return {'error': 'Failed to process image', 'details': str(e)}
    

@app.post('/submit')
async def submit_cards(card_input: CardInput, request: Request):  # Accept card_input and request
    valid_rows = [row for row in card_input.cards if row.card_name.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail='No valid rows to submit')

    # Convert valid rows to a list of dictionaries
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            'card_name': row.card_name,
            'card_id': row.card_id,
            'foil': row.foil,
            'reverse_holo': row.reverse_holo,
            'first_edition': row.first_edition,
            'card_count': row.card_count,
            'variant': row.variant,
            'variant_type': row.variant_type,
            'source_image': row.source_image,
        }
        data.append(card_data)

    # Create a DataFrame
    df = pd.DataFrame(data)
    df['card_count'] = df['card_count'].astype(str)

    # Call the card finder and store the results in app state
    results = pd.DataFrame(card_scraper.card_finder(df))
    # print(results.columns, flush=True)
    
    if (results['source_image'] != '').any():
        results = results[~results['img_link'].str.contains('no-image-available.png')]
        results_to_remove = ml_card_img_matcher.matching_results(results)
        if not results_to_remove.empty:
            results = results[~results['img_link'].isin(results_to_remove['img_link'])].reset_index(drop=True)
    del results['source_image']
    request.app.state.results = results  # Store the results in app.state
    
    # Print the DataFrame to the console
    # print(f"DataFrame:\n{df}", flush=True)

    return {'message': 'Data submitted successfully', 'valid_rows': df.to_dict(orient='records')}


@app.post('/magic-submit')
async def submit_magic_cards(card_input: CardInput, request: Request):  # Accept card_input and request
    valid_rows = [row for row in card_input.cards if row.card_name.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail='No valid rows to submit')
    # print(valid_rows, flush=True)
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            'card_name': row.card_name,
            'card_id': row.card_id,
            'foil': row.foil,
            'surgefoil': row.surgefoil,
            'etched': row.etched,
            'extended_art': row.extended_art,
            'full_art': row.full_art,
            'card_count': row.card_count,
            'variant': row.variant,
            'variant_type': row.variant_type,
            'source_image': row.source_image,
        }
        data.append(card_data)
    
    df = pd.DataFrame(data)
    # df.drop(columns=['source_image'], inplace=True)
    
    df['card_count'] = df['card_count'].astype(str)
    
    results = magic_card_scraper.card_finder(df)
    price_cols = [col for col in ['Usd', 'Usd Foil', 'Usd Etched', 'Eur', 'Eur Foil', 'Tix'] if col in results.columns]
    print(results, flush=True)
    print(results.columns, flush=True)
    results[price_cols] = results[price_cols].fillna('0.00').astype(str)
    print(results, flush=True)
    request.app.state.results = results
    
    return {'message': 'Data submitted successfully', 'valid_rows': df.to_dict(orient='records')}


@app.get('/results')
async def get_results(request: Request):
    results = get_results_from_state(request)

    # if not results or len(results) == 0:
    #     raise HTTPException(status_code=404, detail='No results found')

    return {
        'results': results,
    }
    

