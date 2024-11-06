import React from 'react';
import '../CSS Sheets/VariantInfo.css';

const VariantInfo: React.FC = () => {
    return (
        <div className="variations-section">
            <h2>Card Variations</h2>
            <h4 className='variation-header'>Basic Card Types</h4>
            <div className='variation-container'>
                <p>holo - Traditional holofoil pattern on the artwork (Magic the Gathering cards will have this on both artwork and card body and are typically called foil instead of holo/holographic) and pokemon cards will not use this flag in the form as its purely tied to the card name and card id.</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/holo-vaporeon.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/holo-blue-eyes-white-dragon.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/foil-last-minute-chopping.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
            <div className='variation-container'>
                <p>reverse_holo - Foil pattern on card body, not artwork the patterns and designs have changed over time but foil on the card body and not the artwork is consistent</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/reverse-holo-old-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/reverse-holo-new-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/reverse-holo-newest-version-pikachu.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
            <div className='variation-container'>
                <p>first_edition - Typically has either a stamp or special text somewhere on the card (pokemon had two designs based on english and japanese cards, pokemon stopped doing first editions after 2003?)</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/first-edition-pokemon-card-stamps-a.png" alt="Holo Card Example" style={{ width: '350px', height: 'auto' }} />
                    <img src="/HowToImages/first-edition-pokemon-card-stamps-b.png" alt="Holo Card Example" style={{ width: '350px', height: 'auto' }} />
                    <img src="/HowToImages/first-edition-yugioh.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
            <h4 className='variation-header'>Uncommon/Rare Card Types</h4>
            <p className='variation-description'>These can be entered in the variant_type field of the input page after clicking show advanced types.</p>
            <div className='variation-container'>
                <p>shadowless - For these there is no shadow present on the right side of the card artwork frame it is only present in older cards afaik.</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/charizard-shadowless-comparison-a.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/charizard-shadowless-comparison-b.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
            <div className='variation-container'>
                <p>full art - Sometimes these are tagged as full art but most often they are not</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/full-art-rayquaza-v.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/full-art-rayquaza-vmax.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                    <img src="/HowToImages/full-art-snow-covered-swamp.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
            <div className='variation-container'>
                <p>full art foil - Magic the Gathering cards is the only brand that makes the distinction between full art and full art foil</p>
                <div className='example-image-box'>
                    <img src="/HowToImages/full-art-foil-snow-covered-swamp.jpg" alt="Holo Card Example" style={{ width: '300px', height: 'auto' }} />
                </div>
            </div>
        </div>
    );
};

export default VariantInfo;
