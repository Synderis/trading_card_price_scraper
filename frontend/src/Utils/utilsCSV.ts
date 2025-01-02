import { ResultData } from "../Utils/types";

export const downloadTemplateCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
    "card_name,card_id,card_count,variant_type,reverse_holo,first_edition,foil,surgefoil,etched,extended_art,full_art\n" +
    ",,,,,,,,,\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "card_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

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
        ...Object.values(item.grades).map(value => value.replace('$', '').replace(',', '')),
        item.final_link,
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