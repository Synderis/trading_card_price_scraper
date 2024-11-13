// csvValidator.ts
import { Row } from './types';

const truth_values = (value: any): boolean => {
    return ['true', true, 1, 'y', 'Y', 't', 'T', 'True', 'TRUE'].includes(value);
};

const false_values = (value: any): boolean => {
    return ['false', false, 0, 'n', 'N', 'f', 'F', 'False', 'FALSE', null].includes(value);
};

export const validateCSVRow = (row: Row, magicCardChecked: boolean) => {
    let isInvalid = false; // Initialize to false by default
    if (magicCardChecked) {
        isInvalid = !(
            (truth_values(row.foil) || false_values(row.foil)) &&
            (truth_values(row.surgefoil) || false_values(row.surgefoil)) &&
            (truth_values(row.etched) || false_values(row.etched)) &&
            (truth_values(row.extended_art) || false_values(row.extended_art)) &&
            (truth_values(row.full_art) || false_values(row.full_art)) &&
            (row.card_count === null || row.card_count > 0)
        );
    } else {
        isInvalid = !(
            (row.card_name !== null && (row.card_id !== null && row.card_id !== '')) &&
            (truth_values(row.reverse_holo) || false_values(row.reverse_holo)) &&
            (truth_values(row.first_edition) || false_values(row.first_edition)) &&
            (row.card_count === null || row.card_count > 0)
        );
    }
    return isInvalid;
};