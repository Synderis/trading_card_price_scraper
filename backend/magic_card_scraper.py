import pandas as pd
import requests
import re

def smart_title(text):
    # Capitalize the first letter of each word, but ignore capitalization after apostrophes.
    return re.sub(r'\b\w+', lambda match: match.group(0).capitalize(), text)

# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Create a list to hold new rows
    new_rows = []

    for i in range(len(source_df)):
        card = source_df.loc[i, 'card_name']
        card_str = smart_title(card)
        card_str = card_str.replace(' ', '+')
        card_id = source_df.loc[i, 'card_id']
        card_id_str = f'+cn%3A{card_id}' if card_id else ''
        card_count = source_df.loc[i, 'card_count']
        # non_foil = source_df.loc[i, 'non_foil']
        # non_foil_str = f'+is%3Anonfoil' if non_foil else ''
        foil = source_df.loc[i, 'foil']
        foil_str = '+is%3Afoil' if foil else ''
        source_image = source_df.loc[i, 'source_image']
        surgefoil = source_df.loc[i, 'surgefoil']
        surgefoil_str = '+is%3Asurgefoil' if surgefoil else ''
        etched = source_df.loc[i, 'etched']
        etched_str = '+is%3Aetched' if etched else ''
        extended_art = source_df.loc[i, 'extended_art']
        extended_art_str = '+frame%3Aextendedart' if extended_art else ''
        full_art = source_df.loc[i, 'full_art']
        full_art_str = '+is%3Afull+or+frame%3Afullart' if full_art else ''

        # base_url = f'https://api.scryfall.com/cards/search?q={card_str}{card_id_str}{non_foil_str}{foil_str}{surgefoil_str}{etched_str}{extended_art_str}{full_art_str}&unique=prints'
        base_url = f'https://api.scryfall.com/cards/search?q={card_str}{card_id_str}{foil_str}{surgefoil_str}{etched_str}{extended_art_str}{full_art_str}&unique=prints'

        response = requests.get(base_url)
        if response.status_code == 200:
            response_json = response.json()
            card_total = int(response_json['total_cards'])
            for n in range(card_total):
                data_set = response_json['data'][n]
                if not card_id or card_id != data_set['collector_number']:
                    card_id = data_set['collector_number']

                usd = data_set['prices']['usd']
                usd_foil = data_set['prices']['usd_foil']
                usd_etched = data_set['prices']['usd_etched']
                eur = data_set['prices']['eur']
                eur_foil = data_set['prices']['eur_foil']
                tix = data_set['prices']['tix']
                card_response_dict = {'card': card,
                                    'id': card_id,
                                    'set': data_set['set'],
                                    'card_count': card_count,
                                    'source_image': source_image,
                                    'Usd': usd,
                                    'Usd Foil': usd_foil,
                                    'Usd Etched': usd_etched,
                                    'Eur': eur,
                                    'Eur Foil': eur_foil,
                                    'Tix': tix,
                                    'img_link': data_set['image_uris']['png'],
                                    'final_link': data_set['scryfall_uri'],
                                    'historic_price_link': data_set['purchase_uris']['tcgplayer'],
                                    }
                new_rows.append(card_response_dict)
        else:
            df_new_rows = {label: 'N/A' for label in [
                        'card', 'id', 'source_image', 'card_count', 'set', 'Usd', 'Usd Foil', 'Usd Etched', 'Eur',
                        'Eur Foil', 'Tix', 'img_link', 'final_link', 'historic_price_link']}
            new_rows.append(df_new_rows)
    # Create a DataFrame from the collected new rows
    df_new_rows = pd.DataFrame(new_rows)

    return df_new_rows
