import pandas as pd
import requests
from bs4 import BeautifulSoup


def find_hyperlink_text(card_var, id_var, card_type, variant, soup):
    card_var = card_var.replace(' ', '-')  # Normalize card name
    print(f'Searching for: {card_var} with ID: {id_var}')

    # Construct potential search texts based on conditions
    search_texts = []
    if id_var == '':
        print(card_type, type(card_type), flush=True)
        if card_type in ['', None]:
            search_texts.append(f'{card_var}')
        else:
            search_texts.append(f'{card_var}-{card_type}')
    else:
        search_texts.append(f'{card_var}-{card_type}-{id_var}')
        search_texts.append(f'{card_var}-{id_var}')
    if variant:
        result = grab_all_links(card_var, id_var, card_type, soup)
        if not result.empty:
            return result
    else:
        for search_text in search_texts:
            result = find_link(search_text, soup)
            if result:
                return result

    print('No matching link text found')
    return None


def find_link(search_text, soup):
    links = soup.find_all('a')
    for link in links:
        href = link.get('href')  # Use get to avoid KeyError
        if href and search_text in href.split('/')[-1]:
            print(f'Found link text: {link.get_text()}')
            return href
    return None


def grab_all_links(card_var, id_var, card_type, soup):
    links = soup.find_all('a')
    data = []  # List to hold dictionary entries
    card_var_text = card_var.replace('-', ' ')

    for link in links:
        href = link.get('href')
        text = link.get_text(strip=True).lower()
        if text == '' or not href or 'game' not in href: 
            continue
        if id_var == '':
            if '/magic-' not in href:
                continue
            if card_type == '' or not card_type:
                if card_var in href.split('/')[-1]:
                    bracket_text = text.replace(card_var_text, '').strip()
                    data.append({'names': bracket_text, 'links': href})  # Append to list
            else:
                if card_var in href.split('/')[-1] and card_type in href.split('/')[-1].split('-')[-1]:
                    bracket_text = text.replace(card_var_text, '').strip()
                    data.append({'names': bracket_text, 'links': href})  # Append to list
        else:
            if card_var in href.split('/')[-1].split('-') and id_var in href.split('/')[-1]:
                if card_var in text and id_var in text:
                    bracket_text = text.replace(card_var_text, '').replace(f'#{id_var}', '').strip()
                    data.append({'names': bracket_text, 'links': href})  # Append to list
    # Convert list of dictionaries to DataFrame if data is not empty
    return pd.DataFrame(data) if data else None



# Function to extract table data and convert it to a dictionary
def extract_table_to_dict(final_link, card, card_id, card_count, variant_type, source_image):
    # Define standard labels
    standard_labels = [
        'card', 'id', 'source_image', 'Ungraded', 'variant_type', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
        'BGS 10 Black', 'CGC 10 Pristine', 'final_link', 'card_count', 'img_link'
    ]
    
    try:
        response = requests.get(final_link)
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find(id='full-prices')
        rows = table.find_all('tr') if table else []

        table_data = {label: 'N/A' for label in standard_labels}

        # Extract data from rows
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                label, value = cells[0].get_text(strip=True), cells[1].get_text(strip=True)
                if label in table_data:
                    table_data[label] = value

        # Get the img_link from the img src property
        img_element = soup.find_all('img', {'itemprop': 'image'})[0]
        img_link = img_element['src'] if img_element else 'N/A'
        table_data['img_link'] = img_link

        # Set the final link, card, number, and card count
        table_data['final_link'] = final_link
        table_data['card'] = card
        table_data['id'] = card_id
        table_data['card_count'] = card_count
        table_data['variant_type'] = variant_type
        table_data['source_image'] = source_image
        return table_data
    except Exception as e:
        print(f"Failed to extract table, setting all prices to 'N/A'. Error: {e}")
        return {label: 'N/A' for label in standard_labels}

# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Capitalize each word in the "card" column
    source_df[['card', 'id']] = source_df[['card', 'id']].apply(lambda x: x.str.strip().str.lower())

    # Create a list to hold new rows
    new_rows = []

    for i in range(len(source_df)):
        card = source_df.iloc[i, 0]
        card_id = source_df.iloc[i, 1]
        base_url = f'https://www.pricecharting.com/search-products?q={card}+{card_id}&type=prices'
        
        response = requests.get(base_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        foil = source_df.iloc[i, 2]
        reverse_holo = source_df.iloc[i, 3]
        first_edition = source_df.iloc[i, 4]
        card_count = source_df.iloc[i, 5]
        variant = source_df.iloc[i, 6]
        variant_type = source_df.iloc[i, 7]
        source_image = source_df.iloc[i, 8]
        
        card_type = ''
        card_types = {'foil': foil, 'reverse-holo': reverse_holo, '1st-edition': first_edition, 'variant': variant}
        
        for type_value in card_types.keys():
            if (card_id == '' or not card_id) and type_value == 'holo' and card_types[type_value]:
                card_type = 'foil'
            elif type_value == 'variant' and variant_type in ['', None]:
                card_type = variant_type
            else:
                if card_types[type_value]:
                    card_type = type_value

            if card_id and type_value == 'foil' and card_types[type_value]:
                card_type = 'holo'
            elif type_value == 'variant' and variant_type in ['', None]:
                card_type = variant_type
            else:
                if card_types[type_value]:
                    card_type = type_value
        
        if 'game' in response.url:
            final_link = response.url
            df_new_rows = extract_table_to_dict(final_link, card, card_id, card_count, card_type, source_image)
            new_rows.append(df_new_rows)
        else:
            if variant:
                matching_links = find_hyperlink_text(card, card_id, card_type, variant, soup)
                if not matching_links.empty:
                    for index, row in matching_links.iterrows():
                        final_link = row['links']
                        card_type = row['names']
                        df_new_rows = extract_table_to_dict(final_link, card, card_id, card_count, card_type, source_image)
                        new_rows.append(df_new_rows)
                else:
                    final_link = 'N/A'
                    df_new_rows = {label: 'N/A' for label in [
                        'card', 'id', 'source_image', 'card_count', 'variant_type', 'Ungraded',
                        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                        'BGS 10 Black', 'CGC 10 Pristine', 'final_link', 'img_link']}
                    df_new_rows['card'] = card
                    df_new_rows['id'] = card_id
                    df_new_rows['card_count'] = card_count
                    df_new_rows['variant_type'] = variant_type
                    df_new_rows['source_image'] = source_image
                    new_rows.append(df_new_rows)
            else:
                matching_link = find_hyperlink_text(card, card_id, card_type, variant, soup)
                if matching_link:
                    final_link = matching_link
                    df_new_rows = extract_table_to_dict(final_link, card, card_id, card_count, card_type, source_image)
                else:
                    final_link = 'N/A'
                    df_new_rows = {label: 'N/A' for label in [
                        'card', 'id', 'source_image', 'card_count', 'variant_type', 'Ungraded',
                        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                        'BGS 10 Black', 'CGC 10 Pristine', 'final_link', 'img_link']}
                    df_new_rows['card'] = card
                    df_new_rows['id'] = card_id
                    df_new_rows['card_count'] = card_count
                    df_new_rows['variant_type'] = variant_type
                    df_new_rows['source_image'] = source_image
        if not variant:
            new_rows.append(df_new_rows)

    # Create a DataFrame from the collected new rows
    df_new_rows = pd.DataFrame(new_rows)

    return df_new_rows
