import React, { useState } from 'react';
import GradedExamples from './GradedExamples';
import GradeInfo from './GradeInfo';
import VariantInfo from './VariantInfo';
import ExampleCSV from './ExampleCSV';
import '../CSS Sheets/HowTo.css';

const HowTo: React.FC = () => {
    // State to track which component is currently visible
    const [activeComponent, setActiveComponent] = useState<string>('exampleCSV'); // Default state

    // Function to render the active component based on state
    const renderComponent = () => {
        switch (activeComponent) {
            case 'exampleCSV':
                return <ExampleCSV />;
            case 'variantInfo':
                return <VariantInfo />;
            case 'gradedExamples':
                return <GradedExamples />;
            case 'gradeInfo':
                return <GradeInfo />;
            default:
                return <ExampleCSV />;
        }
    };

    return (
        <div className="how-to-container">
            <div className="button-container">
                <button
                    className="how-to-button"
                    data-active={activeComponent === 'exampleCSV'}
                    onClick={() => setActiveComponent('exampleCSV')}
                >
                    Show Example CSV
                </button>
                <button
                    className="how-to-button"
                    data-active={activeComponent === 'variantInfo'}
                    onClick={() => setActiveComponent('variantInfo')}
                >
                    Show Variant Info
                </button>
                <button
                    className="how-to-button"
                    data-active={activeComponent === 'gradedExamples'}
                    onClick={() => setActiveComponent('gradedExamples')}
                >
                    Show Graded Examples
                </button>
                <button
                    className="how-to-button"
                    data-active={activeComponent === 'gradeInfo'}
                    onClick={() => setActiveComponent('gradeInfo')}
                >
                    Show Grading Info
                </button>
            </div>
            <div className="component-container">
                {renderComponent()}
            </div>
        </div>
    );
};

export default HowTo;
