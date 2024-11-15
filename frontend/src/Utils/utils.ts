export const truth_values = (value: any): boolean => {
    return ['true', true, 1, 'y', 'Y', 't', 'T', 'True', 'TRUE'].includes(value);
};

export const false_values = (value: any): boolean => {
    return ['false', false, 0, 'n', 'N', 'f', 'F', 'False', 'FALSE', null].includes(value);
};