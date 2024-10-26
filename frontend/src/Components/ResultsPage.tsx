import React, { useEffect, useState } from 'react';
import '../CSS Sheets/ResultsPage.css';
import { motion, AnimatePresence } from 'framer-motion';

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
    estimatedGrades?: string[];
    isAdvanced?: boolean;
    cardVariants?: CardVariant[];
    // variant?: boolean;
    variant_type?: string;
    isExcluded?: boolean;  // Add this new property
}

interface CardVariant {
    type: string;  // 'shadowless', 'no_symbol', 'artwork_variant', etc.
    name: string;
    id: string;
    img_link: string;
    final_link: string;
    price_modifier: number;
}

interface Totals {
    [key: string]: number;
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<ResultData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedGrades, setSelectedGrades] = useState<{[key: string]: string}>({});
    const [showEstimatedTotals, setShowEstimatedTotals] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
    const [advancedSearchTypes, setAdvancedSearchTypes] = useState<string[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<{[key: string]: CardVariant}>({});
    const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

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
                        estimatedGrades: data.results.estimatedGrades ? data.results.estimatedGrades[i].split(',') : undefined,
                        isAdvanced: data.results.isAdvanced ? data.results.isAdvanced[i] : undefined,
                        cardVariants: data.results.cardVariants ? data.results.cardVariants[i] : undefined,
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

        return results
            .filter(item => !item.isExcluded) // Only include non-excluded items
            .reduce((totals, item) => {
                const count = parseInt(item.card_count) || 0;
                totals.card_count += count;

                Object.keys(totals).forEach(key => {
                    if (key !== 'card_count' && key in item.grades) {
                        totals[key] += (parseFloat(item.grades[key]?.replace(/[^0-9.-]+/g, '')) || 0) * count;
                    }
                });

                return totals;
            }, initialTotals);
    };

    const totals = calculateTotals(results);

    const handleGradeClick = (cardIndex: number, grade: string) => {
        setSelectedGrades(prev => ({
            ...prev,
            [`${cardIndex}`]: grade
        }));
        setShowEstimatedTotals(true);
    };

    const calculateEstimatedTotals = () => {
        return results.reduce((totals, item, index) => {
            const count = parseInt(item.card_count) || 0;
            const selectedGrade = selectedGrades[index];
            
            if (selectedGrade) {
                const priceStr = item.grades[selectedGrade];
                const price = parseFloat(priceStr?.replace(/[^0-9.-]+/g, '') || '0');
                totals[selectedGrade] = (totals[selectedGrade] || 0) + (price * count);
            }
            
            return totals;
        }, {} as {[key: string]: number});
    };

    // const handleAdvancedSearchToggle = (index: number) => {
    //     const newResults = [...results];
    //     newResults[index].isAdvanced = !newResults[index].isAdvanced;
    //     setResults(newResults);
        
    //     if (newResults[index].isAdvanced) {
    //         fetchCardVariants(newResults[index]);
    //     }
    // };

    // const fetchCardVariants = async (card: ResultData) => {
    //     try {
    //         const response = await fetch(
    //             `https://pueedtoh01.execute-api.us-east-2.amazonaws.com/prod/variants?card=${card.card}&id=${card.id}`
    //         );
    //         if (!response.ok) throw new Error('Failed to fetch variants');
            
    //         const variants = await response.json();
    //         const updatedResults = results.map(r => 
    //             r.id === card.id ? { ...r, cardVariants: variants } : r
    //         );
    //         setResults(updatedResults);
    //     } catch (err) {
    //         console.error('Error fetching variants:', err);
    //     }
    // };

    const handleRowClick = (index: number, event: React.MouseEvent) => {
        if (event.shiftKey && lastClickedIndex !== null) {
            // Handle shift-click for bulk selection
            const start = Math.min(lastClickedIndex, index);
            const end = Math.max(lastClickedIndex, index);
            
            const newResults = [...results];
            const newSelectedRows = new Set(selectedRows);
            
            for (let i = start; i <= end; i++) {
                newResults[i].isExcluded = !newResults[lastClickedIndex].isExcluded;
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
                <AnimatePresence>
                    {showAdvancedSearch && (
                        <motion.div 
                            className="advanced-search-controls"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button 
                                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                className="toggle-advanced-button"
                            >
                                {showAdvancedSearch ? 'Hide Advanced Search' : 'Show Advanced Search'}
                            </button>
                            <input 
                                type="text"
                                placeholder="Enter variant type (e.g., shadowless)"
                                onChange={(e) => setAdvancedSearchTypes(
                                    e.target.value.split(',').map(t => t.trim())
                                )}
                                className="variant-type-input"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
                            {item.isAdvanced && item.cardVariants?.map((variant, vIndex) => (
                                <tr 
                                    key={`${index}-variant-${vIndex}`}
                                    className={`
                                        variant-row
                                        ${item.isExcluded ? 'row-excluded' : ''}
                                    `}
                                >
                                    <td>
                                        <span className="variant-tag">{variant.type}</span>
                                        <span className="img-hover-link">
                                            {variant.name}
                                            <span className="img-hover-tooltip">
                                                <img src={variant.img_link} alt="Card Variant" />
                                            </span>
                                        </span>
                                    </td>
                                    <td>{variant.id}</td>
                                    <td>{item.card_count}</td>
                                    {/* Modified prices based on variant.price_modifier */}
                                    {Object.entries(item.grades).map(([grade, price], gradeIndex) => (
                                        <td key={gradeIndex}>
                                            ${(parseFloat(price.replace(/[^0-9.-]+/g, '')) * variant.price_modifier).toFixed(2)}
                                        </td>
                                    ))}
                                    <td>
                                        <a href={item.final_link} target="_blank" rel="noopener noreferrer">{item.variant_type ? (item.variant_type) : ('View')}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    <tr className="totals-row">
                        <td colSpan={2}><strong>Totals:</strong></td>
                        <td>{totals.card_count}</td>
                        {Object.keys(totals).filter(key => key !== 'card_count').map((key, index) => (
                            <td key={index}>${totals[key].toFixed(2)}</td>
                        ))}
                        <td></td>
                    </tr>
                    
                    {showEstimatedTotals && (
                        <tr className="estimated-totals-row">
                            <td colSpan={2}><strong>Estimated Totals:</strong></td>
                            <td>{totals.card_count}</td>
                            {Object.entries(calculateEstimatedTotals()).map(([grade, total], index) => (
                                <td key={index} className="estimated-total">
                                    ${total.toFixed(2)}
                                </td>
                            ))}
                            <td></td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* <Button
                startIcon={<HelpOutline />}
                onClick={() => setShowGuide(true)}
                className="help-button"
            >
                CSV Format Guide
            </Button> */}
{/* 
            {showGuide && (
                <div className="modal-overlay" onClick={() => setShowGuide(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>CSV Format Guide</h2>
                            <button 
                                className="close-button"
                                onClick={() => setShowGuide(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <CSVGuideContent />
                        </div>
                    </div>
                </div>
            )} */}
        </motion.div>
    );
};

export default ResultsPage;