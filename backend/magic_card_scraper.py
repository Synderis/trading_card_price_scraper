import pandas as pd
import requests
import re


def smart_title(text):
    # Capitalize the first letter of each word, but ignore capitalization after apostrophes.
    return re.sub(r"\b\w+", lambda match: match.group(0).capitalize(), text)


# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Create a list to hold new rows
    new_rows = []

    for i in range(len(source_df)):
        card = source_df.iloc[i, 0]
        card_str = smart_title(card)
        card_str = card_str.replace(' ', '+')
        card_id = source_df.iloc[i, 1]
        card_id_str = f'+cn%3A{card_id}' if card_id else ''
        foil = source_df.iloc[i, 2]
        foil_str = f'+is%3A{foil}' if foil else ''
        card_count = source_df.iloc[i, 3]
        variant = source_df.iloc[i, 4]
        variant_type = source_df.iloc[i, 5]
        source_image = source_df.iloc[i, 6]

        base_url = f'https://api.scryfall.com/cards/search?q={card_str}{card_id_str}{foil_str}&unique=prints'
        
        response = requests.get(base_url)
        if response.status_code == 200:
            response_json = response.json()
            response_json = response_json['data'][0]
            print(response_json, flush=True)
            card_response_dict = {'card': card,
                                'id': card_id,
                                'set': response_json['set'],
                                'card_count': card_count,
                                'source_image': source_image,
                                'Usd': response_json['prices']['usd_foil'],
                                # 'Usd': response_json['prices']['usd_foil'] if foil else response_json['prices']['usd'],
                                'img_link': response_json['image_uris']['png'],
                                'final_link': response_json['scryfall_uri'],
                                }
            new_rows.append(card_response_dict)
        else:
            df_new_rows = {label: 'N/A' for label in [
                        'card', 'id', 'source_image', 'card_count', 'set', 'Usd', 'final_link', 'img_link']}
            new_rows.append(df_new_rows)
    # Create a DataFrame from the collected new rows
    df_new_rows = pd.DataFrame(new_rows)

    return df_new_rows
