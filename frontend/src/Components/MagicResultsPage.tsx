import React, { useEffect, useState } from 'react';
import '../CSS Sheets/MagicResultsPage.css';
import { motion } from 'framer-motion';

interface ResultData {
    card: string;
    id: string;
    set: string;
    card_count: string;
    prices: {
        [key: string]: string;
    };
    final_link: string;
    img_link: string;
    historic_price_link: string;
    estimatedGrades?: string[];
    isAdvanced?: boolean;
    variant_type?: string;
    isExcluded?: boolean;
}


interface Totals {
    [key: string]: number;
}

const MagicResultsPage: React.FC = () => {
    const [results, setResults] = useState<ResultData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const apiUrl = window.location.host === 'localhost:3000'? 'http://localhost:8000/results' : 'https://api.synderispricechecker.com/results';
                // const apiUrl = 'https://api.synderispricechecker.com/results';
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                // Extract the results from the response
                const formattedResults: ResultData[] = [];
                const length = Object.keys(data.results.card).length;

                for (let i = 0; i < length; i++) {
                    const prices: { [key: string]: string } = {};
                    const priceKeys = [
                        'Usd', 'Usd Foil', 'Usd Etched', 'Eur', 'Eur Foil', 'Tix'
                    ];
                    priceKeys.forEach(key => {
                        prices[key] = data.results[key][i];
                    });
                    formattedResults.push({
                        card: data.results.card[i],
                        id: data.results.id[i],
                        set: data.results.set[i],
                        card_count: data.results.card_count[i],
                        prices,
                        final_link: data.results.final_link[i],
                        img_link: data.results.img_link[i],
                        historic_price_link: data.results.historic_price_link[i],
                        estimatedGrades: data.results.estimatedGrades ? data.results.estimatedGrades[i].split(',') : undefined,
                        isAdvanced: data.results.isAdvanced ? data.results.isAdvanced[i] : undefined,
                        // cardVariants: data.results.cardVariants ? data.results.cardVariants[i] : undefined,
                        variant_type: data.results.variant_type ? data.results.variant_type[i] : undefined
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

    const convertToCSV = (data: ResultData[], totals: any) => {
        const header = [
            'Card',
            'ID',
            'Card Count',
            ...Object.keys(data[0].prices),
            'Final Link',
            'Historic Price Link',
        ].join(',');

        const rows = data.map(item => [
            item.card,
            item.id,
            item.card_count,
            ...Object.values(item.prices),
            item.final_link,
            item.historic_price_link
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
        const nonExcludedResults = results.filter(item => !item.isExcluded);
        const totals = calculateTotals(results);
        const csvData = convertToCSV(nonExcludedResults, totals);
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
            'Usd': 0,
            'Usd Foil': 0,
            'Usd Etched': 0,
            'Eur': 0,
            'Eur Foil': 0,
            'Tix': 0,
        };

        return results
            .filter(item => !item.isExcluded) // Only include non-excluded items
            .reduce((totals, item) => {
                const count = parseInt(item.card_count) || 0;
                totals.card_count += count;

                Object.keys(totals).forEach(key => {
                    if (key !== 'card_count'&& key in item.prices) {
                        totals[key] += (parseFloat(item.prices[key]?.replace(/[^0-9.-]+/g, '')) || 0) * count;
                    }
                });

                return totals;
            }, initialTotals);
    };

    const totals = calculateTotals(results);

    const handleRowClick = (index: number, event: React.MouseEvent) => {
        if (event.target instanceof HTMLAnchorElement) return;
        if (event.shiftKey && lastClickedIndex !== null) {
            // Handle shift-click for bulk selection
            const start = Math.min(lastClickedIndex, index);
            const end = Math.max(lastClickedIndex, index);
            
            const newResults = [...results];
            const newSelectedRows = new Set(selectedRows);
            
            for (let i = start; i <= end; i++) {
                newResults[i].isExcluded = newResults[lastClickedIndex].isExcluded;
                if (newResults[i].isExcluded) {
                    newSelectedRows.add(i);
                } else {
                    newSelectedRows.delete(i);
                }
            }
            
            setResults(newResults);
            setSelectedRows(newSelectedRows);
        } else {
            // Handle single click
            const newResults = [...results];
            newResults[index].isExcluded = !newResults[index].isExcluded;
            
            const newSelectedRows = new Set(selectedRows);
            if (newResults[index].isExcluded) {
                newSelectedRows.add(index);
            } else {
                newSelectedRows.delete(index);
            }
            
            setResults(newResults);
            setSelectedRows(newSelectedRows);
        }
        
        setLastClickedIndex(index);
    };

    return (
        <motion.div 
            className="results-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="results-header">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Results
                </motion.h1>
                {error && <p>Error: {error}</p>}
                <button onClick={downloadCSV} style={{ marginBottom: '20px' }} className="download-button">
                    Download CSV
                </button>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Card</th>
                            <th>ID</th>
                            <th>Set</th>
                            <th>Card Count</th>
                            {Object.keys(results[0]?.prices || {}).map((price, index) => (
                                <th key={index}>{price}</th>
                            ))}
                            <th>Page Link</th>
                            <th>Historic Prices</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <React.Fragment key={`${index}-fragment`}>
                                <tr 
                                    key={`${index}-main`}
                                    onClick={(e) => handleRowClick(index, e)}
                                    className={`
                                        row-clickable
                                        ${item.isExcluded ? 'row-excluded' : ''}
                                        ${selectedRows.has(index) ? 'row-selected' : ''}
                                    `}
                                >
                                    <td
                                        onMouseEnter={(e) => handleMouseEnter(index, e)}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseMove={handleMouseMove}>
                                        <a className='img-hover-link' href={item.img_link} target="_blank" rel="noopener noreferrer">{item.card}</a>
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.set}</td>
                                    <td>{item.card_count}</td>
                                    {Object.values(item.prices).map((priceValue, gradeIndex) => (
                                        <td key={gradeIndex}>
                                            {Object.keys(item.prices)[gradeIndex].includes('Usd') ? '$' : Object.keys(item.prices)[gradeIndex].includes('Eur') ? '€' : ''}{priceValue}
                                        </td>
                                    ))}
                                    <td>
                                        <a href={item.final_link} target="_blank" rel="noopener noreferrer">{item.variant_type || 'View'}</a>
                                    </td>
                                    <td>
                                        <a href={item.historic_price_link} target="_blank" rel="noopener noreferrer">{item.variant_type || 'View'}</a>
                                    </td>
                                </tr>
                                {hoveredIndex === index && (
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: mousePosition.y - 200,  // Adjust the offset as needed
                                            left: mousePosition.x + 10,  // Adjust the offset as needed
                                            zIndex: 1000,
                                        }}
                                    >
                                        <img
                                            src={item.img_link}
                                            alt="Card"
                                            style={{
                                                width: '200px',
                                                border: '1px solid #ccc',
                                                backgroundColor: '#ffffff68',
                                                padding: '5px',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        <tr className="totals-row">
                            <td colSpan={3}><strong>Totals:</strong></td>
                            <td>{totals.card_count}</td>
                            {Object.keys(totals).filter(key => key !== 'card_count').map((key, index) => (
                                <td key={index}>
                                    {key.includes('Usd') ? '$' : key.includes('Eur') ? '€' : ''}{totals[key].toFixed(2)}
                                </td>
                            ))}
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default MagicResultsPage;