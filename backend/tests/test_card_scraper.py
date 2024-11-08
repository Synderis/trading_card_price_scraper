from __future__ import annotations

import typing
import pathlib

import pandas as pd

import card_scraper

if typing.TYPE_CHECKING:
    import requests_mock.mocker

def test_card_finder(requests_mock: requests_mock.mocker.Mocker) -> None:
    df = pd.DataFrame(columns=['card', 'id', 'foil', 'reverse_holo', 'first_edition', 'card_count', 'variant',
            'variant_type', 'source_image'],
            data=[['black lotus', '', False, False, False, 1, False, None, None]])

    tests_dir = pathlib.Path(__file__).parent
    with (tests_dir / 'black_lotus_search.html').open('rb') as f:
        requests_mock.get('https://www.pricecharting.com/search-products?q=black+lotus+&type=prices',
                content=f.read())
    with (tests_dir / 'black_lotus_magic_alpha.html').open('rb') as f:
        requests_mock.get('https://www.pricecharting.com/game/magic-alpha/black-lotus', content=f.read())

    assert card_scraper.card_finder(df) == [{
        'card': 'black lotus',
        'id': '',
        'source_image': None,
        'Ungraded': '$10,761.28',
        'variant_type': None,
        'Grade 1': '-',
        'Grade 2': '$165.00',
        'Grade 3': '$183.00',
        'Grade 4': '$215.00',
        'Grade 5': '$253.00',
        'Grade 6': '$316.00',
        'Grade 7': '$56,000.00',
        'Grade 8': '$70,000.00',
        'Grade 9': '$167,781.37',
        'Grade 9.5': '$184,560.00',
        'SGC 10': '-',
        'CGC 10': '-',
        'PSA 10': '-',
        'BGS 10': '$854.61',
        'BGS 10 Black': '$1,538.00',
        'CGC 10 Pristine': '-',
        'final_link': 'https://www.pricecharting.com/game/magic-alpha/black-lotus',
        'card_count': 1,
        'img_link': 'https://commondatastorage.googleapis.com/images.pricecharting.com/38b84ac4d2f774578e261b1a49980b6e2ea289de22ff7b804ae9d7d24888a410/240.jpg',
    }]
