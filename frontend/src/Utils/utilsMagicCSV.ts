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

const convertToCSV = (data: ResultData[], totals: any) => {
    const header = [
        'Card',
        'ID',
        'Card Count',
        'Set',
        ...Object.keys(data[0].prices),
        'Final Link',
        'Historic Price Link',
    ].join(',');

    const rows = data.map(item => [
        item.card,
        item.id,
        item.card_count,
        item.set,
        ...Object.values(item.prices),
        item.final_link,
        item.historic_price_link
    ].join(',')).join('\n');

    // Add totals row
    const totalsRow = [
        'Totals:',
        '',
        totals.card_count,
        ...Object.keys(totals).filter(key => key !== 'card_count').map(key => {
            const value = totals[key];
            if (typeof value === 'number') {
                return `${value.toString().replace('$', '').replace(',', '')}`;
            } else {
                return value; // or return an empty string or handle the non-number value as needed
            }
        }),
        '',
    ].join(',');

    return `${header}\n${rows}\n${totalsRow}`;
};

export const downloadCSV = (results: ResultData[], calculateTotals: (results: ResultData[]) => any) => {
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