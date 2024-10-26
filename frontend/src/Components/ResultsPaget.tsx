import React, { useEffect, useState } from 'react';
import '../CSS Sheets/ResultsPage.css';

interface ResultData {
    card: string;
    id: string;
    card_count: string;
    Ungraded: string;
    grades: {
        [key: string]: string;
    };
    final_link: string;
    img_link: string;
}

interface Totals {
    [key: string]: number;
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<ResultData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`https://pueedtoh01.execute-api.us-east-2.amazonaws.com/prod/results`);
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                // Extract the results from the response
                const formattedResults: ResultData[] = [];
                const length = Object.keys(data.results.card).length;

                for (let i = 0; i < length; i++) {
                    const grades: { [key: string]: string } = {};
                    const gradeKeys = [
                        'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                        'BGS 10 Black', 'CGC 10 Pristine'
                    ];
                    gradeKeys.forEach(key => {
                        grades[key] = data.results[key][i];
                    });

                    formattedResults.push({
                        card: data.results.card[i],
                        id: data.results.id[i],
                        card_count: data.results.card_count[i],
                        Ungraded: data.results.Ungraded[i],
                        grades,
                        final_link: data.results.final_link[i],
                        img_link: data.results.img_link[i],
                    });
                }
                setResults(formattedResults);
            } catch (err) {
                setError((err as Error)?.message || 'An unknown error occurred');
                console.error('Error fetching results:', err);
            }
        };

        fetchResults();
    }, []);

    const convertToCSV = (data: ResultData[], totals: any) => {
        const header = [
            'Card',
            'ID',
            'Card Count',
            ...Object.keys(data[0].grades),
            'Final Link',
        ].join(',');

        const rows = data.map(item => [
            item.card,
            item.id,
            item.card_count,
            ...Object.values(item.grades),
            item.final_link,
        ].join(',')).join('\n');

        // Add totals row
        const totalsRow = [
            'Totals:',
            '',
            totals.card_count,
            ...Object.keys(totals).filter(key => key !== 'card_count').map(key => `$${totals[key].toFixed(2)}`),
            '',
        ].join(',');

        return `${header}\n${rows}\n${totalsRow}`;
    };

    const downloadCSV = () => {
        const totals = calculateTotals(results);
        const csvData = convertToCSV(results, totals);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateTotals = (results: ResultData[]): Totals => {
        const initialTotals: Totals = {
            card_count: 0,
            Ungraded: 0,
            'Grade 1': 0,
            'Grade 2': 0,
            'Grade 3': 0,
            'Grade 4': 0,
            'Grade 5': 0,
            'Grade 6': 0,
            'Grade 7': 0,
            'Grade 8': 0,
            'Grade 9': 0,
            'Grade 9.5': 0,
            'SGC 10': 0,
            'CGC 10': 0,
            'PSA 10': 0,
            'BGS 10': 0,
            'BGS 10 Black': 0,
            'CGC 10 Pristine': 0,
        };

        return results.reduce((totals, item) => {
            const count = parseInt(item.card_count) || 0; // Convert card_count to an integer

            totals.card_count += count; // Add card_count

            // Calculate totals for each grade category multiplied by card_count
            Object.keys(totals).forEach(key => {
                if (key !== 'card_count' && key in item.grades) {
                    totals[key] += (parseFloat(item.grades[key]?.replace(/[^0-9.-]+/g, '')) || 0) * count;
                }
            });

            return totals;
        }, initialTotals);
    };

    const totals = calculateTotals(results);

    return (
        <div className="results-page">
            <h1>Results</h1>
            {error && <p>Error: {error}</p>}
            <button onClick={downloadCSV} style={{ marginBottom: '20px' }} className="download-button">
                Download CSV
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>ID</th>
                        <th>Card Count</th>
                        {Object.keys(results[0]?.grades || {}).map((grade, index) => (
                            <th key={index}>{grade}</th>
                        ))}
                        <th>Page Link</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <span className="img-hover-link">
                                    {item.card}
                                    <span className="img-hover-tooltip">
                                        <img src={item.img_link} alt="Card" />
                                    </span>
                                </span>
                            </td>
                            <td>{item.id}</td>
                            <td>{item.card_count}</td>
                            {Object.values(item.grades).map((gradeValue, gradeIndex) => (
                                <td key={gradeIndex}>{gradeValue}</td>
                            ))}
                            <td>
                                <a href={item.final_link} target="_blank" rel="noopener noreferrer">View</a>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2}><strong>Totals:</strong></td>
                        <td>{totals.card_count}</td>
                        {Object.keys(totals).filter(key => key !== 'card_count').map((key, index) => (
                            <td key={index}>${totals[key].toFixed(2)}</td>
                        ))}
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
