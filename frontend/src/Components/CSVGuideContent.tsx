import React from 'react';

const CSVGuideContent: React.FC = () => {
    return (
        <div className="csv-guide-content">
            <h2>CSV Format Guide</h2>
            
            <h3>Valid CSV Format Examples</h3>
            <div className="example-block">
                <h4>Basic Format</h4>
                <pre>
                    name,set_name,condition,quantity,price,foil_type
                    Charizard,Base Set,NM,1,299.99,non_foil
                    Pikachu,Jungle,LP,4,5.99,holo
                </pre>
            </div>

            <div className="example-block">
                <h4>Extended Format</h4>
                <pre>
                    name,set_name,condition,quantity,price,foil_type,language,card_number,rarity,edition
                    Charizard,Base Set,NM,1,299.99,holo,English,4/102,Rare Holo,1st Edition
                </pre>
            </div>

            <h3>Card Variations</h3>
            <div className="variations-section">
                <h4>Foil Types</h4>
                <ul>
                    <li>non_foil - Regular card with no foil effects</li>
                    <li>holo - Traditional holofoil pattern on the artwork</li>
                    <li>reverse_holo - Foil pattern on card body, not artwork</li>
                    <li>etched_holo - Special etched foil pattern</li>
                </ul>

                <h4>Condition Values</h4>
                <ul>
                    <li>NM (Near Mint)</li>
                    <li>LP (Lightly Played)</li>
                    <li>MP (Moderately Played)</li>
                    <li>HP (Heavily Played)</li>
                    <li>DMG (Damaged)</li>
                </ul>
            </div>
        </div>
    );
};

export default CSVGuideContent;