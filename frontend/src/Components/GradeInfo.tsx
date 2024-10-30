import React, { useEffect, useState } from 'react';
import '../CSS Sheets/GradeInfo.css';

const GradeInfo: React.FC = () => {
    interface Grade {
        grade: number;
        images: string[];
        description: string;
        // image?: string;
    }

    const [grades, setGrades] = useState<Grade[]>([]);

        useEffect(() => {
            fetch('/HowToImages/grade_info.json')
                .then((response) => response.json())
                .then((data) => setGrades(data))
                .catch((error) => console.error('Error fetching grades:', error));
        }, []);

        return (
        <div className='grades-section'>
            <h2>Card Grades</h2>
            <div style={{ margin: '20px' }}>Card grading is heavily subjective in general and can depend on where/when you get it graded and what card you're having graded. I'll give some examples of each grade from a post by <a href="https://www.elitefourum.com/t/psa-grading-scale-in-pokemon/38612" target="_blank" rel="noopener noreferrer">pfm</a> but, take them with a grain of salt.</div>
            {grades.map((item) => (
                <div className='grade-box' key={item.grade}>
                    <h2>Grade: {item.grade}</h2>
                    <p>{item.description}</p>
                    {item.images.map((img, index) => (
                        <img className='grade-image' key={index} src={'/HowToImages/' + img} alt={item.description} style={{ width: '300px', height: 'auto' }}/>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GradeInfo;