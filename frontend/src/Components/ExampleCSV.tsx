import React from 'react';
import '../CSS Sheets/ExampleCSV.css';

const ExampleCSV: React.FC = () => {

    const cardData = [
        { card_name: "Pikachu", card_id: 58, foil: "", reverse_holo: "", first_edition: "", card_count: 1, variant: 3, variant_type: "", link: "https://www.pricecharting.com/game/pokemon-base-set/pikachu-1st-edition-58" },
        { card_name: "Venusaur", card_id: 28, foil: "1", reverse_holo: "", first_edition: "", card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/pokemon-crystal-guardians/venusaur-holo-28" },
        { card_name: "Gengar", card_id: 94, foil: "", reverse_holo: "1", first_edition: "", card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/pokemon-scarlet-&-violet-151/gengar-reverse-holo-94" },
        { card_name: "Charizard", card_id: 4, foil: "", reverse_holo: "", first_edition: "", card_count: 1, variant: 1, variant_type: "shadowless", link: "https://www.pricecharting.com/game/pokemon-base-set/charizard-shadowless-4" },
        { card_name: "Blue-Eyes White Dragon", card_id: 'LOB-001', foil: "", reverse_holo: "", first_edition: 1, card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/yugioh-legend-of-blue-eyes-white-dragon/blue-eyes-white-dragon-1st-edition-lob-001" },
    ];

    const headers = Object.keys(cardData[0]).filter(key => key !== 'link');;

    return (
        <div className="csv-guide-content">
                <h2>CSV Format Guide</h2>
                <div className="example-block">
                    <h3>CSV Format Examples</h3>
                    <h4>Basic Format</h4>
                    <div className="how-to-table">
                        <table>
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cardData.map((card, index) => (
                                    <tr key={index}>
                                        {headers.map((header, idx) => (
                                            <td key={idx}>{card[header as keyof typeof cardData[0]]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        Example links for each card:
                    </div>
                    <ul>
                        {cardData.map((card, index) => (
                        <li key={index} style={{ marginLeft: "10px" }}>
                            <a href={card.link}>{card.card_name}</a>
                        </li>
                        ))}
                    </ul>
                </div>
                <div className="example-block">
                    <h4>Valid/Invalid Inputs for Each Field</h4>
                    <label className='input-label'>card_name: 
                        <li className='valid-inputs'>Pikachu, pickachu, PiKaChU, Gengar VMAX, Charizard EX... etc (not case sensitive)</li>
                        <li className='invalid-inputs'>empty/blank inputs</li>
                    </label>
                    <label className='input-label'>card_id: 
                        <li className='valid-inputs'>56, H12, gb-001, gB-001... etc (not case sensitive)</li>
                        <li className='invalid-inputs'>empty/blank inputs if not searching for Magic the Gathering Cards</li>
                    </label>
                    <label className='input-label'>foil: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>reverse_holo: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>first_edition: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>card_count: 
                        <li className='valid-inputs'>numbers greater than 0</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers less than 0, special characters</li>
                    </label>
                    <label className='input-label'>variant: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>variant_type: 
                        <li className='valid-inputs'>basically anything this is essentially a wildcard field expected to be something like shadowless etc</li>
                    </label>
                </div>
            </div>
    );
};

export default ExampleCSV;