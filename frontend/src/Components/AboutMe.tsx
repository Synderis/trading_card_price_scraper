import React from 'react';
import '../CSS Sheets/AboutMe.css'; // Assuming you have a CSS file in the same folder for styling.

const AboutMe: React.FC = () => {
    return (
        <div className="about-container">
            <h1>About Me</h1>
            <p>
                Welcome to my bulk card pricing tool. I go by Synderis online and my background is in Data Engineering/Software Engineering primarily in Python and SQL.
                I had a lot of cards I wanted to look up and the tools and the APIs currently available were lackluster at best.
                There wasn't an easy way to get to the exact card pages I wanted without clicking on hundreds of links,
                so I decided to create my own. In that process I figured some of my friends might want to use it too so I created a front end for the project.
            </p>

            <h2>Technologies Used</h2>
            <ul>
                <li>Built with React for frontend development.</li>
                <li>FastAPI for backend API development.</li>
                <li>Requests and BeautifulSoup for web scraping.</li>
                <li>Papa Parse for CSV data handling in the browser.</li>
                <li>Pytorch and Google Cloud Vision for image processing.</li>
                <li>Was hosted on AWS lambda but now is hosted on ECS</li>
            </ul>

            <h2>What This Project Offers</h2>
            <p>
                This project allows users to import CSV data, manage their cards, 
                perform data validation, and get pricing information by grade. 
                It includes features for tracking foil, reverse holo, and first edition cards, 
                ensuring accurate card information is pulled.
            </p>

            <p>
                Feel free to explore the app and upload your own card collections. Thank you for stopping by!
            </p>
        </div>
    );
};

export default AboutMe;
