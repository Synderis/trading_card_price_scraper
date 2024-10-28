import React from 'react';
import '../CSS Sheets/HowTo.css';

const HowTo: React.FC = () => {
    const cardData = [
        { card_name: "Pikachu", card_id: 58, holo: "", reverse_holo: "", first_edition: "", card_count: 1, variant: 3, variant_type: "", link: "https://www.pricecharting.com/game/pokemon-base-set/pikachu-1st-edition-58" },
        { card_name: "Venusaur", card_id: 28, holo: "1", reverse_holo: "", first_edition: "", card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/pokemon-crystal-guardians/venusaur-holo-28" },
        { card_name: "Gengar", card_id: 94, holo: "", reverse_holo: "1", first_edition: "", card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/pokemon-scarlet-&-violet-151/gengar-reverse-holo-94" },
        { card_name: "Charizard", card_id: 4, holo: "", reverse_holo: "", first_edition: "", card_count: 1, variant: 1, variant_type: "shadowless", link: "https://www.pricecharting.com/game/pokemon-base-set/charizard-shadowless-4" },
        { card_name: "Blue-Eyes White Dragon", card_id: 'LOB-001', holo: "", reverse_holo: "", first_edition: 1, card_count: 1, variant: "", variant_type: "", link: "https://www.pricecharting.com/game/yugioh-legend-of-blue-eyes-white-dragon/blue-eyes-white-dragon-1st-edition-lob-001" },
    ];

    const headers = Object.keys(cardData[0]).filter(key => key !== 'link');;

    
    return (
        <div className="how-to-container">
            <div className="csv-guide-content">
                <h2>CSV Format Guide</h2>
                
                <h3>CSV Format Examples</h3>
                <div className="example-block">
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
                        <li key={index}>
                            <a href={card.link}>{card.card_name}</a>
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="example-block">
                    <h4>Valid/Invalid Inputs for Each Field</h4>
                    <label className='input-label'>card_name: 
                        <div className='valid-inputs'>Pikachu, pickachu, PiKaChU, Gengar VMAX, Charizard EX... etc (not case sensitive)</div>
                        <div className='invalid-inputs'>empty/blank inputs</div>
                    </label>
                    <label className='input-label'>card_id: 
                        <div className='valid-inputs'>56, H12, gb-001, gB-001... etc (not case sensitive)</div>
                        <div className='invalid-inputs'>empty/blank inputs if not searching for Magic the Gathering Cards</div>
                    </label>
                    <label className='input-label'>holo: 
                        <div className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE, false, 0, n, N, f, F, False, FALSE, empty/blank(assumed to be false)</div>
                        <div className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</div>
                    </label>
                    <label className='input-label'>reverse_holo: 
                        <div className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE, false, 0, n, N, f, F, False, FALSE, empty/blank(assumed to be false)</div>
                        <div className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</div>
                    </label>
                    <label className='input-label'>first_edition: 
                        <div className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE, false, 0, n, N, f, F, False, FALSE, empty/blank(assumed to be false)</div>
                        <div className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</div>
                    </label>
                    <label className='input-label'>card_count: 
                        <div className='valid-inputs'>numbers greater than 0, empty/blank(assumed to be false)</div>
                        <div className='invalid-inputs'>letters, numbers less than 0, special characters</div>
                    </label>
                    <label className='input-label'>variant: 
                        <div className='valid-inputs'>true, 1, y, Y, t, T, True, TRUE, false, 0, n, N, f, F, False, FALSE, empty/blank(assumed to be false)</div>
                        <div className='invalid-inputs'>letters, numbers that arent 0 or 1, special characters</div>
                    </label>
                    <label className='input-label'>variant_type: 
                        <div className='valid-inputs'>basically anything this is essentially a wildcard field expected to be something like shadowless etc</div>
                    </label>
                </div>

                <h2>Card Variations</h2>
                <div className="variations-section">
                    <h4>Basic Card Types</h4>
                    <ul>
                        <li>holo - Traditional holofoil pattern on the artwork (Magic the Gathering cards will have this on both artwork and card body and are typically called foil instead of holo/holographic)</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/holo-vaporeon.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/holo-blue-eyes-white-dragon.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/foil-last-minute-chopping.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>reverse_holo - Foil pattern on card body, not artwork the patterns and designs have changed over time but foil on the card body and not the artwork is consistent</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/reverse-holo-old-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/reverse-holo-new-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/reverse-holo-newest-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>first_edition - Typically has either a stamp or special text somewhere on the card (pokemon had two designs based on english and japanese cards, pokemon stopped doing first editions after 2003?)</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/first-edition-pokemon-card-stamps.png" alt="Holo Card Example" style={{ width: '700px', height: 'auto' }} />
                            <img src="/HowToImages/first-edition-yugioh.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                    </ul>

                    <h4>Uncommon/Rare Card Types</h4>
                    <ul>
                        <li>shadowless - For these there is no shadow present on the right side of the card artwork frame it is only present in older cards afaik.</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/charizard-shadowless-comparison.jpg" alt="Holo Card Example" style={{ width: '600px', height: 'auto' }} />
                        </div>
                        <li>full art - Sometimes these are tagged as full art but most often they are not</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/full-art-rayquaza-v.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/full-art-rayquaza-vmax.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/full-art-snow-covered-swamp.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>full art foil - Magic the Gathering cards is the only brand that makes the distinction between full art and full art foil</li>
                        <div className='example-image-box'>
                            <img src="/HowToImages/full-art-foil-snow-covered-swamp.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                    </ul>

                    <h2>Card Grades</h2>
                    <div>Card grading is heavily subjective in general and can depend on where/when you get it graded and what card you're having graded. I'll give some examples of each grade from a post by pfm but, take them with a grain of salt.</div>
                    <a href="https://www.elitefourum.com/t/psa-grading-scale-in-pokemon/38612" target="_blank" rel="noopener noreferrer">Original Post</a>
                    <ul>
                        <li>Grade 1</li>
                        <div className='grade-description'>A PSA Poor 1 will exhibit many of the same qualities of a PSA Fair 1.5 but the defects may have advanced to such a serious stage that the eye appeal of the card has nearly vanished in its entirety. A Poor card may be missing one or two small pieces, exhibit major creasing that nearly breaks through all the layers of cardboard or it may contain extreme discoloration or dirtiness throughout that may make it difficult to identify the issue or content of the card on either the front or back. A card of this nature may also show noticeable warping or another type of destructive defect.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-1-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-1-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 2</li>
                        <div className='grade-description'>A PSA Good 2 card’s corners show accelerated rounding and surface wear is starting to become obvious. A good card may have scratching, scuffing, light staining, or chipping of enamel on obverse. There may be several creases. Original gloss may be completely absent. Card may show considerable discoloration. Centering must be 90/10 or better on the front and back.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-2-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-2-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 3</li>
                        <div className='grade-description'>A PSA VG 3 card reveals some rounding of the corners, though not extreme. Some surface wear will be apparent, along with possible light scuffing or light scratches. Focus may be somewhat off-register and edges may exhibit noticeable wear. Much, but not all, of the card’s original gloss will be lost. Borders may be somewhat yellowed and/or discolored. A crease may be visible. Printing defects are possible. Slight stain may show on obverse and wax staining on reverse may be more prominent. Centering must be 90/10 or better on the front and back.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-3-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-3-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 4</li>
                        <div className='grade-description'>A PSA VG-EX 4 card’s corners may be slightly rounded. Surface wear is noticeable but modest. The card may have light scuffing or light scratches. Some original gloss will be retained. Borders may be slightly off-white. A light crease may be visible. Centering must be 85/15 or better on the front and 90/10 or better on the back.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-4-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-4-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 5</li>
                        <div className='grade-description'>On PSA EX 5 cards, very minor rounding of the corners is becoming evident. Surface wear or printing defects are more visible. There may be minor chipping on edges. Loss of original gloss will be more apparent. Focus of picture may be slightly out-of-register. Several light scratches may be visible upon close inspection, but do not detract from the appeal of the card. Card may show some off-whiteness of borders. Centering must be 85/15 or better on the front and 90/10 or better on the back.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-5-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-5-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 6</li>
                        <div className='grade-description'>A PSA EX-MT 6 card may have visible surface wear or a printing defect which does not detract from its overall appeal. A very light scratch may be detected only upon close inspection. Corners may have slightly graduated fraying. Picture focus may be slightly out-of-register. Card may show some loss of original gloss, may have minor wax stain on reverse, may exhibit very slight notching on edges and may also show some off-whiteness on borders. Centering must be 80/20 or better on the front and 90/10 or better on the reverse.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-6-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-6-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 7</li>
                        <div className='grade-description'>A PSA NM 7 is a card with just a slight surface wear visible upon close inspection. There may be slight fraying on some corners. Picture focus may be slightly out-of-register. A minor printing blemish is acceptable. Slight wax staining is acceptable on the back of the card only. Most of the original gloss is retained. Centering must be approximately 70/30 to 75/25 or better on the front and 90/10 or better on the back.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-7-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-7-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 8</li>
                        <div className='grade-description'>A PSA NM-MT 8 is a super high-end card that appears Mint 9 at first glance, but upon closer inspection, the card can exhibit the following: a very slight wax stain on reverse, slightest fraying at one or two corners, a minor printing imperfection, and/or slightly off-white borders. Centering must be approximately 65/35 to 70/30 or better on the front and 90/10 or better on the reverse.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-8-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-8-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 9</li>
                        <div className='grade-description'>A PSA Mint 9 is a superb condition card that exhibits only one of the following minor flaws: a very slight wax stain on reverse, a minor printing imperfection or slightly off-white borders. Centering must be approximately 60/40 to 65/35 or better on the front and 90/10 or better on the reverse.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-9-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-9-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                        <li>Grade 10</li>
                        <div className='grade-description'>A PSA Gem Mint 10 card is a virtually perfect card. Attributes include four perfectly sharp corners, sharp focus and full original gloss. A PSA Gem Mint 10 card must be free of staining of any kind, but an allowance may be made for a slight printing imperfection, if it doesn’t impair the overall appeal of the card. The image must be centered on the card within a tolerance not to exceed approximately 55/45 to 60/40 percent on the front, and 75/25 percent on the reverse.</div>
                        <div className='example-image-box'>
                            <img src="/HowToImages/psa-10-charizard-holo-4-a.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                            <img src="/HowToImages/psa-10-charizard-holo-4-b.jpeg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HowTo;