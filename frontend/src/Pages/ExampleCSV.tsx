import React, { useState } from 'react';
import '../CSS Sheets/ExampleCSV.css';

const ExampleCSV: React.FC = () => {
    // card_name,card_id,card_count,variant,variant_type,reverse_holo,first_edition,foil,surgefoil,etched,extended_art,full_art
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const cardData = [
        { card_name: "Pikachu", card_id: 58, card_count: 3, variant_type: "", reverse_holo: "", first_edition: "", foil: "", surgefoil: "", etched: "", extended_art: "", full_art: "", link: "https://www.pricecharting.com/game/pokemon-base-set/pikachu-1st-edition-58", img: "/HowToImages/pikachu_howto.jpg" },
        { card_name: "Gengar", card_id: 94, card_count: 1, variant_type: "", reverse_holo: 1, first_edition: "", foil: "", surgefoil: "", etched: "", extended_art: "", full_art: "", link: "https://www.pricecharting.com/game/pokemon-scarlet-&-violet-151/gengar-reverse-holo-94", img: "/HowToImages/gengar_howto.jpg" },
        { card_name: "Charizard", card_id: 4, card_count: 1, variant_type: "shadowless", reverse_holo: "", first_edition: "", foil: "", surgefoil: "", etched: "", extended_art: "", full_art: "", link: "https://www.pricecharting.com/game/pokemon-base-set/charizard-shadowless-4", img: "/HowToImages/charizard_howto.jpg" },
        { card_name: "Blue-Eyes White Dragon", card_count: 1, card_id: 'LOB-001', variant_type: "", reverse_holo: "", first_edition: 1, foil: "", surgefoil: "", etched: "", extended_art: "", full_art: "", link: "https://www.pricecharting.com/game/yugioh-legend-of-blue-eyes-white-dragon/blue-eyes-white-dragon-1st-edition-lob-001", img: "/HowToImages/blue-eyes-white-dragon_howto.jpg" },
        { card_name: "Alien Rhino", card_id: '35', card_count: 1, variant_type: "", reverse_holo: "", first_edition: "", foil: "", surgefoil: 1, etched: "", extended_art: "", full_art: 1, link: "https://scryfall.com/card/twho/35/alien-rhino", img: "/HowToImages/alien-rhino_howto.jpg" },
    ];

    const headers = Object.keys(cardData[0]).filter(key => key !== 'link'&& key !== 'img');

    const handleMouseEnter = (index: number, event: React.MouseEvent) => {
        setHoveredIndex(index); 
        setMousePosition({ x: event.clientX, y: event.clientY }); 
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null); 
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    return (
        <div className="csv-guide-content">
            <h2>CSV Format Guide</h2>
            <p style={{ fontStyle: "italic"}}>It's important to note that Magic cards should be separate from other types although the input structure will be mostly the same for both</p>
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
                                <td
                                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                >
                                    <a className='img-hover-link' style={{ textDecoration: 'none', color: '#8ab4f8' }} href={card.img} target="_blank" rel="noopener noreferrer">
                                        {card.card_name}
                                    </a>
                                    <img className="card-image" src={card.img} alt={card.card_name} style={{ display: 'none' }} />
                                </td>
                                {headers.slice(1).map((header, idx) => (
                                    <td key={idx}>{card[header as keyof typeof cardData[0]]}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                
                {hoveredIndex !== null && (
                    <div
                        style={{
                            position: 'fixed',
                            top: mousePosition.y - 200,  // Adjust the offset as needed
                            left: mousePosition.x + 10,  // Adjust the offset as needed
                            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            zIndex: 1000,
                        }}
                    >
                        <img
                            className="hover-image"
                            src={cardData[hoveredIndex].img}
                            alt="Card"
                            style={{
                                width: '200px',
                                border: '1px solid #ccc',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                padding: '5px',
                                borderRadius: '15px',
                            }}
                        />
                    </div>
                )}

                <div style={{ marginTop: "10px" }}>Example links for each card:</div>
                <ul>
                    {cardData.map((card, index) => (
                        <li key={index} style={{ marginLeft: "10px" }}>
                            <a href={card.link}>{card.card_name}</a>
                        </li>
                    ))}
                </ul>
            </div>
                <div className="example-block">
                    <h3>General Inputs</h3>
                    <h4>Valid/Invalid Inputs for Each Field</h4>
                    <label className='input-label'>card_name: 
                        <li className='valid-inputs'>Pikachu, pickachu, PiKaChU, Gengar VMAX, Charizard EX... etc (not case sensitive)</li>
                        <li className='invalid-inputs'>empty/blank inputs</li>
                    </label>
                    <label className='input-label'>card_id: 
                        <li className='valid-inputs'>56, H12, gb-001, gB-001... etc (not case sensitive)</li>
                        <li className='invalid-inputs'>empty/blank inputs if not searching for Magic the Gathering Cards</li>
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
                    <label className='input-label'>variant_type: 
                        <li className='valid-inputs'>basically anything this is essentially a wildcard field expected to be something like shadowless etc</li>
                    </label>
                </div>
                <div className="example-block">
                    <h3>Magic Only Inputs</h3>
                    <h4>Valid/Invalid Inputs for Each Field</h4>
                    <label className='input-label'>foil: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>surgefoil: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>etched: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>extended_art: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                    <label className='input-label'>full_art: 
                        <li className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE</li>
                        <li className='valid-inputs'>false, 0, n, N, f, F, False, FALSE</li>
                        <li className='valid-inputs'>empty/blank(assumed to be false)</li>
                        <li className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</li>
                    </label>
                </div>
            </div>
    );
};

export default ExampleCSV;