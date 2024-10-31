import React from 'react';
import '../CSS Sheets/GradeInfo.css';

const GradeInfo: React.FC = () => {
    return (
        <div className='grades-section'>
            <h2>Card Grading Services</h2>
            <div className='grade-info-row'>
                <div className='grade-info-container'>
                    <h2>PSA</h2>
                    <p className='grader-description'>PSA is known for being more critical of hollow surfaces, dents, and print lines, especially for vintage cards. A PSA Gem Mint 10 card is considered virtually perfect, with sharp corners, focus, and gloss, and no staining. However, a slight printing imperfection may be allowed if it doesn't affect the card's overall appeal. They offer half point grades up to 9</p>
                    <div className='example-image-box'>
                        <img src="/HowToImages/psa-8-pikachu.jpg" alt="PSA Graded Card" style={{ width: '225px', height: 'auto' }} />
                        <img src="/HowToImages/psa-8-pikachu-holo.jpg" alt="PSA Graded Card" style={{ width: '225px', height: 'auto' }} />
                    </div>
                    <p className='grader-description'>Note: PSA grades the most cards and their card grading is generally most respected. (purely due to the fact that it's the most popular and longest running card grading service starting in 1991) Overall their grades are less accurate and more subjective than its competitors. </p>
                </div>
                <div className='grade-info-container'>
                    <h2>BGS</h2>
                    <p className='grader-description'>BGS is known for being more strict on the grades they give and is usually reserved for very high end cards in perfect condition since getting a BGS 10 generally means the card is in better condition. They are a well respected grading company and have been grading since 2001. They also offer subgrades and half point grades up to 9.5.</p>
                    <div className='example-image-box'>
                        <img src="/HowToImages/bgs-charizard-vstar.jpg" alt="BGS Graded Card" style={{ width: '225px', height: 'auto' }} />
                        <img src="/HowToImages/bgs-charizard-pristine.jpg" alt="BGS Graded Card" style={{ width: '225px', height: 'auto' }} />
                    </div>
                </div>
                <div className='grade-info-container'>
                    <h2>CGC</h2>
                    <p className='grader-description'>CGC is known for being more critical of edges. CGC previously had a pristine 10 and a perfect 10, but now it has a pristine 10 that's the new perfect 10, and also offers a gem mint 10. CGC is newer to the grading scene for trading cards starting in 2020 so they haven't gained the industry respect yet in fear that they will stop grading and their graded cards will become meaningless.</p>
                    <div className='example-image-box'>
                        <img src="/HowToImages/cgc-charizard-non-subgrade.jpg" alt="CGC Graded Card" style={{ width: '225px', height: 'auto' }} />
                        <img src="/HowToImages/cgc-charizard.jpg" alt="CGC Graded Card" style={{ width: '225px', height: 'auto' }} />
                    </div>
                    <p className='grader-description'>Note: CGC grading quality is close to if not on par with BGS, offering subgrades and half point grades up to 9.5 and due to these subgrades the overall grades are a lot less subjective. </p>
                </div>
            </div>
            <div className='grade-info-row'>
                <div className='grading-criteria-container'>
                    <h2>Card Grading Criteria</h2>
                    <p className='grader-description'>
                        All cards are graded on the following criteria, but each service has their own specific criteria for how those affect the final grade. Most of the criteria are hard to see on a card as the condition gets closer to 10, but there is a centering tool that can help with checking the centering.
                    </p>
                    <div className='grading-criteria'>
                        <ul>
                            <li>Surface</li>
                            <li>Centering</li>
                            <li>Edges</li>
                            <li>Corners</li>
                        </ul>
                        <img src="/HowToImages/card-centering-tool.jpg" alt="Grading Criteria" style={{ width: '600px', height: 'auto' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeInfo;
